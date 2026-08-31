"use client";

import { useActionState } from "react";
import { submitContactMessage } from "@/lib/actions/contact";
import { IconSend, IconLoader2, IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import { PillButton } from "@/components/ui/PillButton";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactMessage, null);

  return (
    <div className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
      <h3 className="font-heading text-lg font-semibold tracking-tight">
        Leave a message
      </h3>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Messages are reviewed before responding.
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
        <form action={formAction} className="mt-6 space-y-4">
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            aria-hidden="true"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                maxLength={100}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white dark:focus:ring-white"
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
                name="email"
                required
                type="email"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white dark:focus:ring-white"
                placeholder="you@example.com"
              />
              <p className="mt-1 text-[10px] text-neutral-400 dark:text-neutral-500">
                Not published — used for contact only.
              </p>
            </div>
          </div>

          <textarea
            name="message"
            rows={6}
            required
            className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white dark:focus:ring-white"
            placeholder="Write your message..."
          />

          <div>
            <label
              htmlFor="category"
              className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue="GENERAL"
              className="w-full rounded-lg border border-neutral-300 bg-transparent px-4 py-2.5 font-body text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white"
            >
              <option value="GENERAL">General inquiry</option>
              <option value="BUSINESS">Business partnership</option>
              <option value="PRESS">Press/media</option>
            </select>
          </div>

          <PillButton
            type="submit"
            disabled={isPending}
            variant="solid"
            icon={<IconSend size={16} />}
            className="w-full sm:w-auto"
          >
            {isPending ? "Sending..." : "Send message"}
          </PillButton>
        </form>
      )}
    </div>
  );
}