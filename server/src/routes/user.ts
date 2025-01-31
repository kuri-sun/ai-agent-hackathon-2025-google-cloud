import express from "express";
import { getUser, deleteUser, validateUser } from "../controllers/user";
import { authorize } from "../middleware/middleware";

const router = express.Router();

router.get("/validate", authorize, validateUser);
router.get("/:userId", authorize, getUser);
router.delete("/:userId", authorize, deleteUser);

export default router;
