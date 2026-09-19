"use client";

import { useState } from "react";
import { IconPlayerPlay, IconGripVertical, IconEyeOff, IconEye, IconTrash } from "@tabler/icons-react";
import { useRouter } from "@/i18n/navigation";
import { MontageForm } from "@/components/admin/MontageForm";
import { DataTable } from "@/components/admin/DataTable";
import type { Column, DataTableFilter } from "@/components/admin/DataTable";

type MontageRow = {
  id: string;
  label: string;
  videoUrl: string;
  order: number;
  isActive: boolean;
  isHidden: boolean;
  gameTitle: string | null;
};

type GameOption = { id: string; title: string };

const COLUMNS: Column<MontageRow>[] = [
  { key: "label", label: "Label", sortable: true },
  { key: "gameTitle", label: "Game", sortable: true, sortAccessor: (r) => r.gameTitle ?? "" },
  { key: "videoUrl", label: "URL" },
  { key: "order", label: "Order", sortable: true, align: "right" },
];

const FILTERS: DataTableFilter[] = [
  {
    key: "isActive",
    label: "Active",
    options: [
      { value: "ALL", label: "All" },
      { value: "true", label: "Active" },
      { value: "false", label: "Inactive" },
    ],
  },
];

export function MontageList({
  videos,
  games,
  totalCount,
}: {
  videos: MontageRow[];
  games: GameOption[];
  totalCount: number;
}) {
  const router = useRouter();
  const [visibility, setVisibility] = useState<"VISIBLE" | "HIDDEN">("VISIBLE");

  const visibleVideos = videos.filter(v => !v.isHidden);
  const hiddenVideos = videos.filter(v => v.isHidden);
  const filteredVideos = visibility === "VISIBLE" ? visibleVideos : hiddenVideos;

  async function toggleHide(id: string, isHidden: boolean) {
    await fetch(`/api/admin/montage/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden }),
    });
    router.refresh();
  }

  async function deleteVideo(id: string) {
    if (!confirm("Are you sure you want to permanently delete this video? This cannot be undone.")) return;
    await fetch(`/api/admin/montage/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl tracking-tight">Montage Videos</h1>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {totalCount} video{totalCount !== 1 ? "s" : ""}
        </span>
      </div>

      <DataTable
        data={filteredVideos}
        searchPlaceholder="Search videos..."
        searchKeys={["label", "gameTitle"]}
        filters={FILTERS}
        columns={COLUMNS}
        defaultSort={{ key: "order", direction: "asc" }}
        emptyMessage={`No ${visibility.toLowerCase()} montage videos yet.`}
        headerExtra={
          <div className="flex gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900">
            <button
              onClick={() => setVisibility("VISIBLE")}
              className={`rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
                visibility === "VISIBLE"
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              Visible <span className="ml-1.5 text-xs text-neutral-400 dark:text-neutral-500">{visibleVideos.length}</span>
            </button>
            <button
              onClick={() => setVisibility("HIDDEN")}
              className={`rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
                visibility === "HIDDEN"
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              Hidden
              {hiddenVideos.length > 0 && <span className="ml-1.5 text-xs text-neutral-400 dark:text-neutral-500">{hiddenVideos.length}</span>}
            </button>
          </div>
        }
        topContent={
          <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="mb-3 text-sm font-medium">Add Video</h2>
            <MontageForm games={games} />
          </div>
        }
        renderRow={(v) => (
          <div
            key={v.id}
            className={`flex items-center gap-4 rounded-xl border p-4 transition-shadow hover:shadow-sm ${
              v.isHidden
                ? "border-neutral-200 bg-neutral-50 opacity-75 dark:border-neutral-800 dark:bg-neutral-900/50"
                : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
            }`}
          >
            <IconGripVertical
              size={16}
              className="shrink-0 text-neutral-300 dark:text-neutral-600"
            />

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <IconPlayerPlay size={16} className="text-neutral-400" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{v.label}</span>
                {!v.isActive && (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800">
                    INACTIVE
                  </span>
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                {v.gameTitle && <span>{v.gameTitle}</span>}
                <span className="truncate">{v.videoUrl}</span>
              </div>
            </div>

            <span className="text-xs text-neutral-400">#{v.order}</span>

            <a
              href={v.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
              title="Open Link"
            >
              <IconPlayerPlay size={16} />
            </a>

            {visibility === "VISIBLE" ? (
              <button
                onClick={() => toggleHide(v.id, true)}
                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                title="Hide"
              >
                <IconEyeOff size={16} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => toggleHide(v.id, false)}
                  className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                  title="Restore"
                >
                  <IconEye size={16} />
                </button>
                <button
                  onClick={() => deleteVideo(v.id)}
                  className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-300"
                  title="Permanently Delete"
                >
                  <IconTrash size={16} />
                </button>
              </>
            )}
          </div>
        )}
      />
    </div>
  );
}
