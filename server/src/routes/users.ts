import express from "express";
import { getUser, deleteUser, validateUser } from "../controllers/user";
import { authorize } from "../middleware/middleware";

const router = express.Router();

/**
 * Validate the current logged-in user and its info.
 */
router.get("/validate", authorize, validateUser);

/**
 * Get user by ID.
 */
router.get("/:userId", authorize, getUser);

/**
 * Delete user by ID.
 */
router.delete("/:userId", authorize, deleteUser);

export default router;
