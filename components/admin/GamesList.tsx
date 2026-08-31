"use client";

import { Link } from "@/i18n/navigation";
import { IconPlus, IconPencil, IconStar, IconGripVertical } from "@tabler/icons-react";
import { DeleteGameButton } from "@/components/admin/DeleteGameButton";
import { DataTable } from "@/components/admin/DataTable";
import type { Column, DataTableFilter } from "@/components/admin/DataTable";

const STATUS_STYLE: Record<string, string> = {
  RELEASED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  UPCOMING:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  IN_DEVELOPMENT:
    "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
};

type GameRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  order: number;
  playLinkCount: number;
};

const COLUMNS: Column<GameRow>[] = [
  { key: "title", label: "Title", sortable: true },
  { key: "slug", label: "Slug" },
  { key: "status", label: "Status", sortable: true },
  { key: "order", label: "Order", sortable: true, align: "right" },
];

const FILTERS: DataTableFilter[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "ALL", label: "All statuses" },
      { value: "RELEASED", label: "Released" },
      { value: "UPCOMING", label: "Upcoming" },
      { value: "IN_DEVELOPMENT", label: "In Development" },
    ],
  },
];

export function GamesList({ games }: { games: GameRow[] }) {
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

      <DataTable
        data={games}
        searchPlaceholder="Search games..."
        searchKeys={["title", "slug"]}
        filters={FILTERS}
        columns={COLUMNS}
        defaultSort={{ key: "order", direction: "asc" }}
        emptyMessage="No games yet. Create your first one!"
        renderRow={(game) => (
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
                {game.playLinkCount > 0 &&
                  ` · ${game.playLinkCount} link${game.playLinkCount > 1 ? "s" : ""}`}
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
        )}
      />
    </div>
  );
}
