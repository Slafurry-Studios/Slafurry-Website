"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "@/i18n/navigation";
import { IconPlus, IconLoader2, IconX } from "@tabler/icons-react";

type GameOption = { id: string; title: string };

type AssetData = {
  id?: string;
  label: string;
  type: "LOGO" | "BANNER" | "CHARACTER";
  fileUrl: string;
  gameId: string | null;
};

const EMPTY: AssetData = {
  label: "",
  type: "LOGO",
  fileUrl: "",
  gameId: null,
};

export function AssetForm({
  initial,
  games,
  onDone,
}: {
  initial?: AssetData;
  games: GameOption[];
  onDone?: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState<AssetData>(initial ?? EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update<K extends keyof AssetData>(key: K, value: AssetData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = isEdit
        ? `/api/admin/press/assets/${form.id}`
        : "/api/admin/press/assets";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSaving(false);
        return;
      }
      onDone?.();
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
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Label (e.g. Slafurry Studios)"
          required
          value={form.label}
          onChange={(e) => update("label", e.target.value)}
          className={inputClass}
        />
        <select
          value={form.type}
          onChange={(e) => update("type", e.target.value as AssetData["type"])}
          className={inputClass}
        >
          <option value="LOGO">Logo</option>
          <option value="BANNER">Banner</option>
          <option value="CHARACTER">Character</option>
        </select>
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
      </div>
      <input
        type="url"
        placeholder="File URL (https://...)"
        required
        value={form.fileUrl}
        onChange={(e) => update("fileUrl", e.target.value)}
        className={inputClass}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-900 bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50 dark:border-white dark:bg-white dark:text-neutral-900"
        >
          {saving ? <IconLoader2 size={12} className="animate-spin" /> : <IconPlus size={12} />}
          {isEdit ? "Save" : "Add"}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <IconX size={12} />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
