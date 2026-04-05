import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { canCoordinateEvent, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const schema = z.object({
  queueEntryId: z.number().int().positive(),
  status: z.enum(["QUEUED", "IN_PROGRESS", "COMPLETED"]),
});

export async function PATCH(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const existing = await db.eventQueueEntry.findUnique({
      where: { id: parsed.data.queueEntryId },
      select: { id: true, eventId: true, status: true, startedAt: true, ticketId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Queue entry not found" }, { status: 404 });
    }

    if (!(await canCoordinateEvent(actorEmail, existing.eventId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const event = await db.managedEvent.findUnique({
      where: { id: existing.eventId },
      select: { id: true, status: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "STARTED") {
      return NextResponse.json({ error: "Event is not started. Start the event to proceed." }, { status: 409 });
    }

    if (
      (existing.status === "IN_PROGRESS" && parsed.data.status === "QUEUED") ||
      (existing.status === "COMPLETED" && parsed.data.status !== "COMPLETED")
    ) {
      return NextResponse.json({ error: "Invalid status transition" }, { status: 409 });
    }

    const now = new Date();
    const data: Record<string, unknown> = { status: parsed.data.status };

    if (parsed.data.status === "QUEUED") {
      data.startedAt = null;
      data.completedAt = null;
    }

    if (parsed.data.status === "IN_PROGRESS") {
      data.startedAt = now;
      data.completedAt = null;
    }

    if (parsed.data.status === "COMPLETED") {
      data.completedAt = now;
      if (!existing.startedAt) data.startedAt = now;
    }

    const queueEntry = await db.eventQueueEntry.update({
      where: { id: existing.id },
      data,
    });

    if (
      (parsed.data.status === "IN_PROGRESS" || parsed.data.status === "COMPLETED") &&
      existing.ticketId
    ) {
      await db.ticket.update({
        where: { id: existing.ticketId },
        data: {
          isPlayed: true,
          playedAt: now,
          playedByEmail: actorEmail,
          eventId: existing.eventId,
        },
      });
    }

    return NextResponse.json({ queueEntry }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/coordinator/queue/status]", error);
    return NextResponse.json({ error: "Failed to update queue status." }, { status: 500 });
  }
}
