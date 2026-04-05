import { NextRequest, NextResponse } from "next/server";
import { getAccess, getRequestEmail, normalizeEmail } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";

const db = prisma;

export async function GET(req: NextRequest) {
  try {
    const email = normalizeEmail(getRequestEmail(req));
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const access = await getAccess(email);

    const assignedEvents = access.isCoordinator
      ? await db.coordinatorAssignment.findMany({
          where: { email },
          include: { event: true },
          orderBy: { event: { name: "asc" } },
        })
      : [];

    return NextResponse.json(
      {
        email,
        isSuperAdmin: access.isSuperAdmin,
        isCoordinator: access.isCoordinator,
        showDashboardAccess: access.isSuperAdmin || access.isCoordinator,
        assignedEvents: assignedEvents.map((entry) => entry.event),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[dashboard/me]", error);
    return NextResponse.json({ error: "Failed to load access." }, { status: 500 });
  }
}
