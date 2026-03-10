import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
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
  try {
    const body = await req.json();
    const parsed = sendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, name } = parsed.data;

    // Check if email is already registered and verified
    const existing = await prisma.registration.findUnique({ where: { email } });
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

    // Invalidate any existing unused OTPs for this email
    await prisma.otpCode.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    // Generate a 6-digit OTP using crypto (secure)
    const otp = String(crypto.randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await prisma.otpCode.create({
      data: { email, code: otp, expiresAt },
    });

    await sendOtpEmail(email, otp, name);

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (err) {
    console.error("[send-otp]", err);
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
