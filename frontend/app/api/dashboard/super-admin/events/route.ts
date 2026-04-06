import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertSuperAdmin, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { getEventCategoryByName, ALL_EVENT_NAMES } from "@/lib/dashboard-events";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const createSchema = z.object({
  name: z.string().min(2).max(200),
  category: z.string().min(2).max(100),
  format: z.enum(["SINGLE_PARTICIPANT", "SINGLE_VS_SINGLE", "TEAM_SOLO", "TEAM_VS_TEAM"]),
  teamSize: z.number().int().positive().max(20).nullable().optional(),
  venue: z.string().max(200).nullable().optional(),
  allowOnSpotEntry: z.boolean().optional(),
  status: z.enum(["NOT_STARTED", "STARTED", "PAUSED", "COMPLETED"]).optional(),
});

const updateSchema = createSchema.extend({
  id: z.number().int().positive(),
});

const syncSchema = z.object({
  syncFromEventsList: z.literal(true),
});

export async function GET(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    if (!(await assertSuperAdmin(actorEmail))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const events = await db.managedEvent.findMany({
      include: { assignments: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/super-admin/events:get]", error);
    return NextResponse.json({ error: "Failed to load events." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    if (!(await assertSuperAdmin(actorEmail))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const syncParsed = syncSchema.safeParse(body);
    if (syncParsed.success) {
      for (const item of ALL_EVENT_NAMES) {
        await db.managedEvent.upsert({
          where: { name: item.name },
          update: { category: item.category },
          create: {
            name: item.name,
            category: item.category,
            format: "SINGLE_PARTICIPANT",
            status: "NOT_STARTED",
          },
        });
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const event = await db.managedEvent.create({
      data: {
        ...parsed.data,
        name: parsed.data.name.trim(),
        category: parsed.data.category.trim(),
        teamSize: parsed.data.teamSize ?? null,
        venue: parsed.data.venue ?? null,
        allowOnSpotEntry: parsed.data.allowOnSpotEntry ?? false,
        status: parsed.data.status ?? "NOT_STARTED",
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("[dashboard/super-admin/events:post]", error);
    return NextResponse.json({ error: "Failed to save event." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    if (!(await assertSuperAdmin(actorEmail))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const data = parsed.data;
    const event = await db.managedEvent.update({
      where: { id: data.id },
      data: {
        name: data.name.trim(),
        category: data.category?.trim() || getEventCategoryByName(data.name),
        format: data.format,
        teamSize: data.teamSize ?? null,
        venue: data.venue ?? null,
        allowOnSpotEntry: data.allowOnSpotEntry ?? false,
        status: data.status ?? "NOT_STARTED",
      },
    });

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/super-admin/events:patch]", error);
    return NextResponse.json({ error: "Failed to update event." }, { status: 500 });
  }
}
