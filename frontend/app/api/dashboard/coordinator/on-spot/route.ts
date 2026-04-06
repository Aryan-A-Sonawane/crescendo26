import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { canCoordinateEvent, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const schema = z.object({
  eventId: z.number().int().positive(),
  participantName: z.string().trim().min(2).max(120),
  participantEmail: z.string().trim().email(),
  participantPhone: z.string().trim().min(1).max(30),
  receipt: z.string().trim().min(1).max(120),
  teamName: z.string().max(120).optional().or(z.literal("")),
  teammates: z
    .array(
      z.object({
        name: z.string().min(1).max(120),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().max(30).optional().or(z.literal("")),
      })
    )
    .max(20)
    .optional(),
});

function makeQrToken(email: string, eventId: number, sourceRow: number) {
  const source = `on-spot|${email}|${eventId}|${sourceRow}`;
  const digest = crypto.createHash("sha256").update(source).digest("hex").slice(0, 28);
  return `cr26_${digest}`;
}

export async function POST(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const {
      eventId,
      participantName,
      participantEmail,
      participantPhone,
      receipt,
      teamName = "",
      teammates = [],
    } = parsed.data;

    if (!(await canCoordinateEvent(actorEmail, eventId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const event = await db.managedEvent.findUnique({
      where: { id: eventId },
      select: { id: true, name: true, status: true, allowOnSpotEntry: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!event.allowOnSpotEntry) {
      return NextResponse.json({ error: "On-spot entry is not enabled for this event." }, { status: 409 });
    }

    if (event.status !== "STARTED") {
      return NextResponse.json({ error: "Event is not started. Start the event to allow on-spot entry." }, { status: 409 });
    }

    const cleanReceipt = String(receipt).trim();
    const cleanName = participantName.trim();
    const cleanEmail = normalizeEmail(participantEmail);
    const finalEmail = cleanEmail;
    const cleanPhone = String(participantPhone).trim();

    const sourceRow =
      ((Math.floor(Date.now() / 1000) % 1_500_000_000) + Math.floor(Math.random() * 100_000)) | 0;
    const qrToken = makeQrToken(finalEmail, eventId, sourceRow);

    const teamMeta =
      teamName.trim() || teammates.length > 0
        ? {
            teamName: teamName.trim() || null,
            teammates,
          }
        : null;

    const ticket = await db.ticket.create({
      data: {
        sourceFile: "on_spot_entry",
        sourceRow,
        eventName: event.name,
        eventId: event.id,
        email: finalEmail,
        participantName: cleanName,
        phone: cleanPhone,
        receipt: cleanReceipt,
        qrToken,
        isPlayed: false,
        playedAt: null,
        playedByEmail: null,
      },
      select: {
        id: true,
        eventId: true,
        participantName: true,
        email: true,
        phone: true,
      },
    });

    const queueEntry = await db.eventQueueEntry.create({
      data: {
        eventId: event.id,
        ticketId: ticket.id,
        participantName: ticket.participantName,
        participantEmail: ticket.email,
        participantPhone: ticket.phone,
        teamMembersJson: teamMeta,
      },
    });

    return NextResponse.json({ ticket, queueEntry }, { status: 201 });
  } catch (error) {
    console.error("[dashboard/coordinator/on-spot]", error);
    return NextResponse.json({ error: "Failed to create on-spot entry." }, { status: 500 });
  }
}
