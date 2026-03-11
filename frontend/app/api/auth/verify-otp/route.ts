import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const verifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d{6}$/, "OTP must be numeric"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, otp } = parsed.data;

    const record = await prisma.otpCode.findFirst({
      where: {
        email,
        code: otp,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please request a new one." },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await prisma.otpCode.update({
      where: { id: record.id },
      data: { used: true },
    });

    return NextResponse.json({ verified: true }, { status: 200 });
  } catch (err) {
    console.error("[verify-otp]", err);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
