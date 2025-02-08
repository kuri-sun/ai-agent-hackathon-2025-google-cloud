import express from "express";
import {
  getEmails,
  getEmail,
  sendEmail,
  createDraftEmail,
  sendDraftEmail,
  updateDraftEmail,
  getReviewedDraftEmails,
  getDraftEmail,
  getEmailThreads,
  getEmailThread,
} from "../controllers/email";

const router = express.Router();

/**
 * GET /emails - Get all emails
 */
router.get("/", getEmails);

/**
 * GET /emails/drafts - Get all drafts
 */
router.get("/drafts", getReviewedDraftEmails);

/**
 * GET /emails/threads - Get all threads
 */
router.get("/threads", getEmailThreads);

/**
 * GET /emails/:emailId - Get email by emailId
 *
 * @param {string} emailId - Email id of the email
 */
router.get("/:emailId", getEmail);

/**
 * POST /emails/send
 *
 * @body {string} from - Email address of the sender
 * @body {string} to - Email address of the recipient
 * @body {string} cc - Email address of the cc
 * @body {string} bcc - Email address of the bcc
 * @body {string} subject - Subject of the email
 * @body {string} text - Body of the email
 * @body {string} inReplyTo - Email id of the email to which the email is a reply
 * @body {string} references - Email id of the email to which the email is a reply
 * @body {string} threadId - Thread id of the email
 */
router.post("/send", sendEmail);

/**
 * GET /emails/drafts/:draftId - Get a draft email
 */
router.get("/drafts/:draftId", getDraftEmail);

/**
 * POST /emails/drafts - Create a draft email
 *
 * @body {string} from - Email address of the sender
 * @body {string} to - Email address of the recipient
 * @body {string} cc - Email address of the cc
 * @body {string} bcc - Email address of the bcc
 * @body {string} subject - Subject of the email
 * @body {string} text - Body of the email
 * @body {string} inReplyTo - Email id of the email to which the email is a reply
 * @body {string} references - Email id of the email to which the email is a reply
 */
router.post("/drafts", createDraftEmail);

/**
 * PUT /emails/drafts/:draftId - Update a draft email
 *
 * @body {string} from - Email address of the sender
 * @body {string} to - Email address of the recipient
 * @body {string} cc - Email address of the cc
 * @body {string} bcc - Email address of the bcc
 * @body {string} subject - Subject of the email
 * @body {string} text - Body of the email
 * @body {string} inReplyTo - Email id of the email to which the email is a reply
 * @body {string} references - Email id of the email to which the email is a reply
 */
router.put("/drafts/:draftId", updateDraftEmail);

/**
 * POST /emails/drafts/:draftId/send - Send a draft email
 *
 * @param {string} draftId - Draft id of the draft email
 */
router.post("/drafts/:draftId/send", sendDraftEmail);

/**
 * GET /emails/threads - Get all threads
 */
router.get("/threads/:threadId", getEmailThread);

export default router;
