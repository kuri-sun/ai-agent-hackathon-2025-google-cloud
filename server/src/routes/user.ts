import express from "express";
import { getUser, deleteUser } from "../controllers/user";
import { authorize } from "../middleware/middleware";

const router = express.Router();

// GET /users/:userId - Get user by ID
router.get("/:userId", authorize, getUser);

// DELETE /users/:userId - Delete user by ID
router.delete("/:userId", authorize, deleteUser);

export default router;
