import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { canCoordinateEvent, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const schema = z.object({
  eventId: z.number().int().positive(),
  venue: z.string().max(200).nullable().optional(),
  status: z.enum(["NOT_STARTED", "STARTED", "PAUSED", "COMPLETED"]).optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (!(await canCoordinateEvent(actorEmail, parsed.data.eventId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const event = await db.managedEvent.update({
      where: { id: parsed.data.eventId },
      data: {
        venue: parsed.data.venue ?? undefined,
        status: parsed.data.status ?? undefined,
      },
    });

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/coordinator/event-meta]", error);
    return NextResponse.json({ error: "Failed to update event metadata." }, { status: 500 });
  }
}
