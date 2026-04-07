import { NextRequest, NextResponse } from "next/server";
import { getAccess, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function GET(req: NextRequest) {
  try {
    const email = normalizeEmail(getRequestEmail(req));
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const access = await getAccess(email);
    if (!access.isCoordinator && !access.isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const where = access.isSuperAdmin
      ? {}
      : {
          assignments: {
            some: { email },
          },
        };

    const events = await db.managedEvent.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        queueEntries: {
          orderBy: { queuedAt: "desc" },
        },
        rounds: {
          orderBy: { startedAt: "desc" },
          include: {
            entryA: true,
            entryB: true,
          },
        },
      },
    });

    const roundIds = events.flatMap((event: { rounds?: Array<{ id: number }> }) =>
      (event.rounds || []).map((round) => round.id)
    );

    let roundMetaById = new Map<number, { isStarred: boolean; starredAt: string | null; remarks: string | null }>();

    if (roundIds.length > 0) {
      const uniqueIds = Array.from(new Set(roundIds)).filter((id) => Number.isInteger(id));
      const metaRows = await db.$queryRawUnsafe(
        `SELECT id, is_starred AS "isStarred", starred_at AS "starredAt", remarks FROM event_rounds WHERE id IN (${uniqueIds.join(",")})`
      );

      if (Array.isArray(metaRows)) {
        roundMetaById = new Map(
          metaRows.map((row: { id: number; isStarred: boolean; starredAt: string | null; remarks: string | null }) => [
            row.id,
            {
              isStarred: Boolean(row.isStarred),
              starredAt: row.starredAt || null,
              remarks: row.remarks || null,
            },
          ])
        );
      }
    }

    const enrichedEvents = events.map((event: { rounds?: Array<{ id: number }>; [key: string]: unknown }) => ({
      ...event,
      rounds: (event.rounds || []).map((round: { id: number; [key: string]: unknown }) => {
        const meta = roundMetaById.get(round.id);
        return {
          ...round,
          isStarred: meta?.isStarred ?? false,
          starredAt: meta?.starredAt ?? null,
          remarks: meta?.remarks ?? null,
        };
      }),
    }));

    return NextResponse.json({ events: enrichedEvents }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/coordinator/events]", error);
    return NextResponse.json({ error: "Failed to load coordinator events." }, { status: 500 });
  }
}
