"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  IconPlus,
  IconTrash,
  IconAlertCircle,
  IconLoader2,
  IconArrowLeft,
} from "@tabler/icons-react";
import Link from "next/link";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/Toast";
import { getYoutubeEmbedUrl } from "@/lib/youtube";

type PlayLinkRow = { id?: string; label: string; url: string };

type GameData = {
  id?: string;
  slug: string;
  title: string;
  coverImage: string;
  coverImageAlt: string;
  shortDesc: string;
  longDesc: string;
  status: "UPCOMING" | "RELEASED" | "IN_DEVELOPMENT";
  featured: boolean;
  order: number;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  playLinks: PlayLinkRow[];
};

const EMPTY_GAME: GameData = {
  slug: "",
  title: "",
  coverImage: "",
  coverImageAlt: "",
  shortDesc: "",
  longDesc: "",
  status: "IN_DEVELOPMENT",
  featured: false,
  order: 0,
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
  playLinks: [],
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function GameForm({ initial }: { initial?: GameData }) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(initial?.id);
  const [game, setGame] = useState<GameData>(initial ?? EMPTY_GAME);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  function update<K extends keyof GameData>(key: K, value: GameData[K]) {
    setGame((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && autoSlug) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  function addPlayLink() {
    setGame((prev) => ({
      ...prev,
      playLinks: [...prev.playLinks, { label: "", url: "" }],
    }));
  }

  function removePlayLink(index: number) {
    setGame((prev) => ({
      ...prev,
      playLinks: prev.playLinks.filter((_, i) => i !== index),
    }));
  }

  function updatePlayLink(index: number, field: "label" | "url", value: string) {
    setGame((prev) => ({
      ...prev,
      playLinks: prev.playLinks.map((pl, i) =>
        i === index ? { ...pl, [field]: value } : pl
      ),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = isEdit ? `/api/admin/games/${game.id}` : "/api/admin/games";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(game),
      });

      const data = await res.json();

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        setSaving(false);
        toast({
          title: "Error saving game",
          description: data.error || "Failed to save the game.",
          type: "error",
        });
        return;
      }

      toast({
        title: isEdit ? "Game updated" : "Game created",
        description: isEdit ? "The game has been updated successfully." : "The game has been created successfully.",
        type: "success",
      });
      router.push("/admin/games");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
      toast({
        title: "Error",
        description: "Network error while saving game.",
        type: "error",
      });
    }
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white dark:focus:ring-white";

  const labelClass = "mb-1.5 block text-sm font-medium";
  const hintClass = "mb-4 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          <IconAlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Main info */}
      <section className="space-y-4">
        <h2 className="font-display text-xl tracking-tight">Game Info</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className={hintClass}>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              required
              value={game.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className={hintClass}>
            <label className={labelClass}>Slug</label>
            <input
              type="text"
              value={game.slug}
              onChange={(e) => {
                setAutoSlug(false);
                update("slug", e.target.value);
              }}
              className={inputClass}
              placeholder="auto-generated from title"
            />
          </div>
        </div>

        <div className={hintClass}>
          <ImageUploader
            bucket="game-covers"
            label="Cover Image"
            value={
              game.coverImage
                ? { url: game.coverImage, altText: game.coverImageAlt }
                : null
            }
            onChange={(val) => {
              update("coverImage", val?.url ?? "");
              update("coverImageAlt", val?.altText ?? "");
            }}
          />
        </div>

        <div className={hintClass}>
          <label className={labelClass}>Short Description *</label>
          <textarea
            required
            rows={2}
            value={game.shortDesc}
            onChange={(e) => update("shortDesc", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className={hintClass}>
          <label className={labelClass}>Long Description</label>
          <textarea
            rows={5}
            value={game.longDesc}
            onChange={(e) => update("longDesc", e.target.value)}
            className={inputClass}
          />
        </div>
      </section>

      {/* Settings */}
      <section className="space-y-4">
        <h2 className="font-display text-xl tracking-tight">Settings</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className={hintClass}>
            <label className={labelClass}>Status</label>
            <select
              value={game.status}
              onChange={(e) => update("status", e.target.value as GameData["status"])}
              className={inputClass}
            >
              <option value="IN_DEVELOPMENT">In Development</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="RELEASED">Released</option>
            </select>
          </div>
          <div className={hintClass}>
            <label className={labelClass}>Order</label>
            <input
              type="number"
              value={game.order}
              onChange={(e) => update("order", parseInt(e.target.value) || 0)}
              className={inputClass}
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={game.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300"
              />
              Featured
            </label>
          </div>
        </div>
      </section>

      {/* Play Links */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl tracking-tight">Play Links</h2>
          <button
            type="button"
            onClick={addPlayLink}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <IconPlus size={14} />
            Add Link
          </button>
        </div>

        {game.playLinks.length === 0 && (
          <p className="text-sm text-neutral-400">No play links yet.</p>
        )}

        {game.playLinks.map((pl, i) => (
          <div key={i} className="flex gap-3">
            <input
              type="text"
              placeholder="Label (e.g. Steam)"
              value={pl.label}
              onChange={(e) => updatePlayLink(i, "label", e.target.value)}
              className={`${inputClass} sm:w-1/3`}
            />
            <input
              type="url"
              placeholder="https://..."
              value={pl.url}
              onChange={(e) => updatePlayLink(i, "url", e.target.value)}
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={() => removePlayLink(i)}
              className="shrink-0 rounded-lg p-2.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
            >
              <IconTrash size={16} />
            </button>
          </div>
        ))}
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="font-display text-xl tracking-tight">Preview</h2>
        <div className="relative aspect-[16/9] w-full max-w-md rounded-xl border p-1 overflow-hidden bg-neutral-50 dark:bg-neutral-900/50 group">
          {game.coverImage ? (
            <img
              src={game.coverImage}
              alt={game.coverImageAlt || game.title}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-30"
            />
          ) : (
            <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs font-display">
              No cover image
            </div>
          )}
          {getYoutubeEmbedUrl(game.playLinks) && (
            <iframe
              className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in"
              src={`${getYoutubeEmbedUrl(game.playLinks)}?autoplay=1&mute=1&rel=0&modestbranding=1&showinfo=0`}
              title={`${game.title} preview`}
              allow="autoplay; encrypted-media"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          )}
          {getYoutubeEmbedUrl(game.playLinks) ? (
            <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-200">
              <div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="text-xs font-medium text-white uppercase tracking-wider">YouTube preview</span>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                <span className="text-[10px] font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                  Add a YouTube play link to preview
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEO */}
      <section className="space-y-4">
        <h2 className="font-display text-xl tracking-tight">SEO</h2>

        <div className={hintClass}>
          <label className={labelClass}>Meta Title</label>
          <input
            type="text"
            value={game.metaTitle}
            onChange={(e) => update("metaTitle", e.target.value)}
            className={inputClass}
            placeholder="Defaults to game title"
          />
        </div>
        <div className={hintClass}>
          <label className={labelClass}>Meta Description</label>
          <textarea
            rows={2}
            value={game.metaDescription}
            onChange={(e) => update("metaDescription", e.target.value)}
            className={inputClass}
            placeholder="Defaults to short description"
          />
        </div>
        <div className={hintClass}>
          <ImageUploader
            bucket="game-covers"
            label="OG Image"
            value={
              game.ogImage ? { url: game.ogImage, altText: "" } : null
            }
            onChange={(val) => update("ogImage", val?.url ?? "")}
          />
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-900 bg-neutral-900 px-6 py-2.5 font-display text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {saving ? (
            <>
              <IconLoader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Create Game"
          )}
        </button>
        <Link
          href="/admin/games"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-2.5 font-display text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
