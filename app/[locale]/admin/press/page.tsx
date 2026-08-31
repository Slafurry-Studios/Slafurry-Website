import { prisma } from "@/lib/prisma";
import { PressList } from "@/components/admin/PressList";

export default async function AdminPressPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === "assets" ? "assets" : "releases";

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
      activeTab={activeTab}
      games={games}
      releases={releases.map((r) => ({
        id: r.id,
        title: r.title,
        outlet: r.outlet,
        url: r.url,
        publishedAt: r.publishedAt.toISOString(),
      }))}
      assets={assets.map((a) => ({
        id: a.id,
        label: a.label,
        type: a.type,
        fileUrl: a.fileUrl,
        gameTitle: a.game?.title ?? null,
      }))}
    />
  );
}
