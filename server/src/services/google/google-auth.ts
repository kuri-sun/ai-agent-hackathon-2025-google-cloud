import { Credentials, OAuth2Client, TokenPayload } from "google-auth-library";

export async function verifyGoogleToken(clientId: string) {
  const oAuth2Client = new OAuth2Client(
    clientId,
    process.env.GOOGLE_OIDC_CLIENT_SECRET,
    process.env.GOOGLE_OIDC_CALLBACK_URL
  );

  try {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });

    return authorizeUrl;
  } catch (error) {
    throw new Error("Token verification failed: " + (error as Error).message);
  }
}

export async function callbackGoogle(
  clientId: string,
  code: string
): Promise<{ tokens: Credentials; payload: TokenPayload }> {
  const oAuth2Client = new OAuth2Client(
    clientId,
    process.env.GOOGLE_OIDC_CLIENT_SECRET,
    process.env.GOOGLE_OIDC_CALLBACK_URL
  );

  // Get tokens
  if (!code) {
    throw new Error("Missing code parameter");
  }

  const { tokens } = await oAuth2Client.getToken(code);

  // Get id_token
  if (!tokens.id_token) {
    throw new Error("Missing id token");
  }

  const ticket = await oAuth2Client.verifyIdToken({
    maxExpiry: 1.5 * 365 * 24 * 60 * 60, // 1.5 year
    idToken: tokens.id_token,
    audience: clientId, // Specify the client ID of your app.
  });

  // Get payload
  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Invalid token");
  }

  return { payload, tokens };
}
