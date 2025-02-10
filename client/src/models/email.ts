import { ReviewResult } from "./review-result";

export type Thread = {
  id: string;
  historyId: string;
  messages: Email[];
};

export type Email = {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  sizeEstimate: number;
  historyId: string;
  internalDate: string;
  attachments: any[]; // Adjust based on actual attachment structure
  headers: Record<string, unknown>; // Adjust if headers have a specific structure
  headerLines: EmailHeaderLine[];
  date: string;
  html: string;
  text: string;
  textAsHtml: string;
  subject: string;
  references: string[];
  to: EmailRecipient;
  from: EmailRecipient;
  messageId: string;
  inReplyTo: string;
};

type EmailHeaderLine = {
  key: string;
  line: string;
};

type EmailAddress = {
  address: string;
  name: string;
};

type EmailRecipient = {
  value: EmailAddress[];
  html: string;
  text: string;
};

export type EmailPayload = {
  from: string;
  to: string;
  subject: string;
  text: string;
  inReplyTo: string;
  references: string[];
  threadId: string;
};

export type DraftEmail = {
  attachments: any[];
  headers: Record<string, unknown>;
  headerLines: EmailHeaderLine[];
  text: string;
  textAsHtml: string;
  subject: string;
  date: string;
  to: EmailRecipient;
  from: EmailRecipient;
  messageId: string;
  html: string;
  draftId: string;
  threadId: string;
  reviewResult: ReviewResult;
};

export type DraftPayload = {
  from: string;
  to: string;
  subject: string;
  text: string;
  inReplyTo: string;
  references: string[];
  threadId: string;
};
