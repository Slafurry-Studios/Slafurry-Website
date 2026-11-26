import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { buildSitemap, type SitemapGame, type SitemapPost } from "@/lib/sitemap";

// Regenerated at most hourly, so new posts and games appear without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let games: SitemapGame[] = [];
  let posts: SitemapPost[] = [];
  try {
    // Same visibility rules as the public pages (getGameBySlug / getPostBySlug).
    [games, posts] = await Promise.all([
      prisma.game.findMany({ where: { isHidden: false }, select: { slug: true, updatedAt: true } }),
      prisma.post.findMany({
        where: { status: "PUBLISHED", isHidden: false },
        select: { slug: true, category: true, updatedAt: true },
        orderBy: { publishedAt: "desc" },
      }),
    ]);
  } catch (error) {
    // DB unreachable: still serve the static pages rather than failing.
    console.error("Sitemap query failed:", error);
  }
  return buildSitemap(games, posts);
}
