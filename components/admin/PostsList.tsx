"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconPlus,
  IconPencil,
  IconMessage,
  IconClock,
  IconEyeOff,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/DataTable";
import type { Column, DataTableFilter } from "@/components/admin/DataTable";

const STATUS_STYLE: Record<string, string> = {
  PUBLISHED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  DRAFT:
    "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
};

type PostRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  publishedAt: string | null;
  tags: string[];
  isHidden: boolean;
  commentCount: number;
};

const COLUMNS: Column<PostRow>[] = [
  { key: "title", label: "Title", sortable: true },
  { key: "slug", label: "Slug" },
  { key: "status", label: "Status", sortable: true },
  { key: "publishedAt", label: "Published", sortable: true, sortAccessor: (r) => r.publishedAt ?? "" },
  { key: "commentCount", label: "Comments", sortable: true, align: "right" },
];

const FILTERS: DataTableFilter[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "ALL", label: "All statuses" },
      { value: "PUBLISHED", label: "Published" },
      { value: "DRAFT", label: "Draft" },
    ],
  },
];

export function PostsList({
  posts,
}: {
  posts: PostRow[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"DEVLOG" | "NEWS">("DEVLOG");
  const [visibility, setVisibility] = useState<"VISIBLE" | "HIDDEN">("VISIBLE");

  const visibleCount = posts.filter(p => p.category === activeTab && !p.isHidden).length;
  const hiddenCount = posts.filter(p => p.category === activeTab && p.isHidden).length;

  const filteredPosts = posts.filter(
    (p) => p.category === activeTab && (visibility === "VISIBLE" ? !p.isHidden : p.isHidden)
  );

  async function toggleHide(id: string, isHidden: boolean) {
    await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden }),
    });
    router.refresh();
  }

  async function deletePost(id: string) {
    if (!confirm("Are you sure you want to permanently delete this post? This cannot be undone.")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl tracking-tight">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-900 bg-neutral-900 px-5 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:border-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          <IconPlus size={16} />
          New Post
        </Link>
      </div>

      <DataTable
        data={filteredPosts}
        searchPlaceholder="Search posts..."
        searchKeys={["title", "slug"]}
        filters={FILTERS}
        columns={COLUMNS}
        defaultSort={{ key: "publishedAt", direction: "desc" }}
        emptyMessage={`No ${visibility.toLowerCase()} ${activeTab.toLowerCase()} posts yet.`}
        headerExtra={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900">
              <button
                onClick={() => setActiveTab("DEVLOG")}
                className={`rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
                  activeTab === "DEVLOG"
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                Devlog
              </button>
              <button
                onClick={() => setActiveTab("NEWS")}
                className={`rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
                  activeTab === "NEWS"
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                News
              </button>
            </div>
            
            <div className="flex gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900 ml-auto">
              <button
                onClick={() => setVisibility("VISIBLE")}
                className={`rounded-md px-3 py-1.5 text-center text-sm font-medium transition-colors ${
                  visibility === "VISIBLE"
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                Visible <span className="ml-1 text-xs text-neutral-400">{visibleCount}</span>
              </button>
              <button
                onClick={() => setVisibility("HIDDEN")}
                className={`rounded-md px-3 py-1.5 text-center text-sm font-medium transition-colors ${
                  visibility === "HIDDEN"
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                Hidden {hiddenCount > 0 && <span className="ml-1 text-xs text-neutral-400">{hiddenCount}</span>}
              </button>
            </div>
          </div>
        }
        renderRow={(post) => (
          <div
            key={post.id}
            className={`flex items-center gap-4 rounded-xl border p-4 transition-shadow hover:shadow-sm ${
              post.isHidden 
                ? "border-neutral-200 bg-neutral-50 opacity-75 dark:border-neutral-800 dark:bg-neutral-900/50" 
                : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {post.title}
                </span>
                <span
                  className={`inline-block shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${STATUS_STYLE[post.status]}`}
                >
                  {post.status}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                <span>/{post.slug}</span>
                {post.publishedAt && (
                  <span className="flex items-center gap-1">
                    <IconClock size={12} />
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
                {post.commentCount > 0 && (
                  <span className="flex items-center gap-1">
                    <IconMessage size={12} />
                    {post.commentCount}
                  </span>
                )}
              </div>
              {post.tags.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium dark:bg-neutral-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                title="Edit"
              >
                <IconPencil size={16} />
              </Link>
              {visibility === "VISIBLE" ? (
                <button
                  onClick={() => toggleHide(post.id, true)}
                  className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                  title="Hide"
                >
                  <IconEyeOff size={16} />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => toggleHide(post.id, false)}
                    className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                    title="Restore"
                  >
                    <IconEye size={16} />
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
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
