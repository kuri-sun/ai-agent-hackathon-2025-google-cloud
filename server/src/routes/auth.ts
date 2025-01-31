import { Router } from "express";
import { googleCallback, googleLogin } from "../controllers/auth";

const router = Router();

// Route for Google login
router.get("/google/login", googleLogin);
router.post("/google/callback", googleCallback);

export default router;
