import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertSuperAdmin, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const schema = z.object({
  email: z.string().email(),
  role: z.enum(["COORDINATOR", "SUPER_ADMIN"]).default("COORDINATOR"),
});

const deleteSchema = z.object({
  email: z.string().email(),
});

export async function GET(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    if (!(await assertSuperAdmin(actorEmail))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const coordinators = await db.adminAccess.findMany({
      orderBy: [{ role: "desc" }, { email: "asc" }],
    });

    const emails = coordinators.map((item: { email: string }) => item.email);
    const assignments = emails.length
      ? await db.coordinatorAssignment.findMany({
          where: { email: { in: emails } },
          include: {
            event: {
              select: { id: true, name: true, category: true },
            },
          },
          orderBy: [{ email: "asc" }, { event: { name: "asc" } }],
        })
      : [];

    const assignmentsByEmail = new Map<string, unknown[]>();
    for (const assignment of assignments) {
      const current = assignmentsByEmail.get(assignment.email) || [];
      current.push(assignment);
      assignmentsByEmail.set(assignment.email, current);
    }

    const result = coordinators.map((item: { email: string; role: "SUPER_ADMIN" | "COORDINATOR" }) => ({
      ...item,
      assignments: assignmentsByEmail.get(item.email) || [],
    }));

    return NextResponse.json({ coordinators: result }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/super-admin/coordinators:get]", error);
    return NextResponse.json({ error: "Failed to load coordinators." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    if (!(await assertSuperAdmin(actorEmail))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const email = normalizeEmail(parsed.data.email);
    const coordinator = await db.adminAccess.upsert({
      where: { email },
      update: { role: parsed.data.role },
      create: { email, role: parsed.data.role },
    });

    return NextResponse.json({ coordinator }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/super-admin/coordinators:post]", error);
    return NextResponse.json({ error: "Failed to save coordinator." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    if (!(await assertSuperAdmin(actorEmail))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = deleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const email = normalizeEmail(parsed.data.email);
    await db.coordinatorAssignment.deleteMany({ where: { email } });
    await db.adminAccess.deleteMany({ where: { email } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/super-admin/coordinators:delete]", error);
    return NextResponse.json({ error: "Failed to remove coordinator access." }, { status: 500 });
  }
}
