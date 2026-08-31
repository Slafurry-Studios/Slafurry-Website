"use client";

import { useRouter } from "@/i18n/navigation";
import { IconMailOpened, IconMail, IconCheck, IconTrash } from "@tabler/icons-react";

export function ContactActions({
  contactId,
  currentStatus,
}: {
  contactId: string;
  currentStatus: string;
}) {
  const router = useRouter();

  async function updateStatus(status: "NEW" | "READ" | "REPLIED") {
    const res = await fetch(`/api/admin/contacts/${contactId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this message?")) return;
    const res = await fetch(`/api/admin/contacts/${contactId}`, {
      method: "DELETE",
    });
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex items-center gap-1">
      {currentStatus !== "READ" && (
        <button
          type="button"
          onClick={() => updateStatus("READ")}
          title="Mark as read"
          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400"
        >
          <IconMailOpened size={16} />
        </button>
      )}
      {currentStatus !== "NEW" && (
        <button
          type="button"
          onClick={() => updateStatus("NEW")}
          title="Mark as new"
          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950 dark:hover:text-amber-400"
        >
          <IconMail size={16} />
        </button>
      )}
      {currentStatus !== "REPLIED" && (
        <button
          type="button"
          onClick={() => updateStatus("REPLIED")}
          title="Mark as replied"
          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950 dark:hover:text-emerald-400"
        >
          <IconCheck size={16} />
        </button>
      )}
      <button
        type="button"
        onClick={handleDelete}
        title="Delete"
        className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
      >
        <IconTrash size={16} />
      </button>
    </div>
  );
}
