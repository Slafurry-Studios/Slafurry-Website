"use client";

import { useState } from "react";
import { IconSend, IconLoader2, IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import { PillButton } from "@/components/ui/PillButton";
import { Skeleton } from "@/components/ui/Skeleton";

export function CommentForm({
  postId,
  gameId,
}: {
  postId?: string;
  gameId?: string;
}) {
  const [state, setState] = useState<{ ok?: boolean; message?: string; error?: string } | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setIsPending(true);
    setState(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setState({ ok: false, error: result.error || "Failed to submit comment." });
        setIsPending(false);
        return;
      }

      setState({ ok: true, message: result.message || "Comment submitted! It will appear after moderation." });
      setIsPending(false);
      e.currentTarget.reset();
    } catch {
      setState({ ok: false, error: "Network error. Please try again." });
      setIsPending(false);
    }
  }

  return (
    <div className="mt-10 pixel-border bg-neutral-50 p-6 dark:bg-neutral-900/50">
      <h3 className="font-display text-xl font-semibold tracking-tight">
        Leave a message
      </h3>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Messages are reviewed before responding.
      </p>

      {state?.ok === true && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xl text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
          <IconCheck size={16} />
          {state.message}
        </div>
      )}

      {state?.ok === false && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xl text-red-700 dark:bg-red-900/30 dark:text-red-300">
          <IconAlertTriangle size={16} />
          {state.error}
        </div>
      )}

      {isPending ? (
        <div className="mt-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-20" />
          <PillButton size="sm" disabled className="w-full sm:w-auto">
            Sending…
          </PillButton>
        </div>
      ) : (
        <form action="#" className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            aria-hidden="true"
            suppressHydrationWarning
          />

          <input type="hidden" name="postId" value={postId ?? ""} />
          <input type="hidden" name="gameId" value={gameId ?? ""} />

          <div className="grid gap-3 sm:grid-cols-2">
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
                className="w-full pixel-border-sm bg-white px-3 py-2 text-xl outline-none transition-colors focus:ring-1 focus:ring-neutral-900 dark:bg-neutral-900 dark:focus:ring-white"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
              >
                Email
              </label>
              <input
                id="email"
                name="authorEmail"
                required
                type="email"
                className="w-full pixel-border-sm bg-white px-3 py-2 text-xl outline-none transition-colors focus:ring-1 focus:ring-neutral-900 dark:bg-neutral-900 dark:focus:ring-white"
                placeholder="you@example.com"
              />
              <p className="mt-1 text-[10px] text-neutral-400 dark:text-neutral-500">
                Not published — used for contact only.
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
              className="w-full resize-y pixel-border-sm bg-white px-3 py-2 text-xl outline-none transition-colors focus:ring-1 focus:ring-neutral-900 dark:bg-neutral-900 dark:focus:ring-white"
              placeholder="Write your thoughts..."
            />
          </div>

          <PillButton
            size="sm"
            type="submit"
            disabled={isPending}
            icon={<IconSend size={16} />}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <IconLoader2 size={16} className="animate-spin" />
                Sending…
              </>
            ) : (
              "Send message"
            )}
          </PillButton>
        </form>
      )}
    </div>
  );
}
