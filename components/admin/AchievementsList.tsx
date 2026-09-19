"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { IconPlus, IconPencil, IconEyeOff, IconEye, IconLock, IconTrash } from "@tabler/icons-react";
import { DeleteAchievementButton } from "@/components/admin/DeleteAchievementButton";
import { DataTable } from "@/components/admin/DataTable";
import type { Column, DataTableFilter } from "@/components/admin/DataTable";

const TRIGGER_STYLE: Record<string, string> = {
  PAGE_VISIT: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  EVENT: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  VISIT_COUNT: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  SCROLL_DEPTH: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  TIME_ON_SITE: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  META_ALL: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  FLAG_CODE: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  CHEAT_DETECTED: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
};

type AchievementRow = {
  id: string;
  key: string;
  title: string;
  description: string;
  triggerType: string;
  isSecret: boolean;
  category: string;
  order: number;
  isActive: boolean;
  isHidden: boolean;
  hasFlag: boolean;
};

const COLUMNS: Column<AchievementRow>[] = [
  { key: "title", label: "Title", sortable: true },
  { key: "key", label: "Key", sortable: true },
  { key: "triggerType", label: "Trigger", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { key: "order", label: "Order", sortable: true, align: "right" },
];

const FILTERS: DataTableFilter[] = [
  {
    key: "category",
    label: "Category",
    options: [
      { value: "ALL", label: "All categories" },
      { value: "Exploration", label: "Exploration" },
      { value: "Story", label: "Story" },
      { value: "Secret", label: "Secret" },
      { value: "Meta", label: "Meta" },
      { value: "Uncategorized", label: "Uncategorized" },
    ],
  },
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

export function AchievementsList({
  achievements,
}: {
  achievements: AchievementRow[];
}) {
  const router = useRouter();
  const [visibility, setVisibility] = useState<"VISIBLE" | "HIDDEN">("VISIBLE");

  const visibleAchievements = achievements.filter(a => !a.isHidden);
  const hiddenAchievements = achievements.filter(a => a.isHidden);
  const filteredAchievements = visibility === "VISIBLE" ? visibleAchievements : hiddenAchievements;

  async function toggleHide(id: string, isHidden: boolean) {
    await fetch(`/api/admin/achievements/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden }),
    });
    router.refresh();
  }

  async function deleteAchievement(id: string) {
    if (!confirm("Are you sure you want to permanently delete this achievement? This cannot be undone.")) return;
    await fetch(`/api/admin/achievements/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl tracking-tight">Achievements</h1>
        <Link
          href="/admin/achievements/new"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-900 bg-neutral-900 px-5 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:border-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          <IconPlus size={16} />
          New Achievement
        </Link>
      </div>

      <DataTable
        data={filteredAchievements}
        searchPlaceholder="Search achievements..."
        searchKeys={["title", "key", "description", "category"]}
        filters={FILTERS}
        columns={COLUMNS}
        defaultSort={{ key: "order", direction: "asc" }}
        emptyMessage={`No ${visibility.toLowerCase()} achievements yet.`}
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
              Visible <span className="ml-1.5 text-xs text-neutral-400 dark:text-neutral-500">{visibleAchievements.length}</span>
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
              {hiddenAchievements.length > 0 && <span className="ml-1.5 text-xs text-neutral-400 dark:text-neutral-500">{hiddenAchievements.length}</span>}
            </button>
          </div>
        }
        renderRow={(a) => (
          <div
            key={a.id}
            className={`flex items-center gap-4 rounded-xl border p-4 transition-shadow hover:shadow-sm ${
              a.isHidden 
                ? "border-neutral-200 bg-neutral-50 opacity-75 dark:border-neutral-800 dark:bg-neutral-900/50" 
                : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{a.title}</span>
                <span className="text-xs text-neutral-400">({a.key})</span>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${TRIGGER_STYLE[a.triggerType]}`}
                >
                  {a.triggerType.replace(/_/g, " ")}
                </span>
                {a.isSecret && (
                  <IconEyeOff size={14} className="text-neutral-400" title="Secret" />
                )}
                {a.hasFlag && (
                  <IconLock size={14} className="text-red-400" title="Flag code set" />
                )}
                {!a.isActive && (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800">
                    INACTIVE
                  </span>
                )}
              </div>
              <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400">
                {a.description}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <span className="mr-2 text-xs text-neutral-400">#{a.order}</span>
              <Link
                href={`/admin/achievements/${a.id}/edit`}
                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                title="Edit"
              >
                <IconPencil size={16} />
              </Link>
              {visibility === "VISIBLE" ? (
                <button
                  onClick={() => toggleHide(a.id, true)}
                  className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                  title="Hide"
                >
                  <IconEyeOff size={16} />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => toggleHide(a.id, false)}
                    className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                    title="Restore"
                  >
                    <IconEye size={16} />
                  </button>
                  <button
                    onClick={() => deleteAchievement(a.id)}
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
