import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registrationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters, spaces, and . ' -"),
  email: z.string().email("Invalid email address").max(200),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  college: z.string().min(2, "College name is required").max(200),
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

    const { name, email, phone, college } = parsed.data;

    // Check duplicate email
    const existingEmail = await prisma.registration.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { errors: { email: "This email is already registered." } },
        { status: 409 }
      );
    }

    // Check duplicate phone
    const existingPhone = await prisma.registration.findUnique({ where: { phone } });
    if (existingPhone) {
      return NextResponse.json(
        { errors: { phone: "This phone number is already registered." } },
        { status: 409 }
      );
    }

    const registration = await prisma.registration.create({
      data: { name, email, phone, college, verified: true },
    });

    return NextResponse.json(
      { message: "Registration successful!", id: registration.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
