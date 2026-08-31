"use client";

import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import { useRouter } from "@/i18n/navigation";
import dynamic from "next/dynamic";
import {
  IconAlertCircle,
  IconLoader2,
  IconX,
  IconPlus,
  IconEye,
  IconCopy,
} from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";

const TiptapEditor = dynamic(
  () => import("@/components/admin/TiptapEditor").then((m) => m.TiptapEditor),
  { ssr: false }
);

type PostData = {
  id?: string;
  slug: string;
  title: string;
  coverImage: string;
  coverImageAlt: string;
  excerpt: string;
  content: string;
  category: "DEVLOG" | "NEWS";
  tags: string[];
  authorName: string;
  status: "DRAFT" | "PUBLISHED";
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  prevPostId: string | null;
  nextPostId: string | null;
  previewToken?: string | null;
  autosavedAt?: string | null;
};

type PostOption = { id: string; title: string; slug: string };

const EMPTY_POST: PostData = {
  slug: "",
  title: "",
  coverImage: "",
  coverImageAlt: "",
  excerpt: "",
  content: "",
  category: "DEVLOG",
  tags: [],
  authorName: "Slafurry Studios",
  status: "DRAFT",
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
  prevPostId: null,
  nextPostId: null,
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function PostForm({ initial }: { initial?: PostData }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [post, setPost] = useState<PostData>(initial ?? EMPTY_POST);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEdit);
  const [tagInput, setTagInput] = useState("");
  const [allPosts, setAllPosts] = useState<PostOption[]>([]);
  const [copiedPreview, setCopiedPreview] = useState(false);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef(post.content);

  // Fetch all posts for prev/next dropdowns
  useEffect(() => {
    fetch("/api/admin/posts")
      .then((r) => r.json())
      .then((data: PostOption[]) => setAllPosts(data))
      .catch(() => {});
  }, []);

  // Filter prev/next candidates (exclude current post)
  const postListForDropdown = allPosts.filter(
    (p) => p.id !== post.id
  );

  function update<K extends keyof PostData>(key: K, value: PostData[K]) {
    setPost((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && autoSlug) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  function addTag() {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !post.tags.includes(tag)) {
      update("tags", [...post.tags, tag]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    update(
      "tags",
      post.tags.filter((t) => t !== tag)
    );
  }

  // Autosave
  const triggerAutosave = useCallback(
    (content: string) => {
      if (!isEdit || !post.id) return;
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(async () => {
        try {
          await fetch(`/api/admin/posts/${post.id}/autosave`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, excerpt: post.excerpt }),
          });
        } catch {
          // Silently fail autosave
        }
      }, 3000);
    },
    [isEdit, post.id, post.excerpt]
  );

  function handleContentChange(html: string) {
    contentRef.current = html;
    update("content", html);
    triggerAutosave(html);
  }

  // Cleanup autosave timer
  useEffect(() => {
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, []);

  const previewUrl = post.previewToken
    ? `/api/preview/${post.previewToken}`
    : null;

  function copyPreviewUrl() {
    if (!previewUrl) return;
    const full = `${window.location.origin}${previewUrl}`;
    navigator.clipboard.writeText(full);
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 2000);
  }

  async function handleSubmit(e: FormEvent, status?: "DRAFT" | "PUBLISHED") {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...post,
      status: status ?? post.status,
      content: contentRef.current,
    };

    try {
      const url = isEdit ? `/api/admin/posts/${post.id}` : "/api/admin/posts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSaving(false);
        return;
      }

      router.push("/admin/posts");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white dark:focus:ring-white";

  const labelClass = "mb-1.5 block text-sm font-medium";
  const hintClass = "mb-4 block";

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          <IconAlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Main info */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl tracking-tight">Post Info</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className={hintClass}>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              required
              value={post.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className={hintClass}>
            <label className={labelClass}>Slug</label>
            <input
              type="text"
              value={post.slug}
              onChange={(e) => {
                setAutoSlug(false);
                update("slug", e.target.value);
              }}
              className={inputClass}
              placeholder="auto-generated from title"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className={hintClass}>
            <label className={labelClass}>Cover Image URL</label>
            <input
              type="text"
              value={post.coverImage}
              onChange={(e) => update("coverImage", e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
          <div className={hintClass}>
            <label className={labelClass}>Cover Image Alt Text</label>
            <input
              type="text"
              value={post.coverImageAlt}
              onChange={(e) => update("coverImageAlt", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className={hintClass}>
          <label className={labelClass}>Excerpt *</label>
          <textarea
            required
            rows={2}
            value={post.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            className={inputClass}
          />
        </div>
      </section>

      {/* Content editor */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl tracking-tight">Content</h2>
        <TiptapEditor content={post.content} onChange={handleContentChange} />
        {post.autosavedAt && (
          <p className="text-xs text-neutral-400">
            Last autosaved: {new Date(post.autosavedAt).toLocaleString()}
          </p>
        )}
      </section>

      {/* Settings */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl tracking-tight">Settings</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className={hintClass}>
            <label className={labelClass}>Category *</label>
            <select
              value={post.category}
              onChange={(e) =>
                update("category", e.target.value as PostData["category"])
              }
              className={inputClass}
            >
              <option value="DEVLOG">Devlog</option>
              <option value="NEWS">News</option>
            </select>
          </div>
          <div className={hintClass}>
            <label className={labelClass}>Status</label>
            <select
              value={post.status}
              onChange={(e) =>
                update("status", e.target.value as PostData["status"])
              }
              className={inputClass}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
          <div className={hintClass}>
            <label className={labelClass}>Author</label>
            <input
              type="text"
              value={post.authorName}
              onChange={(e) => update("authorName", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Tags */}
        <div className={hintClass}>
          <label className={labelClass}>Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className={inputClass}
              placeholder="Type a tag and press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="shrink-0 rounded-lg border border-neutral-300 px-3 text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              <IconPlus size={16} />
            </button>
          </div>
          {post.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium dark:bg-neutral-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-neutral-400 hover:text-red-500"
                  >
                    <IconX size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Prev/Next override */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl tracking-tight">Navigation Override</h2>
        <p className="text-xs text-neutral-500">
          Optionally override the automatic previous/next post order. Leave empty
          to use publishedAt order.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={hintClass}>
            <label className={labelClass}>Previous Post</label>
            <select
              value={post.prevPostId ?? ""}
              onChange={(e) => update("prevPostId", e.target.value || null)}
              className={inputClass}
            >
              <option value="">Auto (by date)</option>
              {postListForDropdown.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <div className={hintClass}>
            <label className={labelClass}>Next Post</label>
            <select
              value={post.nextPostId ?? ""}
              onChange={(e) => update("nextPostId", e.target.value || null)}
              className={inputClass}
            >
              <option value="">Auto (by date)</option>
              {postListForDropdown.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl tracking-tight">SEO</h2>

        <div className={hintClass}>
          <label className={labelClass}>Meta Title</label>
          <input
            type="text"
            value={post.metaTitle}
            onChange={(e) => update("metaTitle", e.target.value)}
            className={inputClass}
            placeholder="Defaults to post title"
          />
        </div>
        <div className={hintClass}>
          <label className={labelClass}>Meta Description</label>
          <textarea
            rows={2}
            value={post.metaDescription}
            onChange={(e) => update("metaDescription", e.target.value)}
            className={inputClass}
            placeholder="Defaults to excerpt"
          />
        </div>
        <div className={hintClass}>
          <label className={labelClass}>OG Image URL</label>
          <input
            type="text"
            value={post.ogImage}
            onChange={(e) => update("ogImage", e.target.value)}
            className={inputClass}
            placeholder="Defaults to cover image"
          />
        </div>
      </section>

      {/* Preview link */}
      {isEdit && previewUrl && (
        <section className="space-y-2">
          <h2 className="font-heading text-xl tracking-tight">Preview</h2>
          <div className="flex items-center gap-2">
            <Link
              href={previewUrl}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              <IconEye size={14} />
              Open Preview
            </Link>
            <button
              type="button"
              onClick={copyPreviewUrl}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              <IconCopy size={14} />
              {copiedPreview ? "Copied!" : "Copy URL"}
            </button>
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <button
          type="submit"
          disabled={saving}
          onClick={(e) => handleSubmit(e, post.status === "DRAFT" ? "DRAFT" : "PUBLISHED")}
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
            "Create Post"
          )}
        </button>
        {post.status === "DRAFT" && (
          <button
            type="button"
            disabled={saving}
            onClick={(e) => handleSubmit(e, "PUBLISHED")}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-600 bg-emerald-600 px-6 py-2.5 font-body text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Publish
          </button>
        )}
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-2.5 font-body text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
