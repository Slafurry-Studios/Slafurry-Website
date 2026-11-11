import type { SiteSettings } from "@prisma/client";
import { SlafurryMark } from "@/components/icons/SlafurryMark";
import { formatDate } from "@/lib/format";
import { StudioAgeCounter } from "./StudioAgeCounter";

export function AboutSection({ settings }: { settings: SiteSettings | null }) {
    
  const aboutText =
    settings?.aboutText ??
    "Slafurry Studios is an independent game development studio.";

  return (
    <section className="flex items-center px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_2fr] md:items-center">
        <div className="hidden w-1/3 md:block md:w-full mx-auto md:mx-0">
          <SlafurryMark className="h-auto w-full text-neutral-900 md:aspect-square" />
        </div>

        <div className="ml-10">
          <h2 className="font-display text-6xl tracking-wide">About</h2>
          <div className="mt-10 space-y-8 font-display text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
            <p className="joke-only whitespace-pre-line">{aboutText}</p>

            {settings && (
              <>
                <p className="joke-only text-neutral-500 dark:text-neutral-400">
                  Founded <StudioAgeCounter foundedAt={settings.foundedAt} /> ago.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
