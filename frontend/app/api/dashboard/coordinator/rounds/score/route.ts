import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { canCoordinateEvent, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const schema = z.object({
  roundId: z.number().int().positive(),
  scoreA: z.number().int().min(0),
  scoreB: z.number().int().min(0).nullable().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const round = await db.eventRound.findUnique({
      where: { id: parsed.data.roundId },
      include: { event: { select: { id: true, format: true, status: true } } },
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
    if (requiresTwo && (parsed.data.scoreB === null || parsed.data.scoreB === undefined)) {
      return NextResponse.json({ error: "Both scores are required for versus events." }, { status: 400 });
    }

    const updated = await db.eventRound.update({
      where: { id: round.id },
      data: {
        scoreA: parsed.data.scoreA,
        scoreB: requiresTwo ? parsed.data.scoreB ?? 0 : null,
      },
    });

    return NextResponse.json({ round: updated }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/coordinator/rounds/score]", error);
    return NextResponse.json({ error: "Failed to update scores." }, { status: 500 });
  }
}
