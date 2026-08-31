import { prisma } from "@/lib/prisma";
import { GameStatus } from "@prisma/client";

// ─── Public type ───────────────────────────────────────────────
export type GameData = {
  id: string;
  slug: string;
  title: string;
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

/** Fetch all active games (RELEASED + UPCOMING) for the public list. */
export async function getActiveGames(): Promise<GameData[]> {
  const rows = await prisma.game.findMany({
    where: { status: { in: [GameStatus.RELEASED, GameStatus.UPCOMING] } },
    orderBy: { order: "asc" },
    include: { playLinks: { select: { label: true, url: true } } },
  });
  return rows.map(toGameData);
}

/** Fetch a single game by slug. */
export async function getGameBySlug(slug: string): Promise<GameData | null> {
  const row = await prisma.game.findUnique({
    where: { slug },
    include: { playLinks: { select: { label: true, url: true } } },
  });
  if (!row) return null;
  return toGameData(row);
}

function toGameData(
  row: Awaited<ReturnType<typeof prisma.game.findUnique>> & {
    playLinks: { label: string; url: string }[];
  }
): GameData {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
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
