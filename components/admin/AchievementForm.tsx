"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  IconAlertCircle,
  IconLoader2,
  IconEye,
  IconEyeOff,
  IconLock,
} from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";

type AchievementData = {
  id?: string;
  key: string;
  title: string;
  description: string;
  hint: string;
  icon: string;
  triggerType: string;
  triggerConfig: Record<string, unknown>;
  isSecret: boolean;
  category: string;
  order: number;
  isActive: boolean;
  // FLAG_CODE only — plaintext input, never returned from API
  flagCode?: string;
};

const TRIGGER_TYPES = [
  { value: "PAGE_VISIT", label: "Page Visit" },
  { value: "EVENT", label: "Event" },
  { value: "VISIT_COUNT", label: "Visit Count" },
  { value: "SCROLL_DEPTH", label: "Scroll Depth" },
  { value: "TIME_ON_SITE", label: "Time on Site" },
  { value: "META_ALL", label: "Meta: All Unlocked" },
  { value: "FLAG_CODE", label: "Flag Code (Redeem)" },
  { value: "CHEAT_DETECTED", label: "Cheat Detected" },
];

const CATEGORIES = ["Exploration", "Story", "Secret", "Meta", ""];

const EMPTY: AchievementData = {
  key: "",
  title: "",
  description: "",
  hint: "",
  icon: "/mascot-default.png",
  triggerType: "PAGE_VISIT",
  triggerConfig: {},
  isSecret: false,
  category: "",
  order: 0,
  isActive: true,
};

export function AchievementForm({ initial }: { initial?: AchievementData }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState<AchievementData>(initial ?? EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [autoKey, setAutoKey] = useState(!isEdit);

  function update<K extends keyof AchievementData>(key: K, value: AchievementData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && autoKey) {
        next.key = (value as string)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_|_$/g, "");
      }
      return next;
    });
  }

  function updateConfig(configKey: string, configValue: unknown) {
    setForm((prev) => ({
      ...prev,
      triggerConfig: { ...prev.triggerConfig, [configKey]: configValue },
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = isEdit
        ? `/api/admin/achievements/${form.id}`
        : "/api/admin/achievements";
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
      router.push("/admin/achievements");
      router.refresh();
    } catch {
      setError("Network error.");
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white dark:focus:ring-white";
  const labelClass = "mb-1.5 block text-sm font-medium";
  const hintClass = "mb-4 block";

  // Dynamic config fields based on triggerType
  function renderConfigFields() {
    switch (form.triggerType) {
      case "PAGE_VISIT":
        return (
          <div className={hintClass}>
            <label className={labelClass}>Path</label>
            <input
              type="text"
              value={(form.triggerConfig.path as string) ?? ""}
              onChange={(e) => updateConfig("path", e.target.value)}
              className={inputClass}
              placeholder="/press"
            />
          </div>
        );

      case "EVENT":
        return (
          <div className={hintClass}>
            <label className={labelClass}>Event Name</label>
            <input
              type="text"
              value={(form.triggerConfig.eventName as string) ?? ""}
              onChange={(e) => updateConfig("eventName", e.target.value)}
              className={inputClass}
              placeholder="toggled_serious_mode"
            />
          </div>
        );

      case "VISIT_COUNT":
        return (
          <div className={hintClass}>
            <label className={labelClass}>Required Visits</label>
            <input
              type="number"
              min={1}
              value={((form.triggerConfig.count as number) ?? 1).toString()}
              onChange={(e) => updateConfig("count", parseInt(e.target.value) || 1)}
              className={inputClass}
            />
          </div>
        );

      case "SCROLL_DEPTH":
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={hintClass}>
              <label className={labelClass}>Path</label>
              <input
                type="text"
                value={(form.triggerConfig.path as string) ?? ""}
                onChange={(e) => updateConfig("path", e.target.value)}
                className={inputClass}
                placeholder="/"
              />
            </div>
            <div className={hintClass}>
              <label className={labelClass}>Percent</label>
              <input
                type="number"
                min={1}
                max={100}
                value={((form.triggerConfig.percent as number) ?? 100).toString()}
                onChange={(e) => updateConfig("percent", parseInt(e.target.value) || 100)}
                className={inputClass}
              />
            </div>
          </div>
        );

      case "TIME_ON_SITE":
        return (
          <div className={hintClass}>
            <label className={labelClass}>Seconds</label>
            <input
              type="number"
              min={1}
              value={((form.triggerConfig.seconds as number) ?? 300).toString()}
              onChange={(e) => updateConfig("seconds", parseInt(e.target.value) || 300)}
              className={inputClass}
            />
          </div>
        );

      case "FLAG_CODE":
        return (
          <div className={hintClass}>
            <label className={labelClass}>
              {isEdit ? "New Code (leave blank to keep current)" : "Flag Code"}
            </label>
            <div className="relative">
              <IconLock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={form.flagCode ?? ""}
                onChange={(e) => update("flagCode", e.target.value)}
                className={`${inputClass} pl-9`}
                placeholder={isEdit ? "••••••••" : "Enter plaintext code"}
              />
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Hashed with SHA-256 on save. The plaintext is never stored or displayed again.
            </p>
          </div>
        );

      case "META_ALL":
      case "CHEAT_DETECTED":
      default:
        return null;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          <IconAlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Basic info */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl tracking-tight">Achievement Info</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className={hintClass}>
            <label className={labelClass}>Key *</label>
            <input
              type="text"
              required
              value={form.key}
              onChange={(e) => {
                setAutoKey(false);
                update("key", e.target.value);
              }}
              className={inputClass}
              placeholder="auto-generated from title"
            />
          </div>
          <div className={hintClass}>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className={hintClass}>
          <label className={labelClass}>Description *</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className={hintClass}>
            <label className={labelClass}>Hint</label>
            <input
              type="text"
              value={form.hint}
              onChange={(e) => update("hint", e.target.value)}
              className={inputClass}
              placeholder="Shown when locked"
            />
          </div>
          <div className={hintClass}>
            <label className={labelClass}>Icon URL</label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => update("icon", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Trigger config */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl tracking-tight">Trigger</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className={hintClass}>
            <label className={labelClass}>Trigger Type</label>
            <select
              value={form.triggerType}
              onChange={(e) => update("triggerType", e.target.value)}
              className={inputClass}
            >
              {TRIGGER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className={hintClass}>
            <label className={labelClass}>Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => update("order", parseInt(e.target.value) || 0)}
              className={inputClass}
            />
          </div>
        </div>

        {renderConfigFields()}
      </section>

      {/* Flags */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl tracking-tight">Options</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className={hintClass}>
            <label className={labelClass}>Category</label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c || "None"}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.isSecret}
                onChange={(e) => update("isSecret", e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300"
              />
              Secret
            </label>
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => update("isActive", e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300"
              />
              Active
            </label>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-900 bg-neutral-900 px-6 py-2.5 font-body text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {saving ? (
            <>
              <IconLoader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Create Achievement"
          )}
        </button>
        <Link
          href="/admin/achievements"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-2.5 font-body text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
