import { prisma } from "@/lib/prisma";
import { CommentStatus } from "@prisma/client";
import { IconMessage, IconClock, IconMail } from "@tabler/icons-react";
import { CommentActions } from "@/components/admin/CommentActions";

const TABS: { key: CommentStatus | "ALL"; label: string }[] = [
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

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeTab =
    status === "APPROVED" || status === "REJECTED" || status === "ALL"
      ? status
      : "PENDING";

  const where =
    activeTab === "ALL" ? undefined : { status: activeTab as CommentStatus };

  const [comments, counts] = await Promise.all([
    prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        post: { select: { id: true, title: true, slug: true, category: true } },
      },
    }),
    prisma.comment.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  const countMap = Object.fromEntries(
    counts.map((c) => [c.status, c._count.id])
  );
  const total = Object.values(countMap).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl tracking-tight">Comments</h1>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {total} total
        </span>
      </div>

      {/* Status tabs */}
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

      {comments.length === 0 && (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <IconMessage size={32} className="mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
          <p className="text-sm text-neutral-500">
            {activeTab === "PENDING"
              ? "No pending comments. All caught up!"
              : `No ${activeTab.toLowerCase()} comments.`}
          </p>
        </div>
      )}

      {comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {/* Author info */}
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

                  {/* Comment content */}
                  <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
                    {comment.content}
                  </p>

                  {/* Post context + timestamp */}
                  <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
                    <a
                      href={`/admin/posts/${comment.post.id}/edit`}
                      className="flex items-center gap-1 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      <IconMessage size={12} />
                      {comment.post.title}
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

                {/* Actions */}
                <CommentActions commentId={comment.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
