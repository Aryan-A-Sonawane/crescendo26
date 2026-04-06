import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { canCoordinateEvent, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const schema = z.object({
  queueEntryId: z.number().int().positive(),
});

export async function DELETE(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const entry = await db.eventQueueEntry.findUnique({
      where: { id: parsed.data.queueEntryId },
      select: { id: true, eventId: true, status: true },
    });

    if (!entry) {
      return NextResponse.json({ error: "Queue entry not found" }, { status: 404 });
    }

    if (!(await canCoordinateEvent(actorEmail, entry.eventId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const event = await db.managedEvent.findUnique({
      where: { id: entry.eventId },
      select: { id: true, status: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "STARTED") {
      return NextResponse.json({ error: "Event is not started. Start the event to proceed." }, { status: 409 });
    }

    if (entry.status !== "QUEUED") {
      return NextResponse.json({ error: "Only queued participants can be removed." }, { status: 409 });
    }

    const linkedRound = await db.eventRound.findFirst({
      where: {
        OR: [{ entryAId: entry.id }, { entryBId: entry.id }],
      },
      select: { id: true },
    });

    if (linkedRound) {
      return NextResponse.json({ error: "Cannot remove participant already linked to a game round." }, { status: 409 });
    }

    await db.eventQueueEntry.delete({ where: { id: entry.id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/coordinator/queue/remove]", error);
    return NextResponse.json({ error: "Failed to remove queue entry." }, { status: 500 });
  }
}
