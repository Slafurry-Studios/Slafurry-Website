import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GameForm } from "@/components/admin/GameForm";

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const game = await prisma.game.findUnique({
    where: { id },
    include: { playLinks: { orderBy: { id: "asc" } } },
  });

  if (!game) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-heading text-3xl tracking-tight">Edit Game</h1>
      <GameForm
        initial={{
          id: game.id,
          slug: game.slug,
          title: game.title,
          coverImage: game.coverImage,
          coverImageAlt: game.coverImageAlt,
          shortDesc: game.shortDesc,
          longDesc: game.longDesc,
          status: game.status,
          featured: game.featured,
          order: game.order,
          metaTitle: game.metaTitle ?? "",
          metaDescription: game.metaDescription ?? "",
          ogImage: game.ogImage ?? "",
          playLinks: game.playLinks.map((pl) => ({
            id: pl.id,
            label: pl.label,
            url: pl.url,
          })),
        }}
      />
    </div>
  );
}
