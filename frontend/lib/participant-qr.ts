import { normalizeEmail } from "@/lib/dashboard-auth";

const PARTICIPANT_QR_PREFIX = "cr26_u_";

export function buildParticipantQrToken(rawEmail: string): string {
  const email = normalizeEmail(rawEmail);
  if (!email) {
    throw new Error("Email is required to generate participant QR token.");
  }

  const encodedEmail = Buffer.from(email, "utf8").toString("base64url");
  return `${PARTICIPANT_QR_PREFIX}${encodedEmail}`;
}

export function parseParticipantQrToken(rawToken: string): string | null {
  const token = String(rawToken || "").trim();
  if (!token.startsWith(PARTICIPANT_QR_PREFIX)) {
    return null;
  }

  const encodedEmail = token.slice(PARTICIPANT_QR_PREFIX.length);
  if (!encodedEmail) {
    return null;
  }

  try {
    const decoded = Buffer.from(encodedEmail, "base64url").toString("utf8");
    const normalized = normalizeEmail(decoded);
    return normalized || null;
  } catch {
    return null;
  }
}
