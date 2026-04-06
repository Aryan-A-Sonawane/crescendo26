import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import "@/lib/neon-client"; // Initialize custom Neon fetch for WARP compatibility
import { neon } from "@neondatabase/serverless";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mailer";
import crypto from "crypto";

const sendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
});

// Rate-limit: max 3 OTP requests per email per 10 minutes
async function isRateLimited(email: string): Promise<boolean> {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const count = await prisma.otpCode.count({
    where: {
      email,
      createdAt: { gte: tenMinutesAgo },
    },
  });
  return count >= 3;
}

export async function POST(req: NextRequest) {
  let createdOtpId: number | null = null;
  try {
    const body = await req.json();
    const parsed = sendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, name } = parsed.data;

    // Check if email is already registered and verified
    const existing = await prisma.registration.findUnique({
      where: { email },
      select: { verified: true },
    });
    if (existing?.verified) {
      return NextResponse.json(
        { error: "This email is already registered for Crescendo'26." },
        { status: 409 }
      );
    }

    // Rate limiting
    if (await isRateLimited(email)) {
      return NextResponse.json(
        { error: "Too many OTP requests. Please wait 10 minutes and try again." },
        { status: 429 }
      );
    }

    // Invalidate any existing unused OTPs for this email (raw SQL — PrismaNeonHttp can't wrap mutations in transactions)
    const sql = neon(process.env.DATABASE_URL!);
    await sql`UPDATE otp_codes SET used = true WHERE email = ${email} AND used = false`;

    // Generate a 6-digit OTP using crypto (secure)
    const otp = String(crypto.randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const otpRow = await prisma.otpCode.create({
      data: { email, code: otp, expiresAt },
      select: { id: true },
    });
    createdOtpId = otpRow.id;

    await sendOtpEmail(email, otp, name);

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (err) {
    if (createdOtpId) {
      try {
        await prisma.otpCode.update({
          where: { id: createdOtpId },
          data: { used: true },
        });
      } catch {
        // Best-effort cleanup only.
      }
    }

    const message = err instanceof Error ? err.message : String(err);
    const isSmtpAuthError = /535|badcredentials|username and password not accepted|invalid login/i.test(message);

    console.error("[send-otp] Error:", {
      message,
      isSmtpAuthError,
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasEmailUser: Boolean(process.env.EMAIL_USER),
      hasEmailPass: Boolean(process.env.EMAIL_PASS),
    });

    if (isSmtpAuthError) {
      return NextResponse.json(
        { error: "Email service authentication failed. Please refresh SMTP app password in server env." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
