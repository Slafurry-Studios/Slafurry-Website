"use client";

import { useRouter } from "@/i18n/navigation";
import { IconMessage, IconClock, IconMail, IconCheck, IconX, IconTrash } from "@tabler/icons-react";
import { CommentActions } from "@/components/admin/CommentActions";
import { DataTable } from "@/components/admin/DataTable";
import type { Column, DataTableFilter, BulkAction } from "@/components/admin/DataTable";

const TABS: { key: string; label: string }[] = [
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
  { key: "ALL", label: "All" },
];

const STATUS_STYLE: Record<string, string> = {
  PENDING:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  APPROVED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  REJECTED:
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

type CommentRow = {
  id: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: string;
  createdAt: string;
  postId: string;
  postTitle: string;
};

const COLUMNS: Column<CommentRow>[] = [
  { key: "authorName", label: "Author", sortable: true },
  { key: "content", label: "Comment" },
  { key: "status", label: "Status", sortable: true },
  { key: "postTitle", label: "Post", sortable: true },
  { key: "createdAt", label: "Date", sortable: true },
];

const FILTERS: DataTableFilter[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "ALL", label: "All statuses" },
      { value: "PENDING", label: "Pending" },
      { value: "APPROVED", label: "Approved" },
      { value: "REJECTED", label: "Rejected" },
    ],
  },
];

export function CommentsList({
  comments,
  activeTab,
  countMap,
  total,
}: {
  comments: CommentRow[];
  activeTab: string;
  countMap: Record<string, number>;
  total: number;
}) {
  const router = useRouter();

  const bulkActions: BulkAction<CommentRow>[] = [
    {
      key: "approve",
      label: "Approve",
      icon: IconCheck,
      onAction: async (selected) => {
        await Promise.all(
          selected.map((c) =>
            fetch(`/api/admin/comments/${c.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "APPROVED" }),
            })
          )
        );
        router.refresh();
      },
    },
    {
      key: "reject",
      label: "Reject",
      icon: IconX,
      onAction: async (selected) => {
        await Promise.all(
          selected.map((c) =>
            fetch(`/api/admin/comments/${c.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "REJECTED" }),
            })
          )
        );
        router.refresh();
      },
    },
    {
      key: "delete",
      label: "Delete",
      icon: IconTrash,
      variant: "danger",
      onAction: async (selected) => {
        if (!confirm(`Delete ${selected.length} comment${selected.length > 1 ? "s" : ""}?`)) return;
        await Promise.all(
          selected.map((c) =>
            fetch(`/api/admin/comments/${c.id}`, { method: "DELETE" })
          )
        );
        router.refresh();
      },
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl tracking-tight">Comments</h1>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {total} total
        </span>
      </div>

      <DataTable
        data={comments}
        searchPlaceholder="Search by author or content..."
        searchKeys={["authorName", "authorEmail", "content"]}
        filters={FILTERS}
        columns={COLUMNS}
        defaultSort={{ key: "createdAt", direction: "desc" }}
        getRowId={(c) => c.id}
        bulkActions={bulkActions}
        emptyMessage={
          activeTab === "PENDING"
            ? "No pending comments. All caught up!"
            : `No ${activeTab.toLowerCase()} comments.`
        }
        headerExtra={
          <div className="flex gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900">
            {TABS.map((tab) => {
              const count =
                tab.key === "ALL" ? total : (countMap[tab.key] ?? 0);
              return (
                <a
                  key={tab.key}
                  href={`/admin/comments?status=${tab.key}`}
                  className={`flex-1 rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  }`}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className="ml-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                      {count}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        }
        renderRow={(comment) => (
          <div
            key={comment.id}
            className="rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {comment.authorName}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-neutral-400">
                    <IconMail size={10} />
                    {comment.authorEmail}
                  </span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${STATUS_STYLE[comment.status]}`}
                  >
                    {comment.status}
                  </span>
                </div>

                <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
                  {comment.content}
                </p>

                <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
                  <a
                    href={`/admin/posts/${comment.postId}/edit`}
                    className="flex items-center gap-1 hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    <IconMessage size={12} />
                    {comment.postTitle}
                  </a>
                  <span className="flex items-center gap-1">
                    <IconClock size={12} />
                    {new Date(comment.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <CommentActions commentId={comment.id} />
            </div>
          </div>
        )}
      />
    </div>
  );
}
