import { prisma } from "@/lib/prisma";

export async function getPressReleases() {
  try {
    return await prisma.pressRelease.findMany({
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getPressKitAssets() {
  try {
    return await prisma.pressKitAsset.findMany({
      orderBy: { label: "asc", type: "asc" },
    });
  } catch {
    return [];
  }
}