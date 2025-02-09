import { OAuth2Client } from "google-auth-library";
// import { google } from "googleapis";
import { gmail } from "@googleapis/gmail";
import { composeRawEmail, parseRawEmail } from "../../utils/email-format";
import Mail from "nodemailer/lib/mailer";
import {
  GeminiReviewOutput,
  generateEmailReviewResultFromGemini,
} from "../review/gemini-review";
import { ReviewResult } from "../../models/review";

type EmailOptions = {
  threadId?: string;
} & Mail.Options;

// Helper function to set up the OAuth2 Client
const setupGmailClient = (auth: {
  clientId: string;
  accessToken: string;
  refreshToken: string;
  expiryDate: number;
}) => {
  const { clientId, accessToken, refreshToken, expiryDate } = auth;

  // Set up the OAuth2 Client
  const oAuth2Client = new OAuth2Client(
    clientId,
    process.env.GOOGLE_OIDC_CLIENT_SECRET,
    process.env.GOOGLE_OIDC_CALLBACK_URL
  );

  // Set the credentials
  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expiryDate,
  });

  const gmailClient = gmail({ version: "v1", auth: oAuth2Client });

  return gmailClient;
};

/**
 *  Get messages using Gmail API
 */
export const getMessages = async (
  auth: {
    clientId: string;
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
  },
  q: string = "",
  maxResults: number,
  pageToken: string
) => {
  const gmail = setupGmailClient({ ...auth });

  try {
    // Call Gmail API to get emails
    const listResponse = await gmail.users.messages.list({
      userId: "me",
      q,
      maxResults,
      pageToken,
      labelIds: ["INBOX", "CATEGORY_PERSONAL"],
      includeSpamTrash: false,
    });

    const messages = listResponse.data.messages || [];
    const nextPageToken = listResponse.data.nextPageToken;

    // Call Gmail API to get one email
    const messageData = await Promise.all(
      messages.map(async (message) => {
        const messageResponse = await gmail.users.messages.get({
          userId: "me",
          id: message.id as string,
          format: "raw",
        });

        return messageResponse.data;
      })
    );

    // Parse the messages from RAW
    const parsedMessages = await Promise.all(
      messageData.map(async (message) => {
        const parsed = await parseRawEmail(message.raw);
        const merged = { ...message, ...parsed };
        delete merged.raw;
        delete merged.payload;
        return merged;
      })
    );

    return { messages: parsedMessages, nextPageToken };
  } catch (error) {
    throw new Error(
      "Error getting from Gmail API: " + (error as Error).message
    );
  }
};

/**
 *  Get a message using Gmail API
 */
export const getMessage = async (
  auth: {
    clientId: string;
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
  },
  messageId: string
) => {
  const gmail = setupGmailClient({ ...auth });

  try {
    // Call Gmail API to get one email
    const messageData = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "raw",
    });

    // Parse the messages from RAW
    const parsedMessage = await parseRawEmail(messageData.data.raw);
    delete messageData.data.raw;

    return { ...parsedMessage, ...messageData.data };
  } catch (error) {
    throw new Error(
      "Error getting from Gmail API: " + (error as Error).message
    );
  }
};

/**
 * Send a message using Gmail API
 */
export const sendMessage = async (
  auth: {
    clientId: string;
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
  },
  email: EmailOptions
) => {
  try {
    const gmail = setupGmailClient({ ...auth });
    const { from, to, subject, text, inReplyTo, references, threadId } = email;

    // compose raw email
    const raw = await composeRawEmail({
      from,
      to,
      subject,
      text,
      html: text,
      inReplyTo,
      references,
    });

    // send gmail
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw,
        threadId,
      },
    });

    return response.data;
  } catch (err) {
    throw new Error(
      "Gmail API: Error sending email: " + (err as Error).message
    );
  }
};

/**
 *  Get a draft using Gmail API
 */
