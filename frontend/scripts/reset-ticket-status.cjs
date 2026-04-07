require('dotenv').config({ path: '.env.local' });

const { neon } = require('@neondatabase/serverless');
const { Resolver } = require('dns');
const https = require('https');

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

function getArgValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1] || null;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function printUsage() {
  console.log('Usage: node scripts/reset-ticket-status.cjs --event "Agentic AI" [--apply]');
  console.log('Example (dry run): node scripts/reset-ticket-status.cjs --event "Agentic AI"');
  console.log('Example (apply):   node scripts/reset-ticket-status.cjs --event "Agentic AI" --apply');
}

async function fetchSummary(sql, likePattern) {
  const rows = await sql`
    SELECT
      event_name,
      COUNT(*)::int AS total,
      COALESCE(SUM(CASE WHEN is_played THEN 1 ELSE 0 END), 0)::int AS used,
      COALESCE(SUM(CASE WHEN is_played THEN 0 ELSE 1 END), 0)::int AS ready
    FROM tickets
    WHERE lower(event_name) LIKE ${likePattern}
    GROUP BY event_name
    ORDER BY event_name ASC
  `;

  const totals = rows.reduce(
    (acc, row) => {
      acc.total += Number(row.total || 0);
      acc.used += Number(row.used || 0);
      acc.ready += Number(row.ready || 0);
      return acc;
    },
    { total: 0, used: 0, ready: 0 }
  );

  return { rows, totals };
}

async function main() {
  const eventPattern = getArgValue('--event');
  const apply = hasFlag('--apply');

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing. Check frontend/.env.local');
  }

  if (!eventPattern) {
    printUsage();
    process.exit(1);
  }

  const likePattern = `%${String(eventPattern).trim().toLowerCase()}%`;
  // Use DNS-resolved custom fetch to avoid intermittent Neon DNS failures.
  const { neonConfig } = require('@neondatabase/serverless');
  neonConfig.fetchFunction = customFetch;
  const sql = neon(process.env.DATABASE_URL);

  const before = await fetchSummary(sql, likePattern);

  if (before.rows.length === 0) {
    console.log(`No tickets found for event pattern: ${eventPattern}`);
    process.exit(1);
  }

  console.log('Matched events:');
  for (const row of before.rows) {
    console.log(`- ${row.event_name}: total=${row.total}, used=${row.used}, ready=${row.ready}`);
  }
  console.log(`Before totals: total=${before.totals.total}, used=${before.totals.used}, ready=${before.totals.ready}`);

  if (!apply) {
    console.log('Dry run only. Re-run with --apply to reset used tickets to ready.');
    return;
  }

  const updated = await sql`
    WITH updated_rows AS (
      UPDATE tickets
      SET
        is_played = FALSE,
        played_at = NULL,
        played_by_email = NULL,
        updated_at = NOW()
      WHERE lower(event_name) LIKE ${likePattern}
        AND is_played = TRUE
      RETURNING id
    )
    SELECT COUNT(*)::int AS updated_count
    FROM updated_rows
  `;

  const updatedCount = Number(updated[0]?.updated_count || 0);
  const after = await fetchSummary(sql, likePattern);

  console.log(`Updated rows: ${updatedCount}`);
  console.log(`After totals: total=${after.totals.total}, used=${after.totals.used}, ready=${after.totals.ready}`);
}

main().catch((error) => {
  console.error('Failed to reset ticket status:', error?.message || String(error));
  process.exit(1);
});
