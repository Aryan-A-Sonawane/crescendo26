import "@/lib/neon-client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { neon } from "@neondatabase/serverless";

const schema = z.object({
  email: z.string().email("Invalid email"),
  interests: z.array(z.string().max(100)).max(50),
});

const emailSchema = z.object({
  email: z.string().email("Invalid email"),
});

function parseInterests(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email")?.toLowerCase().trim() ?? "";
    const parsed = emailSchema.safeParse({ email });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);
    const registration = await sql<{ event_interests: string | null }>`
      SELECT event_interests
      FROM registrations
      WHERE lower(email) = lower(${parsed.data.email})
      LIMIT 1
    `;

    if (registration.length === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({ interests: parseInterests(registration[0].event_interests) }, { status: 200 });
  } catch (err) {
    console.error("[register/interests:get]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { email, interests } = parsed.data;
    const interestsJson = JSON.stringify(interests);

    const sql = neon(process.env.DATABASE_URL!);
    const updateResult = await sql<{ id: number }>`
      UPDATE registrations
      SET event_interests = ${interestsJson}
      WHERE lower(email) = lower(${email.toLowerCase().trim()})
      RETURNING id
    `;

    if (updateResult.length === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[register/interests]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
