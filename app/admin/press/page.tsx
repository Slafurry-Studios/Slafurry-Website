import { prisma } from "@/lib/prisma";
import { PressList } from "@/components/admin/PressList";
import { requireAdminPage } from "@/lib/auth/admin-guard";

// Admin halaman memerlukan sesi — jangan prerender statis waktu build.
export const dynamic = "force-dynamic";

export default async function AdminPressPage() {
  await requireAdminPage();

  const [releases, assets, games] = await Promise.all([
    prisma.pressRelease.findMany({
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    }),
    prisma.pressKitAsset.findMany({
      orderBy: [{ order: "asc" }, { label: "asc" }],
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
        order: r.order,
        publishedAt: r.publishedAt.toISOString(),
      }))}
      assets={assets.map((a) => ({
        id: a.id,
        label: a.label,
        type: a.type,
        fileUrl: a.fileUrl,
        isHidden: a.isHidden,
        order: a.order,
        gameTitle: a.game?.title ?? null,
      }))}
    />
  );
}

