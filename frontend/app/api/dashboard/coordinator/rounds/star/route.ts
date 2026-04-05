import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { canCoordinateEvent, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const schema = z.object({
  roundId: z.number().int().positive(),
  isStarred: z.boolean().optional(),
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
      include: {
        event: { select: { id: true } },
      },
    });

    if (!round) {
      return NextResponse.json({ error: "Round not found" }, { status: 404 });
    }

    if (!(await canCoordinateEvent(actorEmail, round.event.id))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (round.status !== "COMPLETED") {
      return NextResponse.json({ error: "Only completed matches can be starred." }, { status: 409 });
    }

    const stateRows = await db.$queryRaw`
      SELECT is_starred AS "isStarred"
      FROM event_rounds
      WHERE id = ${round.id}
      LIMIT 1;
    `;

    const currentIsStarred = Array.isArray(stateRows) && stateRows[0]
      ? Boolean(stateRows[0].isStarred)
      : false;

    const nextIsStarred = parsed.data.isStarred ?? !currentIsStarred;

    const rows = await db.$queryRaw`
      UPDATE event_rounds
      SET is_starred = ${nextIsStarred}, starred_at = ${nextIsStarred ? new Date() : null}
      WHERE id = ${round.id}
      RETURNING
        id,
        status,
        score_a AS "scoreA",
        score_b AS "scoreB",
        started_at AS "startedAt",
        ended_at AS "endedAt",
        is_starred AS "isStarred",
        starred_at AS "starredAt";
    `;

    const updatedRow = Array.isArray(rows) ? rows[0] : null;
    if (!updatedRow) {
      return NextResponse.json({ error: "Round not found during star update." }, { status: 404 });
    }

    return NextResponse.json({ round: updatedRow }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/coordinator/rounds/star]", error);
    return NextResponse.json({ error: "Failed to update star status." }, { status: 500 });
  }
}
