import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Public pages that always exist. Keep in sync with app/(main). */
export const STATIC_PATHS: { path: string; changeFrequency: "daily" | "weekly" | "monthly"; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/games", changeFrequency: "weekly", priority: 0.9 },
  { path: "/devlog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/news", changeFrequency: "weekly", priority: 0.8 },
  { path: "/press", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
];

export type SitemapGame = { slug: string; updatedAt: Date };
export type SitemapPost = { slug: string; category: "DEVLOG" | "NEWS"; updatedAt: Date };

/** Pure: turns visible games and published posts into sitemap entries. */
export function buildSitemap(
  games: SitemapGame[],
  posts: SitemapPost[],
  origin = SITE_URL
): MetadataRoute.Sitemap {
  const url = (path: string) => `${origin}${path === "/" ? "/" : path}`;
  const latest = (dates: Date[]) =>
    dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined;

  // Listing pages change when their newest item does.
  const listUpdated: Record<string, Date | undefined> = {
    "/games": latest(games.map((g) => g.updatedAt)),
    "/devlog": latest(posts.filter((p) => p.category === "DEVLOG").map((p) => p.updatedAt)),
    "/news": latest(posts.filter((p) => p.category === "NEWS").map((p) => p.updatedAt)),
  };
  listUpdated["/"] = latest(Object.values(listUpdated).filter((d): d is Date => Boolean(d)));

  return [
    ...STATIC_PATHS.map(({ path, changeFrequency, priority }) => ({
      url: url(path),
      ...(listUpdated[path] && { lastModified: listUpdated[path] }),
      changeFrequency,
      priority,
    })),
    ...games.map((g) => ({
      url: url(`/games/${g.slug}`),
      lastModified: g.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: url(`/${p.category === "DEVLOG" ? "devlog" : "news"}/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
