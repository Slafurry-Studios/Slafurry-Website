"use client";

import { useActionState } from "react";
import { submitComment } from "@/lib/actions/comment";
import { IconSend, IconLoader2, IconCheck, IconAlertTriangle } from "@tabler/icons-react";

export function CommentForm({
  postId,
  gameId,
}: {
  postId?: string;
  gameId?: string;
}) {
  const [state, formAction, isPending] = useActionState(submitComment, null);

  return (
    <div className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
      <h3 className="font-heading text-lg font-semibold tracking-tight">
        Leave a comment
      </h3>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Comments are moderated before appearing on the page.
      </p>

      {state?.ok === true && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
          <IconCheck size={16} />
          {state.message}
        </div>
      )}

      {state?.ok === false && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          <IconAlertTriangle size={16} />
          {state.error}
        </div>
      )}

      {state?.ok !== true && (
        <form action={formAction} className="mt-4 space-y-4">
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            aria-hidden="true"
          />

          <input type="hidden" name="postId" value={postId ?? ""} />
          <input type="hidden" name="gameId" value={gameId ?? ""} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="authorName"
                className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
              >
                Name
              </label>
              <input
                id="authorName"
                name="authorName"
                required
                maxLength={100}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white dark:focus:ring-white"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="authorEmail"
                className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
              >
                Email
              </label>
              <input
                id="authorEmail"
                name="authorEmail"
                type="email"
                required
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white dark:focus:ring-white"
                placeholder="you@example.com"
              />
              <p className="mt-1 text-[10px] text-neutral-400 dark:text-neutral-500">
                Not published — used for moderation only.
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="content"
              className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
            >
              Comment
            </label>
            <textarea
              id="content"
              name="content"
              required
              maxLength={2000}
              rows={4}
              className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white dark:focus:ring-white"
              placeholder="Write your thoughts..."
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-900 bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:border-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {isPending ? (
              <IconLoader2 size={14} className="animate-spin" />
            ) : (
              <IconSend size={14} />
            )}
            {isPending ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}
