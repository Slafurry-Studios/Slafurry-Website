import { useTranslations } from "next-intl";
import type { Game, SiteSettings } from "@prisma/client";
import { PillButton } from "@/components/ui/PillButton";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";
import { HeroMontage } from "@/components/home/HeroMontage";
import { mockMontageVideos } from "@/lib/mock/montage";

export function Hero({ upcomingGame, settings }: { upcomingGame: Game | null; settings: SiteSettings | null }) {
  const t = useTranslations("home");

  const tagline = settings?.tagline ?? "&ldquo;The joke went too far. Now we are going professional.&rdquo;";
  const seriousTagline = settings?.taglineSerious ?? tagline;

  return (
    <section className="relative -mt-24 flex min-h-screen flex-col justify-center overflow-hidden bg-neutral-950 px-6 pb-16 pt-24 text-white md:px-10">
      {/* TODO: mockMontageVideos masih placeholder — ganti ke query
          MontageVideo dari database begitu ada video asli yang di-upload
          (lihat GitHub issues Milestone 3). */}
      <HeroMontage videos={mockMontageVideos} />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 font-heading text-6xl leading-[0.95] tracking-wide sm:text-7xl">
            Slafurry
            <br />
            Studios
          </h1>
          <p className="mt-4 max-w-sm font-body text-sm italic text-white/70 joke-only">
            {tagline}
          </p>
          <p className="mt-4 max-w-sm font-body text-sm italic text-white/70 serious-only">
            {seriousTagline}
          </p>
          <div className="mt-6">
            <PillButton variant="solid" href="/games">
              {t("playOurGames")}
            </PillButton>
          </div>
        </div>

        {/* Belum ada Game yang ditandai `featured` di database — sembunyiin
            kolom ini daripada nampilin section kosong/pecah. */}
        {upcomingGame && (
          <div>
            <p className="font-body text-sm font-semibold uppercase tracking-wide underline underline-offset-4">
              {t("upcomingProject")}
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border border-white/30 bg-white">
              <PlaceholderImage
                label={upcomingGame.title}
                className="aspect-[16/9] w-full"
              />
            </div>
            <p className="mt-3 max-w-sm font-body text-sm text-white/70">
              {upcomingGame.shortDesc}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}