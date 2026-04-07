import { NextRequest, NextResponse } from "next/server";
import { canCoordinateEvent, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function GET(req: NextRequest) {
  try {
    const email = normalizeEmail(getRequestEmail(req));
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const eventIdRaw = req.nextUrl.searchParams.get("eventId");
    const search = (req.nextUrl.searchParams.get("search") || "").trim();
    const limitRaw = Number(req.nextUrl.searchParams.get("limit") || "120");
    const limit = Number.isFinite(limitRaw) ? Math.max(10, Math.min(limitRaw, 300)) : 120;

    if (!eventIdRaw) {
      return NextResponse.json({ error: "eventId is required" }, { status: 400 });
    }

    const eventId = Number(eventIdRaw);
    if (!Number.isInteger(eventId) || eventId <= 0) {
      return NextResponse.json({ error: "Invalid eventId" }, { status: 400 });
    }

    if (!(await canCoordinateEvent(email, eventId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const event = await db.managedEvent.findUnique({
      where: { id: eventId },
      select: { id: true, name: true, category: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const searchFilter = search
      ? {
          OR: [
            { participantName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const categoryMatches: Array<Record<string, unknown>> = [];
    const category = (event.category || "").toLowerCase();
    if (category.includes("technical")) {
      // Technical events should only include technical-pass fallback rows, not all technical events.
      categoryMatches.push({ eventName: { contains: "technical pass", mode: "insensitive" } });
      categoryMatches.push({ eventName: { contains: "tech pass", mode: "insensitive" } });
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

    const selectShape = {
      id: true,
      participantName: true,
      email: true,
      phone: true,
      isPlayed: true,
      queueEntries: {
        where: {
          eventId: event.id,
          status: { in: ["QUEUED", "IN_PROGRESS"] },
        },
        select: { id: true },
        take: 1,
      },
    };

    const tickets = await db.ticket.findMany({
      where: {
        ...eventScopeFilter,
        ...searchFilter,
      },
      orderBy: [{ participantName: "asc" }, { createdAt: "desc" }],
      take: limit,
      select: selectShape,
    });

    const mapped = tickets.map((ticket: {
      id: number;
      participantName: string;
      email: string;
      phone: string | null;
      isPlayed: boolean;
      queueEntries: Array<{ id: number }>;
    }) => ({
      id: ticket.id,
      participantName: ticket.participantName,
      participantEmail: ticket.email,
      participantPhone: ticket.phone,
      isPlayed: ticket.isPlayed,
      inQueue: ticket.queueEntries.length > 0,
    }));

    const uniqueMap = new Map<string, (typeof mapped)[number]>();
    for (const participant of mapped) {
      const key = `${participant.participantEmail.toLowerCase()}|${participant.participantName.toLowerCase()}`;
      const existing = uniqueMap.get(key);
      if (!existing) {
        uniqueMap.set(key, participant);
        continue;
      }

      // Prefer rows that reflect progressed state for operational accuracy.
      const existingRank = (existing.inQueue ? 2 : 0) + (existing.isPlayed ? 1 : 0);
      const currentRank = (participant.inQueue ? 2 : 0) + (participant.isPlayed ? 1 : 0);
      if (currentRank > existingRank) {
        uniqueMap.set(key, participant);
      }
    }

    return NextResponse.json(
      {
        participants: Array.from(uniqueMap.values()),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[dashboard/coordinator/registered]", error);
    return NextResponse.json({ error: "Failed to load registered participants." }, { status: 500 });
  }
}
