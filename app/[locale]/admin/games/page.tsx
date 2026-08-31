import { prisma } from "@/lib/prisma";
import { GamesList } from "@/components/admin/GamesList";

export default async function AdminGamesPage() {
  const games = await prisma.game.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { playLinks: true } } },
  });

  return (
    <GamesList
      games={games.map((g) => ({
        id: g.id,
        title: g.title,
        slug: g.slug,
        status: g.status,
        featured: g.featured,
        order: g.order,
        playLinkCount: g._count.playLinks,
      }))}
    />
  );
}
