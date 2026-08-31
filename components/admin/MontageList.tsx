"use client";

import { IconPlayerPlay, IconGripVertical } from "@tabler/icons-react";
import { MontageForm } from "@/components/admin/MontageForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { DataTable } from "@/components/admin/DataTable";
import type { Column, DataTableFilter } from "@/components/admin/DataTable";

type MontageRow = {
  id: string;
  label: string;
  videoUrl: string;
  order: number;
  isActive: boolean;
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
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl tracking-tight">Montage Videos</h1>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {totalCount} video{totalCount !== 1 ? "s" : ""}
        </span>
      </div>

      <DataTable
        data={videos}
        searchPlaceholder="Search videos..."
        searchKeys={["label", "gameTitle"]}
        filters={FILTERS}
        columns={COLUMNS}
        defaultSort={{ key: "order", direction: "asc" }}
        emptyMessage="No montage videos yet."
        topContent={
          <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="mb-3 text-sm font-medium">Add Video</h2>
            <MontageForm games={games} />
          </div>
        }
        renderRow={(v) => (
          <div
            key={v.id}
            className={`flex items-center gap-4 rounded-xl border bg-white p-4 transition-shadow hover:shadow-sm dark:bg-neutral-900 ${
              v.isActive
                ? "border-neutral-200 dark:border-neutral-800"
                : "border-neutral-200 opacity-60 dark:border-neutral-800"
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
            >
              <IconPlayerPlay size={16} />
            </a>

            <DeleteButton
              endpoint={`/api/admin/montage/${v.id}`}
              label="video"
            />
          </div>
        )}
      />
    </div>
  );
}
