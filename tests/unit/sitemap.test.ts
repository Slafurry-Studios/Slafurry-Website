import { describe, it, expect } from "vitest";
import { buildSitemap, STATIC_PATHS } from "@/lib/sitemap";

const ORIGIN = "https://www.slafurrystudios.com";

describe("buildSitemap", () => {
  const d1 = new Date("2026-11-01T00:00:00Z");
  const d2 = new Date("2026-11-20T00:00:00Z");
  const map = buildSitemap(
    [{ slug: "an-unfinished-game", updatedAt: d1 }],
    [
      { slug: "operation-fiwb", category: "NEWS", updatedAt: d2 },
      { slug: "week-1", category: "DEVLOG", updatedAt: d1 },
    ],
    ORIGIN
  );
  const urls = map.map((e) => e.url);

  it("lists static pages, games and posts on the canonical origin", () => {
    expect(urls).toContain(`${ORIGIN}/`);
    expect(urls).toContain(`${ORIGIN}/games/an-unfinished-game`);
    expect(urls).toContain(`${ORIGIN}/news/operation-fiwb`);
    expect(urls).toContain(`${ORIGIN}/devlog/week-1`);
    expect(map).toHaveLength(STATIC_PATHS.length + 3);
  });

  it("never emits the legacy /en prefix or another host", () => {
    for (const u of urls) {
      expect(u.startsWith(`${ORIGIN}/`)).toBe(true);
      expect(u).not.toContain("/en/");
    }
  });

  it("dates listing pages by their newest item", () => {
    const at = (path: string) => map.find((e) => e.url === `${ORIGIN}${path}`)?.lastModified;
    expect(at("/news")).toEqual(d2);
    expect(at("/devlog")).toEqual(d1);
    expect(at("/")).toEqual(d2);
    expect(at("/press")).toBeUndefined();
  });

  it("still lists static pages when the DB returned nothing", () => {
    expect(buildSitemap([], [], ORIGIN)).toHaveLength(STATIC_PATHS.length);
  });
});
