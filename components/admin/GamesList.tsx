"use client";

import { useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { IconPlus, IconPencil, IconStar, IconGripVertical, IconEyeOff, IconEye, IconTrash } from "@tabler/icons-react";
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
  isHidden: boolean;
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"VISIBLE" | "HIDDEN">("VISIBLE");

  const visibleCount = games.filter((g) => !g.isHidden).length;
  const hiddenCount = games.filter((g) => g.isHidden).length;

  const filteredGames = games.filter((g) =>
    activeTab === "VISIBLE" ? !g.isHidden : g.isHidden
  );

  async function toggleHide(id: string, isHidden: boolean) {
    await fetch(`/api/admin/games/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden }),
    });
    router.refresh();
  }

  async function deleteGame(id: string) {
    if (!confirm("Are you sure you want to permanently delete this game? This cannot be undone.")) return;
    await fetch(`/api/admin/games/${id}`, { method: "DELETE" });
    router.refresh();
  }

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
        data={filteredGames}
        searchPlaceholder="Search games..."
        searchKeys={["title", "slug"]}
        filters={FILTERS}
        columns={COLUMNS}
        defaultSort={{ key: "order", direction: "asc" }}
        emptyMessage={activeTab === "VISIBLE" ? "No games yet. Create your first one!" : "No hidden games."}
        headerExtra={
          <div className="flex gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900">
            <button
              onClick={() => setActiveTab("VISIBLE")}
              className={`flex-1 rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
                activeTab === "VISIBLE"
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              Visible
              <span className="ml-1.5 text-xs text-neutral-400 dark:text-neutral-500">{visibleCount}</span>
            </button>
            <button
              onClick={() => setActiveTab("HIDDEN")}
              className={`flex-1 rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
                activeTab === "HIDDEN"
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              Hidden
              {hiddenCount > 0 && <span className="ml-1.5 text-xs text-neutral-400 dark:text-neutral-500">{hiddenCount}</span>}
            </button>
          </div>
        }
        renderRow={(game) => (
          <div
            key={game.id}
            className={`flex items-center gap-4 rounded-xl border p-4 transition-shadow hover:shadow-sm ${
              game.isHidden 
                ? "border-neutral-200 bg-neutral-50 opacity-75 dark:border-neutral-800 dark:bg-neutral-900/50" 
                : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
            }`}
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
                title="Edit"
              >
                <IconPencil size={16} />
              </Link>
              {activeTab === "VISIBLE" ? (
                <button
                  onClick={() => toggleHide(game.id, true)}
                  className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                  title="Hide"
                >
                  <IconEyeOff size={16} />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => toggleHide(game.id, false)}
                    className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                    title="Restore"
                  >
                    <IconEye size={16} />
                  </button>
                  <button
                    onClick={() => deleteGame(game.id)}
                    className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-300"
                    title="Permanently Delete"
                  >
                    <IconTrash size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
}
