require('dotenv').config({ path: '.env.local' });

const https = require('https');
const { Resolver } = require('dns');
const { neon, neonConfig } = require('@neondatabase/serverless');

const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '1.1.1.1']);
const dnsCache = new Map();

function getArg(flag, fallback = null) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? fallback : process.argv[i + 1] || fallback;
}

function normalize(v) {
  return String(v || '').trim().toLowerCase();
}

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

(async () => {
  try {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL missing');

    const eventPattern = normalize(getArg('--event', 'Agentic AI'));

    neonConfig.fetchFunction = customFetch;
    const sql = neon(process.env.DATABASE_URL);

    const events = await sql`
      SELECT id, name, category
      FROM managed_events
      WHERE lower(name) LIKE ${`%${eventPattern}%`}
      ORDER BY id ASC
    `;

    if (!events.length) {
      console.log('No event found for pattern:', eventPattern);
      process.exit(1);
    }

    const event = events[0];
    const eventName = normalize(event.name);

    const exact = await sql`
      SELECT
        COUNT(*)::int AS total,
        COALESCE(SUM(CASE WHEN is_played THEN 1 ELSE 0 END), 0)::int AS used
      FROM tickets
      WHERE event_id = ${event.id}
         OR lower(event_name) = ${eventName}
    `;

    const oldBroad = await sql`
      SELECT
        COUNT(*)::int AS total,
        COALESCE(SUM(CASE WHEN is_played THEN 1 ELSE 0 END), 0)::int AS used
      FROM tickets
      WHERE event_id = ${event.id}
         OR lower(event_name) = ${eventName}
         OR lower(event_name) LIKE '%technical%'
    `;

    const falsePositives = await sql`
      WITH event_participants AS (
        SELECT DISTINCT lower(email) AS email
        FROM tickets
        WHERE event_id = ${event.id}
           OR lower(event_name) = ${eventName}
      )
      SELECT COUNT(*)::int AS count
      FROM event_participants ep
      WHERE EXISTS (
        SELECT 1
        FROM tickets t
        JOIN managed_events me ON me.id = t.event_id
        WHERE lower(t.email) = ep.email
          AND t.is_played = TRUE
          AND lower(me.category) LIKE '%technical%'
          AND t.event_id <> ${event.id}
      )
    `;

    const techPassHolders = await sql`
      WITH holders AS (
        SELECT DISTINCT lower(email) AS email
        FROM tickets
        WHERE event_id IS NULL
          AND lower(event_name) LIKE '%technical pass%'
      ),
      event_participants AS (
        SELECT DISTINCT lower(email) AS email
        FROM tickets
        WHERE event_id = ${event.id}
           OR lower(event_name) = ${eventName}
      )
      SELECT
        (SELECT COUNT(*)::int FROM holders) AS holder_total,
        (SELECT COUNT(*)::int FROM holders h JOIN event_participants ep ON ep.email = h.email) AS holder_in_event,
        (
          SELECT COUNT(*)::int
          FROM tickets t
          JOIN holders h ON h.email = lower(t.email)
          WHERE (t.event_id = ${event.id} OR lower(t.event_name) = ${eventName})
            AND t.is_played = TRUE
        ) AS holder_used_exact,
        (
          SELECT COUNT(*)::int
          FROM holders h
          WHERE EXISTS (
            SELECT 1
            FROM tickets t
            JOIN managed_events me ON me.id = t.event_id
            WHERE lower(t.email) = h.email
              AND t.is_played = TRUE
              AND lower(me.category) LIKE '%technical%'
              AND t.event_id <> ${event.id}
          )
        ) AS holder_used_other_technical
    `;

    console.log('EVENT', { id: event.id, name: event.name, category: event.category });
    console.log('EXACT_SCOPE', exact[0]);
    console.log('OLD_BROAD_SCOPE', oldBroad[0]);
    console.log('FALSE_POSITIVE_EMAILS_FROM_OLD_SCOPE', falsePositives[0]?.count || 0);
    console.log('TECH_PASS_HOLDER_AUDIT', techPassHolders[0]);
  } catch (error) {
    console.error('Audit failed:', error?.message || String(error));
    process.exit(1);
  }
})();
