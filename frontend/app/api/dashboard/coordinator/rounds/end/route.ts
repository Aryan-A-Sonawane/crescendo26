import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { canCoordinateEvent, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const schema = z.object({
  roundId: z.number().int().positive(),
  scoreA: z.number().int().min(0).optional(),
  scoreB: z.number().int().min(0).nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { roundId, scoreA, scoreB } = parsed.data;
    const round = await db.eventRound.findUnique({
      where: { id: roundId },
      include: {
        event: { select: { id: true, format: true, status: true } },
        entryA: { select: { id: true } },
        entryB: { select: { id: true } },
      },
    });

    if (!round) {
      return NextResponse.json({ error: "Round not found" }, { status: 404 });
    }

    if (!(await canCoordinateEvent(actorEmail, round.event.id))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (round.event.status !== "STARTED") {
      return NextResponse.json({ error: "Event is not started. Start the event to proceed." }, { status: 409 });
    }

    const requiresTwo = round.event.format === "SINGLE_VS_SINGLE" || round.event.format === "TEAM_VS_TEAM";
    const updatedRound = await db.eventRound.update({
      where: { id: round.id },
      data: {
        scoreA: scoreA ?? round.scoreA ?? 0,
        scoreB: requiresTwo ? (scoreB ?? round.scoreB ?? null) : null,
        status: "COMPLETED",
        endedAt: new Date(),
      },
    });

    await db.eventQueueEntry.update({
      where: { id: round.entryA.id },
      data: { status: "COMPLETED", completedAt: new Date() },
    });

    if (round.entryB?.id) {
      await db.eventQueueEntry.update({
        where: { id: round.entryB.id },
        data: { status: "COMPLETED", completedAt: new Date() },
      });
    }

    return NextResponse.json({ round: updatedRound }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/coordinator/rounds/end]", error);
    return NextResponse.json({ error: "Failed to end round." }, { status: 500 });
  }
}
