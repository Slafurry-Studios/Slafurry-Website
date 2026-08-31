"use client";

import { Link } from "@/i18n/navigation";
import { IconPlus, IconPencil, IconEyeOff, IconLock } from "@tabler/icons-react";
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
        data={achievements}
        searchPlaceholder="Search achievements..."
        searchKeys={["title", "key", "description", "category"]}
        filters={FILTERS}
        columns={COLUMNS}
        defaultSort={{ key: "order", direction: "asc" }}
        emptyMessage="No achievements yet. Create your first one!"
        renderRow={(a) => (
          <div
            key={a.id}
            className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
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
              >
                <IconPencil size={16} />
              </Link>
              <DeleteAchievementButton id={a.id} />
            </div>
          </div>
        )}
      />
    </div>
  );
}
