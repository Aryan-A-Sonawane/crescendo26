import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  // PrismaNeonHttp uses HTTP fetch — works everywhere, no WebSocket needed
  const adapter = new PrismaNeonHttp(connectionString, {});
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const prismaClient: PrismaClient | null =
  process.env.NODE_ENV === "production"
    ? createPrismaClient()
    : (() => {
        if (!globalThis.__prisma) {
          const client = createPrismaClient();
          if (client) {
            globalThis.__prisma = client;
          }
        }
        return globalThis.__prisma ?? null;
      })();

// Delay throwing until the first actual DB operation.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    if (!prismaClient) {
      throw new Error("[prisma] DATABASE_URL is not set. Check your .env.local or Vercel environment variables.");
    }
    return Reflect.get(prismaClient, prop, receiver);
  },
});

