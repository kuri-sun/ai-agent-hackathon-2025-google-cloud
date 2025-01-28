import express from "express";
import {
  getEmails,
  getEmail,
  getResponseEmailTemplate,
  replyEmail,
} from "../controllers/email";

const router = express.Router();

// GET /emails?q={"some+text"}&sort_in={desc/asc}&sort_by={"field+name"}&page={1}&limit={10} - Get all emails
router.get("/", getEmails);

// GET /emails/:emailId - Get email by emailId
router.get("/:emailId", getEmail);

// GET /emails/:emailId/template - Get post by postId
router.post("/:emailId/template", getResponseEmailTemplate);

// POST /emails/reply - Reply to an email
router.post("/:emailId/reply", replyEmail);

export default router;
