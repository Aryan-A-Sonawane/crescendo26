import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { canCoordinateEvent, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";
import { parseParticipantQrToken } from "@/lib/participant-qr";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const teammateSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
});

const schema = z.object({
  eventId: z.number().int().positive(),
  qrToken: z.string().min(6).optional(),
  ticketId: z.number().int().positive().optional(),
  teamName: z.string().max(120).optional().or(z.literal("")),
  teammates: z.array(teammateSchema).max(20).optional(),
}).refine((value) => Boolean(value.qrToken || value.ticketId), {
  message: "Either qrToken or ticketId is required",
});

const editTeamSchema = z.object({
  queueEntryId: z.number().int().positive(),
  teamName: z.string().max(120).optional().or(z.literal("")),
  teammates: z.array(teammateSchema).max(20).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { eventId, qrToken, ticketId, teamName = "", teammates = [] } = parsed.data;

    if (!(await canCoordinateEvent(actorEmail, eventId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const event = await db.managedEvent.findUnique({
      where: { id: eventId },
      select: { id: true, name: true, category: true, status: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "STARTED") {
      return NextResponse.json({ error: "Event is not started. Start the event to allow queue operations." }, { status: 409 });
    }

    const categoryMatches: Array<Record<string, unknown>> = [];
    const category = (event.category || "").toLowerCase();
    if (category.includes("technical")) {
      categoryMatches.push({ eventName: { contains: "technical", mode: "insensitive" } });
    }
    if (category.includes("sports")) {
      categoryMatches.push({ eventName: { contains: "sports", mode: "insensitive" } });
    }
    const isEcCategory =
      category.includes("cultural") ||
      category.startsWith("ec") ||
      category.includes(" ec ") ||
      category.includes("ec and");

    if (isEcCategory) {
      categoryMatches.push({ eventName: { contains: "-ec", mode: "insensitive" } });
      categoryMatches.push({ eventName: { contains: " ec", mode: "insensitive" } });
      categoryMatches.push({ eventName: { contains: "cultural", mode: "insensitive" } });
    }

    const eventScopeFilter = {
      OR: [
        { eventId: event.id },
        { eventName: { equals: event.name, mode: "insensitive" } },
        ...categoryMatches,
      ],
    };

    let ticket: {
      id: number;
      eventId: number | null;
      eventName: string;
      participantName: string;
      email: string;
      phone: string | null;
      isPlayed: boolean;
    } | null = null;

    if (ticketId) {
      ticket = await db.ticket.findUnique({
        where: { id: ticketId },
        select: {
          id: true,
          eventId: true,
          eventName: true,
          participantName: true,
          email: true,
          phone: true,
          isPlayed: true,
        },
      });
    } else if (qrToken) {
      const participantEmail = parseParticipantQrToken(qrToken);
      if (!participantEmail) {
        return NextResponse.json(
          { error: "Invalid participant QR. Please use the latest QR from Profile." },
          { status: 409 }
        );
      }

      const alreadyPlayedForEvent = await db.ticket.findFirst({
        where: {
          email: participantEmail,
          isPlayed: true,
          ...eventScopeFilter,
        },
        select: { id: true },
      });

      if (alreadyPlayedForEvent) {
        return NextResponse.json(
          { error: "Participant has already played this event." },
          { status: 409 }
        );
      }

      // Single QR per participant email: resolve event ticket by email + selected event.
      ticket = await db.ticket.findFirst({
        where: {
          email: participantEmail,
          isPlayed: false,
          ...eventScopeFilter,
        },
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          eventId: true,
          eventName: true,
          participantName: true,
          email: true,
          phone: true,
          isPlayed: true,
        },
      });

      if (!ticket) {
        ticket = await db.ticket.findFirst({
          where: {
            email: participantEmail,
            ...eventScopeFilter,
          },
          orderBy: [{ createdAt: "desc" }],
          select: {
            id: true,
            eventId: true,
            eventName: true,
            participantName: true,
            email: true,
            phone: true,
            isPlayed: true,
          },
        });
      }
    }

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.isPlayed) {
      return NextResponse.json({ error: "Ticket already used" }, { status: 409 });
    }

    if (ticket.eventId && ticket.eventId !== eventId) {
      return NextResponse.json({ error: "Ticket belongs to another event" }, { status: 409 });
    }

    const ticketEventName = (ticket.eventName || "").toLowerCase();
    const eventName = (event.name || "").toLowerCase();

    const ticketMatchesEventScope =
      ticket.eventId === event.id ||
      (eventName ? ticketEventName === eventName : false) ||
      categoryMatches.some((match) => {
        const contains = (match as { eventName?: { contains?: string } }).eventName?.contains;
        return contains ? ticketEventName.includes(contains.toLowerCase()) : false;
      });

    if (!ticketMatchesEventScope) {
      return NextResponse.json({ error: "No eligible ticket found for this event." }, { status: 409 });
    }

    const existingQueue = await db.eventQueueEntry.findFirst({
      where: {
        eventId,
        ticketId: ticket.id,
        status: { in: ["QUEUED", "IN_PROGRESS"] },
      },
      select: { id: true },
    });

    if (existingQueue) {
      return NextResponse.json({ error: "Ticket already in queue" }, { status: 409 });
    }

    const normalizedTeamName = teamName.trim();
    const teamMeta =
      normalizedTeamName || teammates.length > 0
        ? {
            teamName: normalizedTeamName || null,
            teammates,
          }
        : null;

    const queueEntry = await db.eventQueueEntry.create({
      data: {
        eventId,
        ticketId: ticket.id,
        participantName: ticket.participantName,
        participantEmail: ticket.email,
        participantPhone: ticket.phone || null,
        teamMembersJson: teamMeta,
      },
    });

    return NextResponse.json({ queueEntry }, { status: 201 });
  } catch (error) {
    console.error("[dashboard/coordinator/queue]", error);
    return NextResponse.json({ error: "Failed to add entry to queue." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    const body = await req.json();
    const parsed = editTeamSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { queueEntryId, teamName = "", teammates = [] } = parsed.data;

    const entry = await db.eventQueueEntry.findUnique({
      where: { id: queueEntryId },
      select: { id: true, eventId: true, status: true },
    });

    if (!entry) {
      return NextResponse.json({ error: "Queue entry not found" }, { status: 404 });
    }

    if (!(await canCoordinateEvent(actorEmail, entry.eventId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (entry.status !== "QUEUED") {
      return NextResponse.json({ error: "Team details can only be edited while participant is in queue." }, { status: 409 });
    }

    const normalizedTeamName = teamName.trim();
    const teamMeta =
      normalizedTeamName || teammates.length > 0
        ? {
            teamName: normalizedTeamName || null,
            teammates,
          }
        : null;

    const updated = await db.eventQueueEntry.update({
      where: { id: queueEntryId },
      data: {
        teamMembersJson: teamMeta,
      },
      select: {
        id: true,
        eventId: true,
        teamMembersJson: true,
      },
    });

    return NextResponse.json({ queueEntry: updated }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/coordinator/queue:patch]", error);
    return NextResponse.json({ error: "Failed to update team details." }, { status: 500 });
  }
}
