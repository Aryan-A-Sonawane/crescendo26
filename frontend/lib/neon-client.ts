// lib/neon-client.ts
// Bypasses ISP/network DNS blocking of *.neon.tech by:
// 1. Resolving hostnames via Google DNS (8.8.8.8) using Node.js C-ares resolver
// 2. Connecting directly to the resolved IP
// 3. Passing original hostname as TLS servername (SNI) for cert validation
import { neonConfig } from "@neondatabase/serverless";
import https from "https";
import { Resolver } from "dns";

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

const dnsCache = new Map<string, string>();

function resolveNeonHost(hostname: string): Promise<string> {
  if (dnsCache.has(hostname)) return Promise.resolve(dnsCache.get(hostname)!);
  return new Promise((resolve, reject) => {
    resolver.resolve4(hostname, (err, addrs) => {
      if (err || !addrs?.length) return reject(err || new Error("No addresses"));
      dnsCache.set(hostname, addrs[0]);
      resolve(addrs[0]);
    });
  });
}

async function customFetch(url: string, init?: RequestInit): Promise<Response> {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;

  // Resolve neon.tech hostnames via Google DNS to bypass local DNS blocking
  const connectHost = hostname.endsWith(".neon.tech")
    ? await resolveNeonHost(hostname)
    : hostname;

  const body = init?.body ? String(init.body) : undefined;

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host: connectHost,          // Connect to IP directly
        port: 443,
        path: urlObj.pathname + urlObj.search,
        method: init?.method || "GET",
        headers: init?.headers as Record<string, string>,
        servername: hostname,       // TLS SNI = original hostname (required for cert)
        timeout: 10000,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString();
          resolve({
            ok: res.statusCode! >= 200 && res.statusCode! < 300,
            status: res.statusCode!,
            headers: { get: (h: string) => (res.headers[h.toLowerCase()] as string) || null },
            json: () => Promise.resolve(JSON.parse(text)),
            text: () => Promise.resolve(text),
          } as Response);
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(new Error("Neon request timeout")); });
    if (body) req.write(body);
    req.end();
  });
}

neonConfig.defaults.fetchFunction = customFetch;

