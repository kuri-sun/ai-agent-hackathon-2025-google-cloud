import express from "express";
import {
  getEmails,
  getEmail,
  replyEmail,
  generateEmailReviewResult,
} from "../controllers/email";

const router = express.Router();

// GET /emails?q={"some+text"}&sort_in={desc/asc}&sort_by={"field+name"}&page={1}&limit={10} - Get all emails
router.get("/", getEmails);

// GET /emails/:emailId - Get email by emailId
router.get("/:emailId", getEmail);

// POST /emails/:emailId/template
router.post("/:emailId/template", generateEmailReviewResult);

// POST /emails/reply - Reply to an email
router.post("/:emailId/reply", replyEmail);

export default router;
