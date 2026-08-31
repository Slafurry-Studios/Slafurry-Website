"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "@/i18n/navigation";
import { IconPlus, IconLoader2 } from "@tabler/icons-react";

type GameOption = { id: string; title: string };

type VideoData = {
  label: string;
  videoUrl: string;
  gameId: string | null;
  order: number;
  isActive: boolean;
};

const EMPTY: VideoData = {
  label: "",
  videoUrl: "",
  gameId: null,
  order: 0,
  isActive: true,
};

export function MontageForm({ games }: { games: GameOption[] }) {
  const router = useRouter();
  const [form, setForm] = useState<VideoData>(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update<K extends keyof VideoData>(key: K, value: VideoData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/montage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSaving(false);
        return;
      }
      setForm(EMPTY);
      router.refresh();
    } catch {
      setError("Network error.");
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white dark:focus:ring-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-4">
        <input
          type="text"
          placeholder="Label"
          required
          value={form.label}
          onChange={(e) => update("label", e.target.value)}
          className={inputClass}
        />
        <input
          type="url"
          placeholder="Video URL (https://...)"
          required
          value={form.videoUrl}
          onChange={(e) => update("videoUrl", e.target.value)}
          className={inputClass}
        />
        <select
          value={form.gameId ?? ""}
          onChange={(e) => update("gameId", e.target.value || null)}
          className={inputClass}
        >
          <option value="">No game (studio-level)</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="number"
            value={form.order}
            onChange={(e) => update("order", parseInt(e.target.value) || 0)}
            className={`${inputClass} w-20`}
            title="Order"
          />
          <button
            type="submit"
            disabled={saving}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-900 bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50 dark:border-white dark:bg-white dark:text-neutral-900"
          >
            {saving ? (
              <IconLoader2 size={12} className="animate-spin" />
            ) : (
              <IconPlus size={12} />
            )}
            Add
          </button>
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs font-medium text-neutral-500">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => update("isActive", e.target.checked)}
          className="h-3.5 w-3.5 rounded border-neutral-300"
        />
        Active
      </label>
    </form>
  );
}
