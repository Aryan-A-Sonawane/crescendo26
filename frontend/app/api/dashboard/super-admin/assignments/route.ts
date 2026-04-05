import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertSuperAdmin, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const createSchema = z.object({
  email: z.string().email(),
  eventId: z.number().int().positive(),
});

const removeSchema = createSchema;

export async function POST(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    if (!(await assertSuperAdmin(actorEmail))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const email = normalizeEmail(parsed.data.email);

    let assignment = await db.coordinatorAssignment.findFirst({
      where: {
        email,
        eventId: parsed.data.eventId,
      },
    });

    if (!assignment) {
      assignment = await db.coordinatorAssignment.create({
        data: {
          email,
          eventId: parsed.data.eventId,
        },
      });
    }

    await db.adminAccess.upsert({
      where: { email },
      create: { email, role: "COORDINATOR" },
      update: {
        role: "COORDINATOR",
      },
    });

    return NextResponse.json({ assignment }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/super-admin/assignments:post]", error);
    return NextResponse.json({ error: "Failed to assign coordinator." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    if (!(await assertSuperAdmin(actorEmail))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = removeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const email = normalizeEmail(parsed.data.email);
    await db.coordinatorAssignment.deleteMany({
      where: {
        email,
        eventId: parsed.data.eventId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/super-admin/assignments:delete]", error);
    return NextResponse.json({ error: "Failed to remove assignment." }, { status: 500 });
  }
}
