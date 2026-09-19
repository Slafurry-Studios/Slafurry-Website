"use client";

import { useState } from "react";
import {
  IconExternalLink,
  IconCalendar,
  IconFileTypePdf,
  IconPhoto,
  IconStar,
  IconEyeOff,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";
import { useRouter } from "@/i18n/navigation";
import { ReleaseForm } from "@/components/admin/ReleaseForm";
import { AssetForm } from "@/components/admin/AssetForm";
import { DataTable } from "@/components/admin/DataTable";
import type { Column, DataTableFilter } from "@/components/admin/DataTable";

const ASSET_TYPE_STYLE: Record<string, string> = {
  LOGO: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  BANNER:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  CHARACTER:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
};

type ReleaseRow = {
  id: string;
  title: string;
  outlet: string;
  url: string;
  isHidden: boolean;
  publishedAt: string;
};

type AssetRow = {
  id: string;
  label: string;
  type: string;
  fileUrl: string;
  isHidden: boolean;
  gameTitle: string | null;
};

type GameOption = { id: string; title: string };

const RELEASE_COLUMNS: Column<ReleaseRow>[] = [
  { key: "title", label: "Title", sortable: true },
  { key: "outlet", label: "Outlet", sortable: true },
  { key: "publishedAt", label: "Date", sortable: true },
];

const ASSET_COLUMNS: Column<AssetRow>[] = [
  { key: "label", label: "Label", sortable: true },
  { key: "type", label: "Type", sortable: true },
  { key: "gameTitle", label: "Game", sortable: true, sortAccessor: (r) => r.gameTitle ?? "" },
];

const ASSET_FILTERS: DataTableFilter[] = [
  {
    key: "type",
    label: "Type",
    options: [
      { value: "ALL", label: "All types" },
      { value: "LOGO", label: "Logo" },
      { value: "BANNER", label: "Banner" },
      { value: "CHARACTER", label: "Character" },
    ],
  },
];

export function PressList({
  releases,
  assets,
  games,
}: {
  releases: ReleaseRow[];
  assets: AssetRow[];
  games: GameOption[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("releases");
  const [visibility, setVisibility] = useState<"VISIBLE" | "HIDDEN">("VISIBLE");

  const visibleReleases = releases.filter(r => !r.isHidden);
  const hiddenReleases = releases.filter(r => r.isHidden);
  const visibleAssets = assets.filter(a => !a.isHidden);
  const hiddenAssets = assets.filter(a => a.isHidden);

  const filteredReleases = visibility === "VISIBLE" ? visibleReleases : hiddenReleases;
  const filteredAssets = visibility === "VISIBLE" ? visibleAssets : hiddenAssets;

  async function toggleHide(id: string, type: "releases" | "assets", isHidden: boolean) {
    await fetch(`/api/admin/press/${type}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden }),
    });
    router.refresh();
  }

  async function deleteItem(id: string, type: "releases" | "assets") {
    if (!confirm(`Are you sure you want to permanently delete this ${type === "releases" ? "release" : "asset"}? This cannot be undone.`)) return;
    await fetch(`/api/admin/press/${type}/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <h1 className="font-heading text-3xl tracking-tight">Press</h1>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900">
          <button
            onClick={() => setActiveTab("releases")}
            className={`flex-1 rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
              activeTab === "releases"
                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            }`}
          >
            Press Releases
          </button>
          <button
            onClick={() => setActiveTab("assets")}
            className={`flex-1 rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
              activeTab === "assets"
                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            }`}
          >
            Press Kit Assets
          </button>
        </div>
        
        <div className="flex gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900 sm:ml-auto">
          <button
            onClick={() => setVisibility("VISIBLE")}
            className={`rounded-md px-3 py-1.5 text-center text-sm font-medium transition-colors ${
              visibility === "VISIBLE"
                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            }`}
          >
            Visible <span className="ml-1 text-xs text-neutral-400">{activeTab === "releases" ? visibleReleases.length : visibleAssets.length}</span>
          </button>
          <button
            onClick={() => setVisibility("HIDDEN")}
            className={`rounded-md px-3 py-1.5 text-center text-sm font-medium transition-colors ${
              visibility === "HIDDEN"
                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            }`}
          >
            Hidden 
            {activeTab === "releases" && hiddenReleases.length > 0 && <span className="ml-1 text-xs text-neutral-400">{hiddenReleases.length}</span>}
            {activeTab === "assets" && hiddenAssets.length > 0 && <span className="ml-1 text-xs text-neutral-400">{hiddenAssets.length}</span>}
          </button>
        </div>
      </div>

      {activeTab === "releases" && (
        <DataTable
          data={filteredReleases}
          searchPlaceholder="Search releases..."
          searchKeys={["title", "outlet"]}
          columns={RELEASE_COLUMNS}
          defaultSort={{ key: "publishedAt", direction: "desc" }}
          emptyMessage={`No ${visibility.toLowerCase()} press releases.`}
          topContent={
            <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="mb-3 text-sm font-medium">Add Press Release</h2>
              <ReleaseForm />
            </div>
          }
          renderRow={(r) => (
            <div
              key={r.id}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-shadow hover:shadow-sm ${
                r.isHidden 
                  ? "border-neutral-200 bg-neutral-50 opacity-75 dark:border-neutral-800 dark:bg-neutral-900/50" 
                  : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{r.title}</span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="font-medium">{r.outlet}</span>
                  <span className="flex items-center gap-1">
                    <IconCalendar size={12} />
                    {new Date(r.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                  title="Open Link"
                >
                  <IconExternalLink size={16} />
                </a>
                {visibility === "VISIBLE" ? (
                  <button
                    onClick={() => toggleHide(r.id, "releases", true)}
                    className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                    title="Hide"
                  >
                    <IconEyeOff size={16} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => toggleHide(r.id, "releases", false)}
                      className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                      title="Restore"
                    >
                      <IconEye size={16} />
                    </button>
                    <button
                      onClick={() => deleteItem(r.id, "releases")}
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
      )}

      {activeTab === "assets" && (
        <DataTable
          data={filteredAssets}
          searchPlaceholder="Search assets..."
          searchKeys={["label", "gameTitle"]}
          filters={ASSET_FILTERS}
          columns={ASSET_COLUMNS}
          defaultSort={{ key: "label", direction: "asc" }}
          emptyMessage={`No ${visibility.toLowerCase()} press kit assets.`}
          topContent={
            <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="mb-3 text-sm font-medium">Add Press Kit Asset</h2>
              <AssetForm games={games} />
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                {a.type === "LOGO" ? (
                  <IconStar size={18} className="text-neutral-400" />
                ) : a.type === "BANNER" ? (
                  <IconPhoto size={18} className="text-neutral-400" />
                ) : (
                  <IconFileTypePdf size={18} className="text-neutral-400" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{a.label}</span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${ASSET_TYPE_STYLE[a.type]}`}
                  >
                    {a.type}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  {a.gameTitle && (
                    <span className="flex items-center gap-1">
                      <IconStar size={10} />
                      {a.gameTitle}
                    </span>
                  )}
                  <span className="truncate">{a.fileUrl}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <a
                  href={a.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                  title="Open Link"
                >
                  <IconExternalLink size={16} />
                </a>
                {visibility === "VISIBLE" ? (
                  <button
                    onClick={() => toggleHide(a.id, "assets", true)}
                    className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                    title="Hide"
                  >
                    <IconEyeOff size={16} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => toggleHide(a.id, "assets", false)}
                      className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                      title="Restore"
                    >
                      <IconEye size={16} />
                    </button>
                    <button
                      onClick={() => deleteItem(a.id, "assets")}
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
      )}
    </div>
  );
}
