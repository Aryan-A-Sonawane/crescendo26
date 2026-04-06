require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const { Resolver } = require('dns');
const { neon, neonConfig } = require('@neondatabase/serverless');

const APPLY = process.argv.includes('--apply');
const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');

const technicalFileName = fs.existsSync(path.resolve(__dirname, '..', '..', 'data', 'srsc26technical1.csv'))
  ? 'srsc26technical1.csv'
  : 'srsc26technical.csv';

const FILE_CONFIGS = [
  { fileName: technicalFileName, sourceFile: 'srsc26technical', expectedCategoryKeyword: 'technical' },
  { fileName: 'srsc26sports.csv', sourceFile: 'srsc26sports', expectedCategoryKeyword: 'sports' },
  { fileName: 'srsc26ec.csv', sourceFile: 'srsc26ec', expectedCategoryKeyword: 'ec' },
];

const REQUIRED_HEADERS = ['Sr. No', 'Name', 'Email', 'Mobile No', 'Event', 'Event Fees Type'];

const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '1.1.1.1']);
const dnsCache = new Map();

function resolveNeonHost(hostname) {
  if (dnsCache.has(hostname)) return Promise.resolve(dnsCache.get(hostname));
  return new Promise((resolve, reject) => {
    resolver.resolve4(hostname, (err, addrs) => {
      if (err || !addrs || !addrs.length) return reject(err || new Error('No addresses'));
      dnsCache.set(hostname, addrs[0]);
      resolve(addrs[0]);
    });
  });
}

async function customFetch(url, init) {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  const connectHost = hostname.endsWith('.neon.tech') ? await resolveNeonHost(hostname) : hostname;
  const body = init && init.body ? String(init.body) : undefined;

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host: connectHost,
        port: 443,
        path: urlObj.pathname + urlObj.search,
        method: (init && init.method) || 'GET',
        headers: init && init.headers ? init.headers : undefined,
        servername: hostname,
        timeout: 15000,
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString();
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            headers: { get: (h) => (res.headers[String(h).toLowerCase()] || null) },
            json: async () => JSON.parse(text),
            text: async () => text,
          });
        });
      }
    );

    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('Neon request timeout')));
    if (body) req.write(body);
    req.end();
  });
}

function parseCsv(content) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i];
    const next = content[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && next === '\n') i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += ch;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function normalizeHeader(value) {
  return String(value || '').trim();
}

