import { PrismaClient } from "@prisma/client";

// Singleton pattern — mencegah Next.js dev mode (hot reload) bikin banyak
// koneksi Prisma baru tiap kali file di-save.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
