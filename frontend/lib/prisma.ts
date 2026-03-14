import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! }) as any;
  const adapter = new PrismaNeon(pool);
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("[prisma] DATABASE_URL is not set. Check your .env.local or Vercel environment variables.");
  }
  // PrismaNeonHttp uses HTTP fetch — works everywhere, no WebSocket needed
  const adapter = new PrismaNeonHttp(connectionString, {});
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// In production: create fresh (serverless, no persistent state).
// In dev: reuse across hot reloads via globalThis to avoid re-instantiation.
export const prisma: PrismaClient =
  process.env.NODE_ENV === "production"
    ? createPrismaClient()
    : (globalThis.__prisma ??= createPrismaClient());

