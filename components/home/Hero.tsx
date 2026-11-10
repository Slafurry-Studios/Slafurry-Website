import type { Game, SiteSettings } from "@prisma/client";
import { PillButton } from "@/components/ui/PillButton";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";
import { SlafurryMark } from "@/components/icons/SlafurryMark";

export function Hero({ upcomingGame, settings }: { upcomingGame: Game | null; settings: SiteSettings | null }) {
  
  const tagline = settings?.tagline ?? "The joke went too far. Now we are going professional";
  const seriousTagline = settings?.taglineSerious ?? tagline;

  return (
    <section className="relative -mt-24 flex flex-col justify-start overflow-hidden bg-white px-4 pb-12 pt-32 text-neutral-900 sm:px-6 sm:pt-36 md:px-10">
      <div className="relative mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-2 md:items-center">
        <div className="flex flex-col items-center text-center gap-y-8 md:items-start md:text-left">
          <p className="font-display text-2xl font-semibold italic uppercase tracking-[0.2em] text-neutral-500 sm:text-4xl">
            Indie Game Developers
          </p>
          <SlafurryMark className="h-24 w-24 sm:h-28 sm:w-28" />
          <h1 className="mt-3 font-display text-4xl leading-[0.95] tracking-wide sm:text-6xl lg:text-7xl">
            SLAFURRY
            <br />
            STUDIOS
          </h1>
          <p className="mt-5 max-w-md font-display text-xl text-neutral-500 joke-only">
            {tagline}
          </p>
          <p className="mt-5 max-w-md font-display text-xl text-neutral-500 serious-only">
            {seriousTagline}
          </p>
          <div className="mt-8 hidden md:block">
            <PillButton
              href="/games"
              className="pixel-btn"
            >
              PLAY OUR GAMES
            </PillButton>
          </div>
        </div>

        {upcomingGame && (
          <div className="flex flex-col items-center">
            <p className="font-display text-2xl text-center font-semibold uppercase tracking-wide underline underline-offset-4 sm:text-4xl">
              Upcoming Project
            </p>
            <div className="relative mt-10 aspect-[16/9] w-full max-w-md pixel-frame overflow-hidden bg-white">
              <PlaceholderImage
                label={upcomingGame.title}
                className="h-full w-full"
              />
            </div>
            <p className="mt-6 text-center font-display text-xl text-neutral-500">
              {upcomingGame.shortDesc}
            </p>
            <div className="mt-8 md:hidden">
              <PillButton
                href="/games"
                className="pixel-btn"
              >
                PLAY OUR GAMES
              </PillButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}