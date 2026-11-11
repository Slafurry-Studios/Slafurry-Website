import { prisma } from "@/lib/prisma";
import { LinkSection, PostCategory, PostStatus } from "@prisma/client";

// All functions here are called from Server Pages (Server
// Component), not from section components directly — keeps sections
// reusable & easy to test (receives data via props).
//
// Stability note: each query is wrapped in try/catch so the page can still
// be prerendered at build time even if the database is unavailable (e.g.
// CI without DB).
// When the database is up, behavior is identical; when it's down, empty data
// is returned instead of crashing the entire build.

export async function getFeaturedGame() {
  try {
    return await prisma.game.findFirst({
      where: { featured: true, isHidden: false },
      orderBy: { order: "asc" },
    });
  } catch {
    return null;
  }
}

export async function getCarouselGames(limit = 6) {
  try {
    return await prisma.game.findMany({
      where: { isHidden: false },
      orderBy: { order: "asc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getCommunityLinks() {
  try {
    return await prisma.socialLink.findMany({
      where: { section: LinkSection.COMMUNITY, isHidden: false },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getLatestNewsPosts(limit = 3) {
  try {
    return await prisma.post.findMany({
      where: {
        category: PostCategory.NEWS,
        status: PostStatus.PUBLISHED,
        isHidden: false,
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getActiveMontageVideos() {
  try {
    return await prisma.montageVideo.findMany({
      where: { isActive: true, isHidden: false },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getSiteSettings() {
  try {
    return await prisma.siteSettings.findUnique({ where: { id: 1 } });
  } catch {
    return null;
  }
}
