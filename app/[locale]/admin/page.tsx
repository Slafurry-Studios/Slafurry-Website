import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";
import {
  IconMessageExclamation,
  IconNews,
  IconTrophy,
  IconClock,
} from "@tabler/icons-react";

export default async function AdminDashboardPage() {
  const [pendingCommentCount, lastPublishedPost, totalAchievements] =
    await Promise.all([
      prisma.comment.count({ where: { status: "PENDING" } }),
      prisma.post.findFirst({
        where: { status: PostStatus.PUBLISHED },
        orderBy: { publishedAt: "desc" },
        select: {
          title: true,
          slug: true,
          category: true,
          publishedAt: true,
        },
      }),
      prisma.achievement.count({ where: { isActive: true } }),
    ]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <h1 className="font-heading text-3xl tracking-tight">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Pending comments */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-3 flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <IconMessageExclamation size={20} />
            <span className="text-sm font-medium">Pending Comments</span>
          </div>
          <p className="font-heading text-4xl">{pendingCommentCount}</p>
          {pendingCommentCount > 0 && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              Needs review
            </p>
          )}
          {pendingCommentCount === 0 && (
            <p className="mt-1 text-xs text-green-600 dark:text-green-400">
              All caught up
            </p>
          )}
        </div>

        {/* Last published post */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-3 flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <IconNews size={20} />
            <span className="text-sm font-medium">Last Published</span>
          </div>
          {lastPublishedPost ? (
            <>
              <p className="truncate text-sm font-medium">
                {lastPublishedPost.title}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <IconClock size={12} />
                <time>
                  {new Date(lastPublishedPost.publishedAt!).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                  )}
                </time>
                <span className="ml-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium uppercase dark:bg-neutral-800">
                  {lastPublishedPost.category}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-neutral-400">No posts yet</p>
          )}
        </div>

        {/* Total achievements */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-3 flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <IconTrophy size={20} />
            <span className="text-sm font-medium">Achievements</span>
          </div>
          <p className="font-heading text-4xl">{totalAchievements}</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Active definitions
          </p>
        </div>
      </div>

      {/* Quick note */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-2 text-sm font-medium">Quick Links</h2>
        <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
          <li>
            Pending comments require moderation —{" "}
            <span className="text-neutral-400">
              Comment management coming soon
            </span>
          </li>
          <li>
            Achievement unlock data is tracked client-side (localStorage) —
            server-side analytics not yet implemented
          </li>
        </ul>
      </div>
    </div>
  );
}
