import type { Game, SiteSettings } from "@prisma/client";
import { PillButton } from "@/components/ui/PillButton";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";

export function Hero({ upcomingGame, settings }: { upcomingGame: Game | null; settings: SiteSettings | null }) {
  
  const tagline = settings?.tagline ?? "&ldquo;The joke went too far. Now we are going professional.&rdquo;";
  const seriousTagline = settings?.taglineSerious ?? tagline;

  return (
    <section className="relative -mt-24 flex min-h-screen flex-col justify-center overflow-hidden bg-white px-6 pb-16 pt-24 text-neutral-900 md:px-10">
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            "Indie Game Developers"
          </p>
          <h1 className="mt-2 font-heading text-6xl leading-[0.95] tracking-wide sm:text-7xl">
            Slafurry
            <br />
            Studios
          </h1>
          <p className="mt-4 max-w-sm font-body text-sm italic text-neutral-500 joke-only">
            {tagline}
          </p>
          <p className="mt-4 max-w-sm font-body text-sm italic text-neutral-500 serious-only">
            {seriousTagline}
          </p>
          <div className="mt-6">
            <PillButton variant="solid" href="/games">
              "Play Our Games"
            </PillButton>
          </div>
        </div>

        {/* Belum ada Game yang ditandai `featured` di database — sembunyiin
            kolom ini daripada nampilin section kosong/pecah. */}
        {upcomingGame && (
          <div>
            <p className="font-body text-sm font-semibold uppercase tracking-wide underline underline-offset-4">
              "Upcoming Project"
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <PlaceholderImage
                label={upcomingGame.title}
                className="aspect-[16/9] w-full"
              />
            </div>
            <p className="mt-3 max-w-sm font-body text-sm text-neutral-500">
              {upcomingGame.shortDesc}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}