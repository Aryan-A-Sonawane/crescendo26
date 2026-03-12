import "@/lib/neon-client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { neon } from "@neondatabase/serverless";

const schema = z.object({
  email: z.string().email("Invalid email"),
  interests: z.array(z.string().max(100)).max(50),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { email, interests } = parsed.data;
    const sql = neon(process.env.DATABASE_URL!);
    const interestsJson = JSON.stringify(interests);

    await sql`
      UPDATE registrations
      SET event_interests = ${interestsJson}
      WHERE email = ${email.toLowerCase().trim()}
    `;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[register/interests]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
