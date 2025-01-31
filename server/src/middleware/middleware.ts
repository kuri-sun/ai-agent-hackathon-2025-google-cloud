import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"
  const clientId = req.headers["x-client-id"] as string;

  if (!token) {
    res.status(401).json({ error: "Access token is missing" });
    return;
  }

  try {
    const oAuth2Client = new OAuth2Client(
      clientId,
      process.env.GOOGLE_OIDC_CLIENT_SECRET,
      process.env.GOOGLE_OIDC_CALLBACK_URL
    );

    // Verify the token with Google's OAuth2 client
    const tokenInfo = await oAuth2Client.getTokenInfo(token);

    if (
      !tokenInfo.expiry_date ||
      tokenInfo.expiry_date < new Date().getTime()
    ) {
      res.status(401).json({ error: "Token Invalid" });
      return;
    }

    // Attach user info from the token to the request object
    req.user = {
      userId: tokenInfo.sub,
      email: tokenInfo.email,
    };

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Unauthorized access" });
  }
};
