import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { canCoordinateEvent, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const schema = z.object({
  eventId: z.number().int().positive(),
  queueEntryId: z.number().int().positive().optional(),
  opponentQueueEntryId: z.number().int().positive().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { eventId, queueEntryId, opponentQueueEntryId } = parsed.data;
    if (!(await canCoordinateEvent(actorEmail, eventId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const event = await db.managedEvent.findUnique({
      where: { id: eventId },
      select: { id: true, format: true, status: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "STARTED") {
      return NextResponse.json({ error: "Event is not started. Start the event to proceed." }, { status: 409 });
    }

    let queue: Array<{ id: number; eventId: number; status: string; queuedAt: Date; ticketId: number }> = [];
    const isVsFormat = event.format === "SINGLE_VS_SINGLE" || event.format === "TEAM_VS_TEAM";

    if (queueEntryId) {
      const selectedEntry = await db.eventQueueEntry.findUnique({
        where: { id: queueEntryId },
        select: { id: true, eventId: true, status: true, queuedAt: true, ticketId: true },
      });

      if (!selectedEntry || selectedEntry.eventId !== eventId || selectedEntry.status !== "QUEUED") {
        return NextResponse.json({ error: "Selected participant is not available in queue" }, { status: 409 });
      }

      if (isVsFormat) {
        if (!opponentQueueEntryId) {
          return NextResponse.json({ error: "Select an opponent to start a versus match." }, { status: 409 });
        }

        if (opponentQueueEntryId === queueEntryId) {
          return NextResponse.json({ error: "Opponent must be a different queued participant." }, { status: 409 });
        }

        const opponentEntry = await db.eventQueueEntry.findUnique({
          where: { id: opponentQueueEntryId },
          select: { id: true, eventId: true, status: true, queuedAt: true, ticketId: true },
        });

        if (!opponentEntry || opponentEntry.eventId !== eventId || opponentEntry.status !== "QUEUED") {
          return NextResponse.json({ error: "Selected opponent is not available in queue." }, { status: 409 });
        }

        queue = [selectedEntry, opponentEntry].sort(
          (a, b) => new Date(a.queuedAt).getTime() - new Date(b.queuedAt).getTime()
        );
      } else {
        queue = [selectedEntry];
      }
    } else {
      queue = await db.eventQueueEntry.findMany({
        where: { eventId, status: "QUEUED" },
        orderBy: { queuedAt: "asc" },
        take: isVsFormat ? 2 : 1,
        select: { id: true, eventId: true, status: true, queuedAt: true, ticketId: true },
      });
    }

    const requiresTwo = isVsFormat;
    if ((requiresTwo && queue.length < 2) || (!requiresTwo && queue.length < 1)) {
      return NextResponse.json({ error: "Not enough entries in queue" }, { status: 409 });
    }

    const entryA = queue[0];
    const entryB = requiresTwo ? queue[1] : null;

    await db.eventQueueEntry.update({
      where: { id: entryA.id },
      data: { status: "IN_PROGRESS", startedAt: new Date() },
    });

    if (entryB) {
      await db.eventQueueEntry.update({
        where: { id: entryB.id },
        data: { status: "IN_PROGRESS", startedAt: new Date() },
      });
    }

    const now = new Date();
    await db.ticket.update({
      where: { id: entryA.ticketId },
      data: {
        isPlayed: true,
        playedAt: now,
        playedByEmail: actorEmail,
        eventId,
      },
    });

    if (entryB?.ticketId) {
      await db.ticket.update({
        where: { id: entryB.ticketId },
        data: {
          isPlayed: true,
          playedAt: now,
          playedByEmail: actorEmail,
          eventId,
        },
      });
    }

    const createdRound = await db.eventRound.create({
      data: {
        eventId,
        entryAId: entryA.id,
        entryBId: entryB?.id || null,
      },
    });

    const round = await db.eventRound.findUnique({
      where: { id: createdRound.id },
      include: {
        entryA: true,
        entryB: true,
      },
    });

    return NextResponse.json({ round }, { status: 201 });
  } catch (error) {
    console.error("[dashboard/coordinator/rounds/start]", error);
    return NextResponse.json({ error: "Failed to start round." }, { status: 500 });
  }
}
