"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { IconSend } from "@tabler/icons-react";
import { PillButton } from "@/components/ui/PillButton";

// TODO (step 4+): ganti handleSubmit ke server action yang nulis ke
// ContactMessage (+ honeypot & rate-limit, sesuai spec). Untuk sekarang
// cuma simulasi submit di client biar form-nya bisa didemoin.
export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => setStatus("sent"), 600);
  }

  if (status === "sent") {
    return (
      <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 font-body text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
        {t("sentSuccess")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Honeypot — field ini disembunyikan lewat CSS, bukan hidden attribute,
          biar bot yang auto-fill form tetep ngisi ini (manusia gak akan
          liat/ngisi). Server action nanti nge-reject submit kalau ini keisi. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          type="text"
          name="name"
          placeholder={t("name")}
          className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 font-body text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white"
        />
        <input
          required
          type="email"
          name="email"
          placeholder={t("email")}
          className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 font-body text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white"
        />
      </div>

      <select
        name="category"
        defaultValue="GENERAL"
        className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 font-body text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white"
      >
        <option value="GENERAL">{t("categoryGeneral")}</option>
        <option value="BUSINESS">{t("categoryBusiness")}</option>
        <option value="PRESS">{t("categoryPress")}</option>
      </select>

      <textarea
        required
        name="message"
        rows={4}
        placeholder={t("message")}
        className="w-full resize-y rounded-xl border border-neutral-300 bg-transparent px-4 py-2.5 font-body text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-white"
      />

      <PillButton
        type="submit"
        variant="solid"
        icon={<IconSend size={16} />}
        className="w-full sm:w-auto"
      >
        {status === "submitting" ? "..." : t("send")}
      </PillButton>
    </form>
  );
}
