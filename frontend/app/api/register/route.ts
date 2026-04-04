import "@/lib/neon-client";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const registrationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Invalid email address").max(200),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  college: z.string().min(2, "College name is required").max(200),
  authProvider: z.enum(["otp", "google"]).default("otp"),
  googleId: z.string().min(1).max(255).optional(),
  password: z.string().min(8, "Password must be at least 8 characters").max(128).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const err of parsed.error.issues) {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      }
      return NextResponse.json({ errors: fieldErrors }, { status: 422 });
    }

    const { name, phone, college, authProvider, googleId, password } = parsed.data;
    const email = parsed.data.email.toLowerCase().trim();
    const passwordHash = password ? hashPassword(password) : undefined;

    if (authProvider === "google" && !googleId) {
      return NextResponse.json(
        { errors: { email: "Google account verification is incomplete. Please sign in again." } },
        { status: 422 }
      );
    }

    // Upsert-like behavior by email prevents duplicate records when a user later uses another auth method.
    const existingEmail = await prisma.registration.findUnique({
      where: { email },
      select: {
        id: true,
        phone: true,
        googleId: true,
        authProvider: true,
      },
    });

    if (existingEmail) {
      if (existingEmail.phone !== phone) {
        const phoneOwner = await prisma.registration.findUnique({
          where: { phone },
          select: { id: true, email: true },
        });

        if (phoneOwner && phoneOwner.id !== existingEmail.id) {
          return NextResponse.json(
            { errors: { phone: "This phone number is already linked with another email." } },
            { status: 409 }
          );
        }
      }

      if (authProvider === "google" && existingEmail.googleId && existingEmail.googleId !== googleId) {
        return NextResponse.json(
          { errors: { email: "This email is already linked with another Google account." } },
          { status: 409 }
        );
      }

      const registration = await prisma.registration.update({
        where: { id: existingEmail.id },
        data: {
          name,
          phone,
          college,
          verified: true,
          authProvider:
            existingEmail.authProvider === "google" || authProvider === "google" ? "google" : "otp",
          googleId: authProvider === "google" ? googleId : existingEmail.googleId,
          passwordHash: passwordHash ?? undefined,
        },
      });

      return NextResponse.json(
        { message: "Registration updated successfully!", id: registration.id },
        { status: 200 }
      );
    }

    // Check duplicate phone for brand-new records only.
    const existingPhone = await prisma.registration.findUnique({
      where: { phone },
      select: { id: true },
    });
    if (existingPhone) {
      return NextResponse.json(
        { errors: { phone: "This phone number is already registered." } },
        { status: 409 }
      );
    }

    const registration = await prisma.registration.create({
      data: {
        name,
        email,
        phone,
        college,
        verified: true,
        authProvider,
        googleId: authProvider === "google" ? googleId : null,
        passwordHash: passwordHash ?? null,
      },
    });

    return NextResponse.json(
      { message: "Registration successful!", id: registration.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("[register]", err);

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      const target = Array.isArray(err.meta?.target) ? err.meta?.target.join(",") : String(err.meta?.target || "");
      if (target.includes("email")) {
        return NextResponse.json(
          { errors: { email: "This email is already registered." } },
          { status: 409 }
        );
      }
      if (target.includes("phone")) {
        return NextResponse.json(
          { errors: { phone: "This phone number is already registered." } },
          { status: 409 }
        );
      }
      if (target.includes("google_id")) {
        return NextResponse.json(
          { errors: { email: "This Google account is already linked to another profile." } },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
