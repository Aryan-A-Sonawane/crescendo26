import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function normalizeRedirectPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/")) {
    return "/onboard";
  }
  return raw;
}

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const failUrl = new URL("/onboard", req.url);
    failUrl.searchParams.set("google_error", "Google sign-in is not configured yet.");
    return NextResponse.redirect(failUrl);
  }

  const redirectPath = normalizeRedirectPath(req.nextUrl.searchParams.get("redirect"));
  const state = crypto.randomBytes(24).toString("hex");
  const oauthRedirectUri =
    process.env.GOOGLE_REDIRECT_URI || new URL("/api/auth/google/callback", req.url).toString();

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", oauthRedirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("state", state);
  googleAuthUrl.searchParams.set("prompt", "select_account");

  const res = NextResponse.redirect(googleAuthUrl);
  const secure = process.env.NODE_ENV === "production";

  res.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  });

  res.cookies.set("google_oauth_redirect", redirectPath, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  });

  return res;
}
