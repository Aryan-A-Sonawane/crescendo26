import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/dashboard-auth";
import { buildParticipantQrToken } from "@/lib/participant-qr";

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
      orderBy: [{ eventName: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        eventName: true,
        eventId: true,
        participantName: true,
        phone: true,
        isPlayed: true,
        playedAt: true,
        playedByEmail: true,
        event: {
          select: {
            id: true,
            status: true,
            venue: true,
          },
        },
      },
    });

    const participantName = tickets[0]?.participantName || "Participant";
    const phone = tickets.find((ticket: { phone: string | null }) => Boolean(ticket.phone))?.phone || null;

    const events = tickets
      .filter((ticket: { eventId: number | null; eventName: string }) => Boolean(ticket.eventId || ticket.eventName))
      .map((ticket: {
        id: number;
        eventId: number | null;
        eventName: string;
        isPlayed: boolean;
        playedAt: string | null;
        playedByEmail: string | null;
        event: { id: number; status: "NOT_STARTED" | "STARTED" | "PAUSED" | "COMPLETED"; venue: string | null } | null;
      }) => ({
        id: ticket.id,
        eventId: ticket.eventId,
        eventName: ticket.eventName,
        isPlayed: ticket.isPlayed,
        playedAt: ticket.playedAt,
        playedByEmail: ticket.playedByEmail,
        eventStatus: ticket.event?.status || "NOT_STARTED",
        venue: ticket.event?.venue || null,
      }));

    return NextResponse.json(
      {
        ticket: {
          participantName,
          email,
          phone,
          qrToken: buildParticipantQrToken(email),
        },
        events,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[profile/tickets]", error);
    return NextResponse.json({ error: "Failed to load tickets." }, { status: 500 });
  }
}
