import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { canCoordinateEvent, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const schema = z.object({
  roundId: z.number().int().positive(),
  remarks: z.string().max(500).optional().or(z.literal("")),
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
        event: { select: { id: true, status: true } },
      },
    });

    if (!round) {
      return NextResponse.json({ error: "Round not found" }, { status: 404 });
    }

    if (!(await canCoordinateEvent(actorEmail, round.event.id))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (round.event.status !== "STARTED" || round.status !== "IN_PROGRESS") {
      return NextResponse.json({ error: "Remarks can only be updated while the match is running." }, { status: 409 });
    }

    const updated = await db.eventRound.update({
      where: { id: round.id },
      data: {
        remarks: (parsed.data.remarks || "").trim() || null,
      },
    });

    return NextResponse.json({ round: updated }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/coordinator/rounds/remarks]", error);
    return NextResponse.json({ error: "Failed to update remarks." }, { status: 500 });
  }
}
