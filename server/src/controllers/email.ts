import { Request, Response } from "express";
import {
  createDraft,
  getDraft,
  getDrafts,
  getMessage,
  getMessages,
  getThread,
  getThreads,
  sendDraft,
  sendMessage,
  updateDraft,
} from "../services/emails/google-gmail";

// Helper function to extract auth info from the request
const extractAuthInfo = (req: Request) => {
  const clientId = req.headers["x-client-id"] as string;
  const accessToken = req.user?.accessToken ?? "";
  const refreshToken = req.headers["x-refresh-token"] as string;
  const expiryDate = req.user?.expiryDate ?? 0;

  return { clientId, accessToken, refreshToken, expiryDate };
};

/**
 *  Get a list of emails(gmails)
 */
export const getEmails = async (req: Request, res: Response) => {
  const { clientId, accessToken, refreshToken, expiryDate } =
    extractAuthInfo(req);
  const { page, max, q } = req.query as {
    page: string;
    max: string;
    q: string;
  };

  try {
    const data = await getMessages(
      {
        clientId,
        accessToken,
        refreshToken,
        expiryDate,
      },
      q,
      max ? Number(max) : 10,
      page
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ success: false, message: error });
  }
};

/**
 * Get a single email(gmail)
 */
export const getEmail = async (req: Request, res: Response) => {
  const { clientId, accessToken, refreshToken, expiryDate } =
    extractAuthInfo(req);

  try {
    const data = await getMessage(
      {
        clientId,
        accessToken,
        refreshToken,
        expiryDate,
      },
      req.params.emailId
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ success: false, message: error });
  }
};

/**
 *  Send an email
 */
export const sendEmail = async (req: Request, res: Response) => {
  try {
    const { clientId, accessToken, refreshToken, expiryDate } =
      extractAuthInfo(req);

    const data = await sendMessage(
      {
        clientId,
        accessToken,
        refreshToken,
        expiryDate,
      },
      req.body
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ success: false, message: error });
  }
};

/**
 *  Get a list of drafts
 */
export const getReviewedDraftEmails = async (req: Request, res: Response) => {
  try {
    const { clientId, accessToken, refreshToken, expiryDate } =
      extractAuthInfo(req);

    const data = await getDrafts(
      {
        clientId,
        accessToken,
        refreshToken,
        expiryDate,
      },
      req.params.draftId
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ success: false, message: error });
  }
};

/**
 *  Get a draft email
 */
export const getDraftEmail = async (req: Request, res: Response) => {
  try {
    const { clientId, accessToken, refreshToken, expiryDate } =
      extractAuthInfo(req);

    const data = await getDraft(
      {
        clientId,
        accessToken,
        refreshToken,
        expiryDate,
      },
      req.params.draftId
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ success: false, message: error });
  }
};

/**
 * Create a draft email
 */
export const createDraftEmail = async (req: Request, res: Response) => {
  try {
    const { clientId, accessToken, refreshToken, expiryDate } =
      extractAuthInfo(req);

    const data = await createDraft(
      {
        clientId,
        accessToken,
        refreshToken,
        expiryDate,
      },
      req.body
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ success: false, message: error });
  }
};

/**
 * Update a draft email
 */
export const updateDraftEmail = async (req: Request, res: Response) => {
  try {
    const { clientId, accessToken, refreshToken, expiryDate } =
      extractAuthInfo(req);

    const data = await updateDraft(
      {
        clientId,
        accessToken,
        refreshToken,
        expiryDate,
      },
      req.body,
      req.params.draftId,
      req.body.isReview
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ success: false, message: error });
  }
};

/**
 *  Send a draft email
 */
export const sendDraftEmail = async (req: Request, res: Response) => {
  try {
    const { clientId, accessToken, refreshToken, expiryDate } =
      extractAuthInfo(req);

    const data = await sendDraft(
      {
        clientId,
        accessToken,
        refreshToken,
        expiryDate,
      },
      req.params.draftId
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ success: false, message: error });
  }
};

/**
 *  Get a list of email threads
 */
export const getEmailThreads = async (req: Request, res: Response) => {
  try {
    const { clientId, accessToken, refreshToken, expiryDate } =
      extractAuthInfo(req);
    const { page, max, q } = req.query as {
      page: string;
      max: string;
      q: string;
    };

    const data = await getThreads(
      {
        clientId,
        accessToken,
        refreshToken,
        expiryDate,
      },
      q,
      max ? Number(max) : 10,
      page
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ success: false, message: error });
  }
};

/**
 * Get a email thread
 */
export const getEmailThread = async (req: Request, res: Response) => {
  try {
    const { clientId, accessToken, refreshToken, expiryDate } =
      extractAuthInfo(req);

    const data = await getThread(
      {
        clientId,
        accessToken,
        refreshToken,
        expiryDate,
      },
      req.params.threadId
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ success: false, message: error });
  }
};
