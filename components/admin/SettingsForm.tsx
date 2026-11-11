"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  IconLoader2,
  IconPlus,
  IconTrash,
  IconAlertCircle,
  IconBrandDiscord,
  IconBrandSteam,
  IconBrandItch,
  IconBrandTiktok,
  IconBrandYoutube,
  IconBrandTwitter,
  IconBrandGithub,
  IconMail,
  IconLink,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";

// ─── Tabler icon map for social links ──────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  discord: IconBrandDiscord,
  steam: IconBrandSteam,
  itchdotio: IconBrandItch,
  tiktok: IconBrandTiktok,
  youtube: IconBrandYoutube,
  twitter: IconBrandTwitter,
  github: IconBrandGithub,
  mail: IconMail,
};

const PLATFORM_PRESETS = [
  { slug: "discord", label: "Discord" },
  { slug: "steam", label: "Steam" },
  { slug: "itchdotio", label: "Itch.io" },
  { slug: "tiktok", label: "TikTok" },
  { slug: "youtube", label: "YouTube" },
  { slug: "twitter", label: "Twitter / X" },
  { slug: "github", label: "GitHub" },
  { slug: "mail", label: "Email" },
];

type SettingsData = {
  tagline: string;
  aboutText: string;
  contactHeading: string;
  contactIntro: string;
  foundedAt: string;
  contactEmail: string;
  businessEmail: string;
  defaultOgImage: string;
};

type SocialLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
  section: "COMMUNITY" | "CONTACT" | "FOOTER";
  order: number;
  isHidden: boolean;
};

const SECTIONS: { key: SocialLink["section"]; label: string }[] = [
  { key: "COMMUNITY", label: "Community" },
  { key: "CONTACT", label: "Contact" },
  { key: "FOOTER", label: "Footer" },
];

