import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { IconPlus, IconPencil, IconStar, IconGripVertical } from "@tabler/icons-react";
import { DeleteGameButton } from "@/components/admin/DeleteGameButton";

const STATUS_STYLE: Record<string, string> = {
  RELEASED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  UPCOMING:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  IN_DEVELOPMENT:
    "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
};

export default async function AdminGamesPage() {
  const games = await prisma.game.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { playLinks: true } } },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl tracking-tight">Games</h1>
        <Link
          href="/admin/games/new"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-900 bg-neutral-900 px-5 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:border-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          <IconPlus size={16} />
          New Game
        </Link>
      </div>

      {games.length === 0 && (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <p className="text-sm text-neutral-500">No games yet. Create your first one!</p>
        </div>
      )}

      {games.length > 0 && (
        <div className="space-y-3">
          {games.map((game) => (
            <div
              key={game.id}
              className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <IconGripVertical
                size={16}
                className="shrink-0 text-neutral-300 dark:text-neutral-600"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">
                    {game.title}
                  </span>
                  {game.featured && (
                    <IconStar
                      size={14}
                      className="shrink-0 text-amber-500"
                      fill="currentColor"
                    />
                  )}
                  <span
                    className={`inline-block shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${STATUS_STYLE[game.status]}`}
                  >
                    {game.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  /{game.slug}
                  {game._count.playLinks > 0 &&
                    ` · ${game._count.playLinks} link${game._count.playLinks > 1 ? "s" : ""}`}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/games/${game.id}/edit`}
                  className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                >
                  <IconPencil size={16} />
                </Link>
                <DeleteGameButton gameId={game.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
