/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: ".env.local" });

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const xlsx = require("xlsx");
const { PrismaNeonHttp } = require("@prisma/adapter-neon");
const { PrismaClient } = require("@prisma/client");

const DATA_DIR = path.resolve(__dirname, "../../data");

function normalize(value) {
  return String(value || "").trim();
}

function normalizeEmail(value) {
  return normalize(value).toLowerCase();
}

function pickValue(row, candidates) {
  for (const key of Object.keys(row)) {
    const normalizedKey = key.toLowerCase().replace(/\s+/g, " ").trim();
    if (candidates.some((candidate) => normalizedKey.includes(candidate))) {
      const val = normalize(row[key]);
      if (val) return val;
    }
  }
  return "";
}

function inferEventFromFilename(fileName) {
  const lower = fileName.toLowerCase();
  if (lower.includes("technical")) return "Technical";
  if (lower.includes("sports")) return "Sports";
  if (lower.includes("ec")) return "EC and Cultural";
  return "General";
}

function qrTokenFor(fileName, rowNumber, email, eventName) {
  const source = `${fileName}|${rowNumber}|${email}|${eventName}`;
  const digest = crypto.createHash("sha256").update(source).digest("hex").slice(0, 28);
  return `cr26_${digest}`;
}

async function refreshTechnicalPassExpansions(prisma) {
  await prisma.$executeRawUnsafe(`
    WITH technical_events AS (
      SELECT id, name
      FROM managed_events
      WHERE category = 'Technical'
    ),
    technical_holders AS (
      SELECT DISTINCT ON (lower(email))
        lower(email) AS email,
        participant_name,
        phone,
        substr(md5(lower(email)), 1, 24) AS holder_key
      FROM tickets
      WHERE event_id IS NULL
        AND event_name ILIKE '%technical%'
      ORDER BY lower(email), id DESC
    ),
    expanded AS (
      SELECT
        ('pass_tech_expand_holder:' || h.holder_key) AS source_file,
        e.id AS source_row,
        e.name AS event_name,
        e.id AS event_id,
        h.email,
        h.participant_name,
        h.phone,
        ('cr26_' || substr(md5('tech-expand|' || h.holder_key || '|' || e.id::text || '|' || h.email), 1, 28)) AS qr_token
      FROM technical_holders h
      CROSS JOIN technical_events e
    )
    INSERT INTO tickets (
      source_file,
      source_row,
      event_name,
      event_id,
      email,
      participant_name,
      phone,
      qr_token,
      is_played,
      played_at,
      played_by_email
    )
    SELECT
      ex.source_file,
      ex.source_row,
      ex.event_name,
      ex.event_id,
      ex.email,
      ex.participant_name,
      ex.phone,
      ex.qr_token,
      FALSE,
      NULL,
      NULL
    FROM expanded ex
    ON CONFLICT (source_file, source_row) DO UPDATE SET
      event_name = EXCLUDED.event_name,
      event_id = EXCLUDED.event_id,
      email = EXCLUDED.email,
      participant_name = EXCLUDED.participant_name,
      phone = EXCLUDED.phone,
      qr_token = EXCLUDED.qr_token,
      updated_at = NOW()
  `);
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL not found in environment.");
  }

  const adapter = new PrismaNeonHttp(dbUrl, {});
  const prisma = new PrismaClient({ adapter });

  const files = fs.readdirSync(DATA_DIR).filter((name) => name.toLowerCase().endsWith(".xlsx"));
  if (files.length === 0) {
    console.log("No xlsx files found in data directory.");
    return;
  }

  const managedEvents = await prisma.managedEvent.findMany({
    select: { id: true, name: true },
  });
  const eventMap = new Map(managedEvents.map((event) => [event.name.toLowerCase(), event.id]));

  let imported = 0;
  let skipped = 0;

  for (const fileName of files) {
    const fullPath = path.join(DATA_DIR, fileName);
    const workbook = xlsx.readFile(fullPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const email = normalizeEmail(pickValue(row, ["email", "mail"]));
      const participantName = normalize(pickValue(row, ["name", "participant"]));
      const phone = normalize(pickValue(row, ["phone", "mobile", "contact"]));
      let eventName = normalize(pickValue(row, ["event", "competition", "ticket", "title"]));

      if (!eventName) {
        eventName = inferEventFromFilename(fileName);
      }

      if (!email || !participantName) {
        skipped += 1;
        continue;
      }

      const sourceRow = index + 2;
      const token = qrTokenFor(fileName, sourceRow, email, eventName);
      const eventId = eventMap.get(eventName.toLowerCase()) || null;

      await prisma.ticket.upsert({
        where: {
          sourceFile_sourceRow: {
            sourceFile: fileName,
            sourceRow,
          },
        },
        update: {
          eventName,
          eventId,
          email,
          participantName,
          phone: phone || null,
          qrToken: token,
        },
        create: {
          sourceFile: fileName,
          sourceRow,
          eventName,
          eventId,
          email,
          participantName,
          phone: phone || null,
          qrToken: token,
        },
      });

      imported += 1;
    }
  }

  await refreshTechnicalPassExpansions(prisma);

  console.log(`Ticket import complete. Imported/updated: ${imported}, skipped: ${skipped}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Ticket import failed:", error);
  process.exit(1);
});
