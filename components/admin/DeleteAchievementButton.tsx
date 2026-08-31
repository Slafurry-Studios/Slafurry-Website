"use client";

import { useRouter } from "@/i18n/navigation";
import { IconTrash } from "@tabler/icons-react";

export function DeleteAchievementButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this achievement? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/achievements/${id}`, {
      method: "DELETE",
    });
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
