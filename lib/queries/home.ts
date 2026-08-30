import { prisma } from "@/lib/prisma";
import { LinkSection, PostCategory, PostStatus } from "@prisma/client";

// Semua fungsi di sini dipanggil dari app/[locale]/page.tsx (Server
// Component), bukan dari dalam komponen section langsung — biar section
// component tetep reusable & gampang ditest (nerima data lewat props).

export function getFeaturedGame() {
  return prisma.game.findFirst({
    where: { featured: true },
    orderBy: { order: "asc" },
  });
}

export function getCarouselGames(limit = 6) {
  return prisma.game.findMany({
    orderBy: { order: "asc" },
    take: limit,
  });
}

export function getCommunityLinks() {
  return prisma.socialLink.findMany({
    where: { section: LinkSection.COMMUNITY },
    orderBy: { order: "asc" },
  });
}

export function getLatestNewsPosts(limit = 3) {
  return prisma.post.findMany({
    where: { category: PostCategory.NEWS, status: PostStatus.PUBLISHED },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export function getSiteSettings() {
  return prisma.siteSettings.findUnique({ where: { id: 1 } });
}
