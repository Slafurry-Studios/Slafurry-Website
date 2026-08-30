import { useTranslations, useLocale } from "next-intl";
import type { SiteSettings } from "@prisma/client";
import { SlafurryMark } from "@/components/icons/SlafurryMark";
import { formatDate } from "@/lib/format";
import { StudioAgeCounter } from "./StudioAgeCounter";

export function AboutSection({ settings }: { settings: SiteSettings | null }) {
  const t = useTranslations("home");
  const locale = useLocale();

  // Fallback kalau SiteSettings somehow belum ke-seed — jarang kejadian
  // (seed.ts selalu bikin row id=1), tapi jaga-jaga daripada section-nya
  // kosong blas.
  const aboutText =
    settings?.aboutText ??
    "Slafurry Studios is an independent game development studio.";
  const aboutTextSerious = settings?.aboutTextSerious ?? aboutText;

  return (
    <section className="flex min-h-screen items-center border-t border-neutral-200 px-6 py-16 dark:border-neutral-800 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[220px_1fr] md:items-center">
        <SlafurryMark className="mx-auto h-40 w-40 text-neutral-900 dark:text-white md:mx-0" />

        <div>
          <h2 className="font-heading text-4xl tracking-wide">{t("about")}</h2>
          <div className="mt-4 space-y-4 font-body text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            {/* Dua versi teks (normal vs serious) di-render dua-duanya,
                CSS `.joke-only`/`.serious-only` yang nentuin mana yang
                keliatan — biar gak ada flash/mismatch pas toggle. */}
            <p className="joke-only whitespace-pre-line">{aboutText}</p>
            <p className="serious-only whitespace-pre-line">{aboutTextSerious}</p>

            {settings && (
              <>
                <p className="joke-only text-neutral-500 dark:text-neutral-400">
                  Founded <StudioAgeCounter foundedAt={settings.foundedAt} /> ago.
                </p>
                <p className="serious-only text-neutral-500 dark:text-neutral-400">
                  Founded {formatDate(settings.foundedAt, locale)}.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