export function SettingsForm({
  initialSettings,
  initialLinks,
}: {
  initialSettings: SettingsData;
  initialLinks: SocialLink[];
}) {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ─── Settings ────────────────────────────────────────────────
  function update<K extends keyof SettingsData>(key: K, value: SettingsData[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSaveSettings(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save settings.");
        setSaving(false);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setSaving(false);
      router.refresh();
    } catch {
      setError("Network error.");
      setSaving(false);
    }
  }

  // ─── Social Links ────────────────────────────────────────────
  async function addLink(section: SocialLink["section"]) {
    const res = await fetch("/api/admin/social-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: "discord",
        label: "",
        url: "",
        section,
        isHidden: false,
        order: links.filter((l) => l.section === section).length,
      }),
    });
    if (res.ok) {
      const link = await res.json();
      setLinks((prev) => [...prev, link]);
    }
  }

  async function updateLink(id: string, field: keyof SocialLink, value: string | number | boolean) {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
    await fetch(`/api/admin/social-links/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
  }

  async function deleteLink(id: string) {
    if (!confirm("Delete this social link?")) return;
    const res = await fetch(`/api/admin/social-links/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLinks((prev) => prev.filter((l) => l.id !== id));
    }
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white dark:focus:ring-white";
  const labelClass = "mb-1.5 block text-sm font-medium";
  const hintClass = "mb-4 block";

  return (
    <div className="space-y-10">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          <IconAlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      {/* ═══ SITE SETTINGS ═══ */}
      <form onSubmit={handleSaveSettings} className="space-y-8">
        <section className="space-y-4">
          <h2 className="font-display text-xl tracking-tight">Site Settings</h2>

          {/* Tagline */}
          <div className={hintClass}>
            <label className={labelClass}>Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              className={inputClass}
              placeholder="The joke went too far. Now we are going professional."
            />
          </div>

          {/* About */}
          <div className={hintClass}>
            <label className={labelClass}>About Text</label>
            <textarea
              rows={3}
              value={settings.aboutText}
              onChange={(e) => update("aboutText", e.target.value)}
              className={`${inputClass} min-h-[80px]`}
              placeholder="Slafurry Studios is an indie game development collective..."
            />
          </div>

          {/* Contact Heading */}
          <div className={hintClass}>
            <label className={labelClass}>Contact Heading</label>
            <input
              type="text"
              value={settings.contactHeading}
              onChange={(e) => update("contactHeading", e.target.value)}
              className={inputClass}
              placeholder="Get in touch"
            />
          </div>

          {/* Contact Intro */}
          <div className={hintClass}>
            <label className={labelClass}>Contact Intro</label>
            <textarea
              rows={3}
              value={settings.contactIntro}
              onChange={(e) => update("contactIntro", e.target.value)}
              className={`${inputClass} min-h-[80px]`}
              placeholder="Got a question, a business proposal, or just want to say the joke worked? Pick a channel below."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={hintClass}>
              <label className={labelClass}>Founded At</label>
              <input
                type="date"
                value={settings.foundedAt}
                onChange={(e) => update("foundedAt", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className={hintClass}>
              <label className={labelClass}>Default OG Image</label>
              <input
                type="url"
                value={settings.defaultOgImage}
                onChange={(e) => update("defaultOgImage", e.target.value)}
                className={inputClass}
                placeholder="https://... (1200x630)"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className={hintClass}>
              <label className={labelClass}>Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className={hintClass}>
              <label className={labelClass}>Business Email</label>
              <input
                type="email"
                value={settings.businessEmail}
                onChange={(e) => update("businessEmail", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* ═══ SOCIAL LINKS ═══ */}
        <section className="space-y-6">
          <h2 className="font-display text-xl tracking-tight">Social Links</h2>

          {SECTIONS.map((sec) => {
            const sectionLinks = links.filter((l) => l.section === sec.key);
            return (
              <div key={sec.key}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {sec.label}
                    <span className="ml-1.5 text-xs">({sectionLinks.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => addLink(sec.key)}
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    <IconPlus size={12} />
                    Add
                  </button>
                </div>

                {sectionLinks.length === 0 && (
                  <p className="rounded-lg border border-dashed border-neutral-300 py-4 text-center text-xs text-neutral-400 dark:border-neutral-700">
                    No links in this section.
                  </p>
                )}

                <div className="space-y-2">
                  {sectionLinks.map((link) => {
                    const IconComp = ICON_MAP[link.platform] || IconLink;
                    return (
                      <div
                        key={link.id}
                        className={`flex items-center gap-3 rounded-xl border p-3 ${
                          link.isHidden 
                            ? "border-neutral-200 bg-neutral-50 opacity-75 dark:border-neutral-800 dark:bg-neutral-900/50" 
                            : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                        }`}
                      >
                        <IconComp size={18} className="shrink-0 text-neutral-400" />

                        <select
                          value={link.platform}
                          onChange={(e) => updateLink(link.id, "platform", e.target.value)}
                          className="w-32 rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-900"
                        >
                          {PLATFORM_PRESETS.map((p) => (
                            <option key={p.slug} value={p.slug}>
                              {p.label}
                            </option>
                          ))}
                          <option value="custom">Custom...</option>
                        </select>

                        <input
                          type="text"
                          placeholder="Label"
                          value={link.label}
                          onChange={(e) => updateLink(link.id, "label", e.target.value)}
                          className={`${inputClass} !py-1.5 text-xs`}
                        />

                        <input
                          type="url"
                          placeholder="https://..."
                          value={link.url}
                          onChange={(e) => updateLink(link.id, "url", e.target.value)}
                          className={`${inputClass} flex-1 !py-1.5 text-xs`}
                        />

                        <input
                          type="number"
                          value={link.order}
                          onChange={(e) =>
                            updateLink(link.id, "order", parseInt(e.target.value) || 0)
                          }
                          className={`${inputClass} !py-1.5 text-xs w-16`}
                          title="Order"
                        />

                        <button
                          type="button"
                          onClick={() => updateLink(link.id, "isHidden", !link.isHidden)}
                          className="shrink-0 rounded-lg p-2.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                        >
                          <IconTrash size={16} />
                        </button>

                        {link.isHidden && (
                          <button
                            type="button"
                            onClick={() => deleteLink(link.id)}
                            className="shrink-0 rounded-lg p-2.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                          >
                            <IconTrash size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

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
            ) : saved ? (
              "Saved!"
            ) : (
              "Save Settings"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Side-by-side field pair component REMOVED (Serious Mode removed) ─────
