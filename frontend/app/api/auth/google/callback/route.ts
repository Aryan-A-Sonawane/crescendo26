import { NextRequest, NextResponse } from "next/server";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
};

type GoogleUserInfo = {
  id?: string;
  email?: string;
  name?: string;
  verified_email?: boolean;
};

function cleanRedirectPath(value: string | undefined): string {
  if (!value || !value.startsWith("/")) {
    return "/onboard";
  }
  return value;
}

function clearOauthCookies(res: NextResponse) {
  res.cookies.set("google_oauth_state", "", { maxAge: 0, path: "/" });
  res.cookies.set("google_oauth_redirect", "", { maxAge: 0, path: "/" });
}

function redirectWithError(req: NextRequest, redirectPath: string, message: string): NextResponse {
  const url = new URL(redirectPath, req.url);
  url.searchParams.set("google_error", message);
  const res = NextResponse.redirect(url);
  clearOauthCookies(res);
  return res;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const cookieState = req.cookies.get("google_oauth_state")?.value;
  const redirectPath = cleanRedirectPath(req.cookies.get("google_oauth_redirect")?.value);

  if (!code || !state || !cookieState || state !== cookieState) {
    return redirectWithError(req, redirectPath, "Google verification failed. Please try again.");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const oauthRedirectUri =
    process.env.GOOGLE_REDIRECT_URI || new URL("/api/auth/google/callback", req.url).toString();

  if (!clientId || !clientSecret) {
    return redirectWithError(req, redirectPath, "Google sign-in is not configured yet.");
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: oauthRedirectUri,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;
    if (!tokenRes.ok || !tokenData.access_token || tokenData.error) {
      return redirectWithError(req, redirectPath, "Unable to sign in with Google right now.");
    }

    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      cache: "no-store",
    });

    const userInfo = (await userInfoRes.json()) as GoogleUserInfo;
    if (!userInfoRes.ok || !userInfo.id || !userInfo.email || !userInfo.name) {
      return redirectWithError(req, redirectPath, "Google did not return profile details.");
    }

    if (!userInfo.verified_email) {
      return redirectWithError(req, redirectPath, "Please use a Google account with a verified email.");
    }

    const successUrl = new URL(redirectPath, req.url);
    successUrl.searchParams.set("google_id", userInfo.id);
    successUrl.searchParams.set("google_email", userInfo.email.toLowerCase().trim());
    successUrl.searchParams.set("google_name", userInfo.name.trim());

    const res = NextResponse.redirect(successUrl);
    clearOauthCookies(res);
    return res;
  } catch (error) {
    console.error("[google-callback]", error);
    return redirectWithError(req, redirectPath, "Google sign-in failed. Please try again.");
  }
}
