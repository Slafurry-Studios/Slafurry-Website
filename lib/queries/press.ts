import { prisma } from "@/lib/prisma";

export async function getPressReleases() {
  try {
    return await prisma.pressRelease.findMany({
      where: { isHidden: false },
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function getPressKitAssets() {
  try {
    return await prisma.pressKitAsset.findMany({
      where: { isHidden: false },
      // Prisma 6 rejects multi-key object orderBy — must be array form.
      orderBy: [{ order: "asc" }, { label: "asc" }],
    });
  } catch {
    return [];
  }
}