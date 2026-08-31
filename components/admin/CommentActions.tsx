"use client";

import { useRouter } from "@/i18n/navigation";
import { IconCheck, IconX, IconTrash } from "@tabler/icons-react";

export function CommentActions({ commentId }: { commentId: string }) {
  const router = useRouter();

  async function updateStatus(status: "APPROVED" | "REJECTED") {
    const res = await fetch(`/api/admin/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this comment?")) return;
    const res = await fetch(`/api/admin/comments/${commentId}`, {
      method: "DELETE",
    });
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => updateStatus("APPROVED")}
        title="Approve"
        className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950 dark:hover:text-emerald-400"
      >
        <IconCheck size={16} />
      </button>
      <button
        type="button"
        onClick={() => updateStatus("REJECTED")}
        title="Reject"
        className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950 dark:hover:text-amber-400"
      >
        <IconX size={16} />
      </button>
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
