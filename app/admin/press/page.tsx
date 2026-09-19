import { prisma } from "@/lib/prisma";
import { PressList } from "@/components/admin/PressList";

export default async function AdminPressPage() {
  const [releases, assets, games] = await Promise.all([
    prisma.pressRelease.findMany({ orderBy: { publishedAt: "desc" } }),
    prisma.pressKitAsset.findMany({
      orderBy: { label: "asc" },
      include: { game: { select: { id: true, title: true } } },
    }),
    prisma.game.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  return (
    <PressList
      games={games}
      releases={releases.map((r) => ({
        id: r.id,
        title: r.title,
        outlet: r.outlet,
        url: r.url,
        isHidden: r.isHidden,
        publishedAt: r.publishedAt.toISOString(),
      }))}
      assets={assets.map((a) => ({
        id: a.id,
        label: a.label,
        type: a.type,
        fileUrl: a.fileUrl,
        isHidden: a.isHidden,
        gameTitle: a.game?.title ?? null,
      }))}
    />
  );
}

