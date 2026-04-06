import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestEmail, normalizeEmail, assertVenueTeam } from "@/lib/dashboard-auth";
import { parseParticipantQrToken } from "@/lib/participant-qr";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const createSchema = z.object({
  qrToken: z.string().min(6),
});

function isMissingGateStorageError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const code =
    "code" in error && typeof (error as { code?: unknown }).code === "string"
      ? (error as { code: string }).code
      : "";
  if (code === "P2021") return true;

  const message =
    "message" in error && typeof (error as { message?: unknown }).message === "string"
      ? (error as { message: string }).message.toLowerCase()
      : "";

  return (
    message.includes("gate_entry_logs") &&
    (message.includes("does not exist") || message.includes("doesn't exist") || message.includes("relation"))
  );
}

async function ensureGateEntryStorage() {
  await db.$executeRawUnsafe(
    `CREATE TABLE IF NOT EXISTS gate_entry_logs (
      id SERIAL PRIMARY KEY,
      participant_email TEXT NOT NULL,
      participant_name TEXT NOT NULL,
      participant_phone TEXT,
      participant_college TEXT,
      qr_token TEXT NOT NULL,
      scanned_by_email TEXT NOT NULL,
      scanned_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      entry_date TEXT NOT NULL
    )`
  );

  await db.$executeRawUnsafe(
    "CREATE INDEX IF NOT EXISTS gate_entry_logs_scanned_at_idx ON gate_entry_logs (scanned_at)"
  );
  await db.$executeRawUnsafe(
    "CREATE INDEX IF NOT EXISTS gate_entry_logs_scanned_by_email_scanned_at_idx ON gate_entry_logs (scanned_by_email, scanned_at)"
  );
}

async function getRecentEntries() {
  return db.gateEntryLog.findMany({
    orderBy: { scannedAt: "desc" },
    take: 300,
    select: {
      id: true,
      participantEmail: true,
      participantName: true,
      participantPhone: true,
      participantCollege: true,
      scannedByEmail: true,
      scannedAt: true,
      entryDate: true,
    },
  });
}

function getIstDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((item) => item.type === "year")?.value || "0000";
  const month = parts.find((item) => item.type === "month")?.value || "00";
  const day = parts.find((item) => item.type === "day")?.value || "00";
  return `${year}-${month}-${day}`;
}

export async function GET(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    if (!(await assertVenueTeam(actorEmail))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let entries;
    try {
      entries = await getRecentEntries();
    } catch (error) {
      if (!isMissingGateStorageError(error)) {
        throw error;
      }
      await ensureGateEntryStorage();
      entries = await getRecentEntries();
    }

    return NextResponse.json({ entries }, { status: 200 });
  } catch (error) {
    console.error("[dashboard/venue/entries:get]", error);
    return NextResponse.json({ error: "Failed to load gate entries." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const actorEmail = normalizeEmail(getRequestEmail(req));
    if (!(await assertVenueTeam(actorEmail))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const token = String(parsed.data.qrToken || "").trim();
    const participantEmail = parseParticipantQrToken(token);
    if (!participantEmail) {
      return NextResponse.json({ error: "Invalid gate pass QR token." }, { status: 409 });
    }

    const registration = await db.registration.findUnique({
      where: { email: participantEmail },
      select: {
        name: true,
        email: true,
        phone: true,
        college: true,
        verified: true,
      },
    });

    if (!registration || !registration.verified) {
      return NextResponse.json({ error: "No verified registration found for this QR." }, { status: 404 });
    }

    const entryDate = getIstDateKey();

    const createEntry = () =>
      db.gateEntryLog.create({
        data: {
          participantEmail,
          participantName: registration.name,
          participantPhone: registration.phone,
          participantCollege: registration.college,
          qrToken: token,
          scannedByEmail: actorEmail,
          entryDate,
        },
        select: {
          id: true,
          participantEmail: true,
          participantName: true,
          participantPhone: true,
          participantCollege: true,
          scannedByEmail: true,
          scannedAt: true,
          entryDate: true,
        },
      });

    let entry;
    try {
      entry = await createEntry();
    } catch (error) {
      if (!isMissingGateStorageError(error)) {
        throw error;
      }
      await ensureGateEntryStorage();
      entry = await createEntry();
    }

    return NextResponse.json(
      {
        entry,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[dashboard/venue/entries:post]", error);
    return NextResponse.json({ error: "Failed to validate gate pass." }, { status: 500 });
  }
}