export const getDraft = async (
  auth: {
    clientId: string;
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
  },
  draftId: string
) => {
  const gmail = setupGmailClient({ ...auth });

  try {
    // Call Gmail API to get one draft
    const messageData = await gmail.users.drafts.get({
      userId: "me",
      id: draftId,
      format: "raw",
    });

    // Parse the messages from RAW
    const parsedMessage = await parseRawEmail(messageData.data.message?.raw);

    // Get the review.
    const reviewResult = await ReviewResult.findByDraftId({
      draftId,
    });

    const merged = {
      id: messageData.data.id,
      ...messageData.data.message,
      ...parsedMessage,
      reviewResult,
    };
    delete merged.raw;

    return merged;
  } catch (error) {
    throw new Error(
      "Error getting from Gmail API: " + (error as Error).message
    );
  }
};

/**
 * Get a list of drafts
 */
export const getDrafts = async (
  auth: {
    clientId: string;
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
  },
  q: string = "",
  maxResults: number = 10,
  pageToken: string | undefined = undefined
) => {
  const gmail = setupGmailClient({ ...auth });
  try {
    const listResponse = await gmail.users.drafts.list({
      userId: "me",
      q,
      maxResults,
      pageToken,
      includeSpamTrash: false,
    });

    const drafts = listResponse.data.drafts || [];
    const nextPageToken = listResponse.data.nextPageToken;

    const draftsData = await Promise.all(
      drafts.map(async (draft) => {
        const draftResponse = await gmail.users.drafts.get({
          userId: "me",
          id: draft.id as string,
          format: "raw",
        });

        // Get the review.
        let reviewResult;
        if (draft.id) {
          reviewResult = await ReviewResult.findByDraftId({
            draftId: draft.id,
          });
        }

        return { ...draftResponse.data, reviewResult };
      })
    );

    // Parse the draft from RAW
    const parsedDrafts = await Promise.all(
      draftsData.map(async (draft) => {
        const parsed = await parseRawEmail(draft.message?.raw);
        const merged = {
          ...parsed,
          draftId: draft.id,
          threadId: draft.message?.threadId,
          reviewResult: draft.reviewResult,
        };

        return merged;
      })
    );

    return { drafts: parsedDrafts, nextPageToken };
  } catch (error) {
    throw new Error(
      "Error getting from Gmail API: " + (error as Error).message
    );
  }
};

/**
 * Create a draft using Gmail API
 */
export const createDraft = async (
  auth: {
    clientId: string;
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
  },
  email: EmailOptions,
  isReview: boolean = true
) => {
  const gmail = setupGmailClient({ ...auth });
  const { from, to, bcc, cc, subject, text, inReplyTo, references, threadId } =
    email;

  try {
    // compose raw email
    const raw = await composeRawEmail({
      from,
      to,
      subject,
      text,
      html: text,
      inReplyTo,
      references,
    });

    // compose draft email
    const response = await gmail.users.drafts.create({
      userId: "me",
      requestBody: {
        message: {
          threadId,
          raw,
        },
      },
    });

    // genereate review result from Gemini
    let geminiReview = { reviews: [] } as GeminiReviewOutput;
    if (isReview) {
      geminiReview = await generateEmailReviewResultFromGemini(
        JSON.stringify({
          from,
          to,
          cc,
          bcc,
          subject,
          text,
        })
      );
    }

    // create a review result in DB.
    if (!response.data.id) {
      throw new Error("Gmail API: Error creating draft: No draft ID");
    }
    ReviewResult.create({
      draftId: response.data.id,
      reviews: geminiReview.reviews,
    });

    return { ...response.data, reviewResult: geminiReview };
  } catch (err) {
    throw new Error(
      "Gmail API: Error sending email: " + (err as Error).message
    );
  }
};

/**
 * Update a draft using Gmail API
 */
