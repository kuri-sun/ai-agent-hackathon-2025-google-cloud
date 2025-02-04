import { Request, Response } from "express";
import {
  callbackGoogle,
  verifyGoogleToken,
} from "../services/auth/google-auth";
import { User } from "../models/user";

export const googleLogin = async (req: Request, res: Response) => {
  const clientId = req.headers["x-client-id"] as string;

  try {
    const url = await verifyGoogleToken(clientId);
    res.status(200).json({ success: true, data: { authorizationUrl: url } });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  const { code } = req.body;
  const clientId = req.headers["x-client-id"] as string;

  try {
    // Verify the Google token
    const { tokens, payload } = await callbackGoogle(clientId, code);

    const userId = payload?.sub; // Google user ID
    const email = payload?.email;

    if (!userId || !email) {
      res
        .status(400)
        .json({ message: "Google token is missing essential user data." });
      return;
    }

    if (!payload.email) {
      throw new Error("Missing email from Google idp");
    }
    const foundUser = await User.findByEmail({ email: payload.email });
    if (foundUser) {
      res.status(200).json({
        success: true,
        data: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        },
      });
      return;
    }

    // if there is no user found in DB, lets create user
    await User.create({
      name: payload.name ?? "",
      email: payload.email ?? "",
      avatar: payload.picture ?? "",
    });

    // Respond with user data and a success message
    res.status(200).json({
      success: true,
      data: {
        data: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
