"use client";

import { useRouter } from "@/i18n/navigation";
import { IconTrash } from "@tabler/icons-react";

export function DeleteReleaseButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this press release?")) return;
    const res = await fetch(`/api/admin/press/releases/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
    >
      <IconTrash size={16} />
    </button>
  );
}

export function DeleteAssetButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this asset?")) return;
    const res = await fetch(`/api/admin/press/assets/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
    >
      <IconTrash size={16} />
    </button>
  );
}
