import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/dashboard-auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function GET(req: NextRequest) {
  try {
    const email = normalizeEmail(req.nextUrl.searchParams.get("email"));
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const tickets = await db.ticket.findMany({
      where: { email },
      orderBy: [{ isPlayed: "asc" }, { eventName: "asc" }],
      select: {
        id: true,
        eventName: true,
        participantName: true,
        phone: true,
        qrToken: true,
        isPlayed: true,
        playedAt: true,
        playedByEmail: true,
      },
    });

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    console.error("[profile/tickets]", error);
    return NextResponse.json({ error: "Failed to load tickets." }, { status: 500 });
  }
}