function normalizeString(value) {
  return String(value || '').trim();
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function keyify(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function stripVenueSuffix(value) {
  return String(value || '')
    .replace(/\s*-\s*non\s*vit\s*$/i, '')
    .replace(/\s*-\s*vit\s*$/i, '')
    .replace(/-non\s*vit\s*$/i, '')
    .replace(/-vit\s*$/i, '')
    .trim();
}

function isTechPassLabel(value) {
  const k = keyify(value);
  return (
    k.includes('technicalpass') ||
    k.includes('techpass') ||
    k.includes('alltechnical')
  );
}

function makeTicketToken(sourceFile, sourceRow, email, eventName, eventId) {
  const base = `${sourceFile}|${sourceRow}|${email}|${eventName}|${eventId == null ? 'none' : eventId}`;
  const digest = crypto.createHash('sha256').update(base).digest('hex').slice(0, 28);
  return `cr26_${digest}`;
}

function ensureHeaders(headers, fileName) {
  const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
  if (missing.length > 0) {
    throw new Error(`${fileName}: missing required headers: ${missing.join(', ')}`);
  }
}

function validateFileCategory(rows, fileConfig) {
  const samples = rows
    .map((r) => normalizeString(r.categoryLabel).toLowerCase())
    .filter(Boolean);

  const unique = Array.from(new Set(samples));
  const bad = unique.filter((v) => !v.includes(fileConfig.expectedCategoryKeyword));
  const mismatchRatio = unique.length === 0 ? 1 : bad.length / unique.length;

  if (mismatchRatio > 0.2) {
    const observed = unique.slice(0, 5).join(' | ') || '(empty)';
    throw new Error(
      `${fileConfig.fileName}: category mismatch. Expected Event column to contain '${fileConfig.expectedCategoryKeyword}'. Observed: ${observed}`
    );
  }
}

function loadCsv(fileConfig) {
  const filePath = path.join(DATA_DIR, fileConfig.fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const grid = parseCsv(raw).filter((r) => r.some((c) => String(c || '').trim().length > 0));
  if (grid.length < 2) {
    throw new Error(`${fileConfig.fileName}: no data rows found.`);
  }

  const headers = grid[0].map(normalizeHeader);
  ensureHeaders(headers, fileConfig.fileName);

  const headerIndex = Object.fromEntries(headers.map((h, idx) => [h, idx]));

  const rows = grid.slice(1).map((cells, i) => {
    const get = (h) => normalizeString(cells[headerIndex[h]] || '');
    return {
      sourceFile: fileConfig.sourceFile,
      sourceRow: Number.parseInt(get('Sr. No'), 10) || i + 1,
      name: get('Name'),
      email: normalizeEmail(get('Email')),
      phone: get('Mobile No') || null,
      categoryLabel: get('Event'),
      feeTypeRaw: get('Event Fees Type'),
      rowNumberInFile: i + 2,
    };
  });

  validateFileCategory(rows, fileConfig);

  return rows;
}

function buildAliasMap() {
  return new Map([
    ['minibasketball', 'Mini Basketball'],
    ['missmrcrescendo', 'Miss/Mr Crescendo'],
    ['mrmisscrescendo', 'Miss/Mr Crescendo'],
    ['natyasamarat', 'Natyasamrat'],
    ['chessboys', 'Chess (Boys)'],
    ['football7asideboys', 'Football (7 aside)'],
    ['football7asidegirls', 'Football (7 aside)'],
    ['crickethardtennis', 'Cricket'],
    ['freefiresquad', 'Free Fire'],
    ['productmanagementworkshop', 'Ideate Workshop'],
  ]);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing in .env.local');
  }

  neonConfig.fetchFunction = customFetch;
  const sql = neon(process.env.DATABASE_URL);

  const managedEvents = await sql`SELECT id, name, category FROM managed_events ORDER BY id ASC`;
  const eventByKey = new Map();
  for (const event of managedEvents) {
    eventByKey.set(keyify(event.name), event);
  }

  const aliases = buildAliasMap();

  const allRows = [];
  for (const cfg of FILE_CONFIGS) {
    const rows = loadCsv(cfg);
    allRows.push(...rows);
  }

  const errors = [];
  const mappedRows = [];

  for (const row of allRows) {
    if (!row.email) {
      errors.push(`${row.sourceFile} row ${row.rowNumberInFile}: missing email`);
      continue;
    }

    if (!row.name) {
      errors.push(`${row.sourceFile} row ${row.rowNumberInFile}: missing name`);
      continue;
    }

    if (!row.feeTypeRaw) {
      errors.push(`${row.sourceFile} row ${row.rowNumberInFile}: missing Event Fees Type`);
      continue;
    }

    const baseLabel = stripVenueSuffix(row.feeTypeRaw);
    const baseKey = keyify(baseLabel);

    let mappedEvent = eventByKey.get(baseKey) || null;

    if (!mappedEvent && aliases.has(baseKey)) {
      mappedEvent = eventByKey.get(keyify(aliases.get(baseKey))) || null;
    }

    const isTechnicalFile = row.sourceFile === 'srsc26technical';
    const techPass = isTechnicalFile && isTechPassLabel(baseLabel);

    if (!mappedEvent && !techPass) {
      errors.push(
        `${row.sourceFile} row ${row.rowNumberInFile}: cannot map event '${row.feeTypeRaw}' (normalized '${baseLabel}') to managed_events`
      );
      continue;
    }

    const eventName = techPass ? 'Technical Pass' : mappedEvent.name;
    const eventId = techPass ? null : mappedEvent.id;
    const qrToken = makeTicketToken(row.sourceFile, row.sourceRow, row.email, eventName, eventId);

    mappedRows.push({
      sourceFile: row.sourceFile,
      sourceRow: row.sourceRow,
      eventName,
      eventId,
      email: row.email,
      participantName: row.name,
      phone: row.phone,
      qrToken,
    });
  }

  const duplicateSourceRows = new Map();
  for (const row of mappedRows) {
    const key = `${row.sourceFile}|${row.sourceRow}`;
    duplicateSourceRows.set(key, (duplicateSourceRows.get(key) || 0) + 1);
  }
  const duplicateKeys = Array.from(duplicateSourceRows.entries()).filter(([, count]) => count > 1);
  if (duplicateKeys.length > 0) {
    errors.push(`Duplicate source_file+source_row keys found: ${duplicateKeys.slice(0, 10).map(([k]) => k).join(', ')}`);
  }

  const totalTechPass = mappedRows.filter((r) => r.eventId == null && keyify(r.eventName).includes('technicalpass')).length;

  const currentCounts = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM tickets) AS tickets_count,
      (SELECT COUNT(*)::int FROM event_queue_entries) AS queue_count,
      (SELECT COUNT(*)::int FROM event_rounds) AS rounds_count
  `;

  console.log('--- IMPORT CHECK SUMMARY ---');
  console.log('files:', FILE_CONFIGS.map((f) => f.fileName).join(', '));
  console.log('csv_rows_total:', allRows.length);
  console.log('mapped_rows_total:', mappedRows.length);
  console.log('tech_pass_rows:', totalTechPass);
  console.log('validation_errors:', errors.length);
  console.log('current_db_counts:', currentCounts[0]);

  if (errors.length > 0) {
    console.log('\n--- VALIDATION ERRORS (first 60) ---');
    for (const err of errors.slice(0, 60)) {
      console.log('-', err);
    }
    if (errors.length > 60) {
      console.log(`... and ${errors.length - 60} more`);
    }
    throw new Error('Import aborted due to validation errors. No DB changes were made.');
  }

  if (!APPLY) {
    console.log('\nDry run complete. Re-run with --apply to truncate and import.');
    return;
  }

  console.log('\nApplying import transaction...');
  await sql`BEGIN`;
  try {
    await sql`DELETE FROM event_rounds`;
    await sql`DELETE FROM event_queue_entries`;
    await sql`DELETE FROM tickets`;

    for (const row of mappedRows) {
      await sql`
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
          played_by_email,
          created_at,
          updated_at
        )
        VALUES (
          ${row.sourceFile},
          ${row.sourceRow},
          ${row.eventName},
          ${row.eventId},
          ${row.email},
          ${row.participantName},
          ${row.phone},
          ${row.qrToken},
          FALSE,
          NULL,
          NULL,
          NOW(),
          NOW()
        )
      `;
    }

    await sql`COMMIT`;
  } catch (error) {
    await sql`ROLLBACK`;
    throw error;
  }

  const afterCounts = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM tickets) AS tickets_count,
      (SELECT COUNT(*)::int FROM event_queue_entries) AS queue_count,
      (SELECT COUNT(*)::int FROM event_rounds) AS rounds_count
  `;

  console.log('Import finished. New counts:', afterCounts[0]);
}

main().catch((error) => {
  console.error('\nIMPORT_FAILED:', error && error.message ? error.message : String(error));
  process.exit(1);
});
