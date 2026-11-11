import { prisma } from "@/lib/prisma";
import { GameStatus } from "@prisma/client";

// ─── Public type ───────────────────────────────────────────────
export type GameData = {
  id: string;
  slug: string;
  title: string;
  ogImage: string | null;
  coverImage: string;
  coverImageAlt: string;
  shortDesc: string;
  longDesc: string;
  status: "RELEASED" | "UPCOMING" | "IN_DEVELOPMENT";
  featured: boolean;
  order: number;
  playLinks: { label: string; url: string }[];
};

// ─── Query helpers ─────────────────────────────────────────────

/** Fetch all visible games (RELEASED + UPCOMING + IN_DEVELOPMENT) for the public list. */
export async function getActiveGames(): Promise<GameData[]> {
  try {
    const rows = await prisma.game.findMany({
      where: {
        status: {
          in: [GameStatus.RELEASED, GameStatus.UPCOMING, GameStatus.IN_DEVELOPMENT],
        },
        isHidden: false
      },
      orderBy: { order: "desc" },
      include: { playLinks: { select: { label: true, url: true } } },
    });
    return rows.map(toGameData);
  } catch {
    return [];
  }
}

/** Fetch a single game by slug. */
export async function getGameBySlug(slug: string): Promise<GameData | null> {
  try {
    const row = await prisma.game.findFirst({
      where: { slug, isHidden: false },
      include: { playLinks: { select: { label: true, url: true } } },
    });
    if (!row) return null;
    return toGameData(row);
  } catch {
    return null;
  }
}

function toGameData(
  row: Awaited<ReturnType<typeof prisma.game.findUnique>> & {
    playLinks: { label: string; url: string }[];
    ogImage: string | null;
  }
): GameData {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    ogImage: row.ogImage,
    coverImage: row.coverImage,
    coverImageAlt: row.coverImageAlt,
    shortDesc: row.shortDesc,
    longDesc: row.longDesc,
    status: row.status,
    featured: row.featured,
    order: row.order,
    playLinks: row.playLinks,
  };
}
