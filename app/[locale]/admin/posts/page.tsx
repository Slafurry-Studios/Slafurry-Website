import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import {
  IconPlus,
  IconPencil,
  IconMessage,
  IconClock,
} from "@tabler/icons-react";
import { DeletePostButton } from "@/components/admin/DeletePostButton";

const STATUS_STYLE: Record<string, string> = {
  PUBLISHED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  DRAFT:
    "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
};

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeTab = category === "NEWS" ? "NEWS" : "DEVLOG";

  const posts = await prisma.post.findMany({
    where: { category: activeTab },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

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

      {/* Category tabs */}
      <div className="flex gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900">
        <Link
          href="/admin/posts?category=DEVLOG"
          className={`flex-1 rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
            activeTab === "DEVLOG"
              ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
              : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          }`}
        >
          Devlog
        </Link>
        <Link
          href="/admin/posts?category=NEWS"
          className={`flex-1 rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
            activeTab === "NEWS"
              ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
              : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          }`}
        >
          News
        </Link>
      </div>

      {posts.length === 0 && (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <p className="text-sm text-neutral-500">
            No {activeTab.toLowerCase()} posts yet. Create your first one!
          </p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
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
                  {post._count.comments > 0 && (
                    <span className="flex items-center gap-1">
                      <IconMessage size={12} />
                      {post._count.comments}
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
                >
                  <IconPencil size={16} />
                </Link>
                <DeletePostButton postId={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