export const updateDraft = async (
  auth: {
    clientId: string;
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
  },
  email: EmailOptions,
  draftId: string,
  isReview: boolean = true
) => {
  const gmail = setupGmailClient({ ...auth });
  const { from, to, cc, bcc, subject, text, inReplyTo, references, threadId } =
    email;

  try {
    // compose raw email
    const raw = await composeRawEmail({
      from,
      to,
      subject,
      text,
      html: text,
      references: references,
      inReplyTo,
    });

    // compose draft email
    const updated = await gmail.users.drafts.update({
      userId: "me",
      id: draftId,
      requestBody: {
        message: {
          raw,
          threadId,
        },
      },
    });

    // genereate review result from Gemini
    let geminiReview = { reviews: [] } as GeminiReviewOutput;
    if (isReview) {
      geminiReview = await generateEmailReviewResultFromGemini(
        JSON.stringify({
          from,
          to,
          cc,
          bcc,
          subject,
          text,
        })
      );

      // update the review result in DB.
      const found = await ReviewResult.findByDraftId({ draftId });
      if (!found) {
        await ReviewResult.create({
          draftId,
          reviews: geminiReview.reviews,
        });
      } else {
        await ReviewResult.updateByDraftId({
          draftId,
          reviews: geminiReview.reviews,
        });
      }
    }

    // return updated.data;
    return { ...updated.data, reviewResult: geminiReview };
  } catch (err) {
    throw new Error(
      "Gmail API: Error sending email: " + (err as Error).message
    );
  }
};

/**
 * Send draft using Gmail API
 */
export const sendDraft = async (
  auth: {
    clientId: string;
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
  },
  draftId: string
) => {
  const gmail = setupGmailClient({ ...auth });

  try {
    // send draft email
    const response = await gmail.users.drafts.send({
      userId: "me",
      requestBody: {
        id: draftId,
      },
    });

    return response.data;
  } catch (err) {
    throw new Error(
      "Gmail API: Error sending email: " + (err as Error).message
    );
  }
};

/**
 * Geta a list of threads using Gmail API
 */
export const getThreads = async (
  auth: {
    clientId: string;
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
  },
  q: string = "",
  maxResults: number,
  pageToken: string
) => {
  const gmail = setupGmailClient({ ...auth });

  try {
    const listResponse = await gmail.users.threads.list({
      userId: "me",
      labelIds: ["INBOX", "CATEGORY_PERSONAL"],
      q,
      maxResults,
      pageToken,
    });

    const threads = listResponse.data.threads || [];
    const nextPageToken = listResponse.data.nextPageToken;

    const threadData = await Promise.all(
      threads.map(async (thread) => {
        const threadResponse = await gmail.users.threads.get({
          userId: "me",
          id: thread.id as string,
        });

        if (threadResponse.data.messages) {
          const messageResponse = await gmail.users.messages.get({
            userId: "me",
            id: threadResponse.data.messages[0].id as string,
            format: "raw",
          });

          const parsed = await parseRawEmail(messageResponse.data.raw);
          const merged = { ...threadResponse.data.messages[0], ...parsed };
          delete merged.raw;

          threadResponse.data.messages[0] = merged;
        }

        return threadResponse.data;
      })
    );

    return { threads: threadData, nextPageToken };
  } catch (error) {
    throw new Error(
      "Error getting from Gmail API: " + (error as Error).message
    );
  }
};

/**
 * Get a thread using Gmail API
 */
export const getThread = async (
  auth: {
    clientId: string;
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
  },
  threadId: string
) => {
  const gmail = setupGmailClient({ ...auth });

  try {
    // Call Gmail API to get one email
    const threadData = await gmail.users.threads.get({
      userId: "me",
      id: threadId,
      format: "minimal",
    });

    // Parse the messages from RAW
    const threadWithMessages = await Promise.all(
      threadData.data.messages?.map(async (message) => {
        const messageResponse = await gmail.users.messages.get({
          userId: "me",
          id: message.id as string,
          format: "raw",
        });

        const parsed = await parseRawEmail(messageResponse.data.raw);
        const merged = { ...message, ...parsed };
        delete merged.raw;
        return merged;
      }) || []
    );

    return { ...threadData.data, messages: threadWithMessages };
  } catch (error) {
    throw new Error(
      "Error getting from Gmail API: " + (error as Error).message
    );
  }
};
