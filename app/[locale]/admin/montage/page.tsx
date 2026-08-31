import { prisma } from "@/lib/prisma";
import { MontageList } from "@/components/admin/MontageList";

export default async function AdminMontagePage() {
  const [videos, games] = await Promise.all([
    prisma.montageVideo.findMany({
      orderBy: { order: "asc" },
      include: { game: { select: { id: true, title: true } } },
    }),
    prisma.game.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  return (
    <MontageList
      totalCount={videos.length}
      games={games}
      videos={videos.map((v) => ({
        id: v.id,
        label: v.label,
        videoUrl: v.videoUrl,
        order: v.order,
        isActive: v.isActive,
        gameTitle: v.game?.title ?? null,
      }))}
    />
  );
}
