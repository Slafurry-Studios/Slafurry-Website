import { IconMessage } from "@tabler/icons-react";
import type { PublicComment } from "@/lib/queries/comments";

export function CommentList({ comments }: { comments: PublicComment[] }) {
  if (comments.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight">
        <IconMessage size={18} />
        Comments ({comments.length})
      </h3>

      <div className="mt-4 space-y-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{c.authorName}</span>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                {new Date(c.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
              {c.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
