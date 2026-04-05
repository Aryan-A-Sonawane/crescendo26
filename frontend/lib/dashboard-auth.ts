import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const DEFAULT_SUPER_ADMIN_EMAILS = [
  "s.aryan0505@gmail.com",
  "amit.aryan23@vit.edu",
  "agbhalerao1895@gmail.com",
  "anushka.bhalerao23@vit.edu",
];

export function normalizeEmail(value: string | null | undefined): string {
  return (value || "").trim().toLowerCase();
}

export function getRequestEmail(req: NextRequest): string {
  const headerEmail = req.headers.get("x-user-email");
  const queryEmail = req.nextUrl.searchParams.get("email");
  return normalizeEmail(headerEmail || queryEmail);
}

export function getSuperAdminEmails(): string[] {
  const envConfigured = (process.env.SUPER_ADMIN_EMAILS || "")
    .split(",")
    .map((item) => normalizeEmail(item))
    .filter(Boolean);

  const merged = new Set<string>([...DEFAULT_SUPER_ADMIN_EMAILS.map(normalizeEmail), ...envConfigured]);
  return Array.from(merged);
}

export async function getAccess(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return { isSuperAdmin: false, isCoordinator: false };
  }

  const envSuperAdmin = getSuperAdminEmails().includes(normalized);
  const dbAccess = await db.adminAccess.findUnique({
    where: { email: normalized },
    select: { role: true },
  });

  const isSuperAdmin = envSuperAdmin || dbAccess?.role === "SUPER_ADMIN";
  const isCoordinator = isSuperAdmin || dbAccess?.role === "COORDINATOR";

  return { isSuperAdmin, isCoordinator };
}

export async function assertSuperAdmin(email: string): Promise<boolean> {
  const access = await getAccess(email);
  return access.isSuperAdmin;
}

export async function canCoordinateEvent(email: string, eventId: number): Promise<boolean> {
  const access = await getAccess(email);
  if (access.isSuperAdmin) return true;
  if (!access.isCoordinator) return false;

  const assignment = await db.coordinatorAssignment.findUnique({
    where: {
      email_eventId: {
        email: normalizeEmail(email),
        eventId,
      },
    },
    select: { id: true },
  });

  return Boolean(assignment);
}
