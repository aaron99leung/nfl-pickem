// Suggested location in your project: src/lib/prisma.ts
//
// Prisma 7 removed the built-in Rust query engine, so the client now
// needs an explicit "driver adapter" that knows how to talk to your
// specific database. Since we're on Neon, we use @prisma/adapter-neon.

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

// Reuse a single client across hot reloads in dev instead of creating
// a new one on every file save.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
