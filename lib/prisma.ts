import { PrismaClient } from "@prisma/client";

// Singleton pattern — prevents Next.js dev mode (hot reload) from creating
// many new Prisma connections every time the file is saved.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
