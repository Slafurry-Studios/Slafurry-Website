import { prisma } from "@/lib/prisma";
import { LinkSection, PostCategory, PostStatus } from "@prisma/client";

// Semua fungsi di sini dipanggil dari halaman Server (Server
// Component), bukan dari dalam komponen section langsung — biar section
// component tetep reusable & gampang ditest (nerima data lewat props).
//
// Catat stabilisasi: setiap query dibungkus try/catch agar halaman tetap bisa
// di-prerender waktu build meski database tidak tersedia (mis. CI tanpa DB).
// Saat database nyala, perilaku identik; saat mati, dikembalikan data kosong
// alih-alih menjatuhkan seluruh build.

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
