import express from "express";
import { getHealth } from "../controllers/health";

const router = express.Router();

/**
 * Returns the health status of the server.
 */
router.get("/", getHealth);

export default router;
