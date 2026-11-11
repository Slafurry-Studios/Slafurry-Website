import Link from "next/link";
import type { Game, SiteSettings } from "@prisma/client";
import { PillButton } from "@/components/ui/PillButton";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";
import { SlafurryMark } from "@/components/icons/SlafurryMark";

export function Hero({ upcomingGame, settings }: { upcomingGame: Game | null; settings: SiteSettings | null }) {
  
  const tagline = settings?.tagline ?? "The joke went too far. Now we are going professional";

  return (
    <section className="relative -mt-24 flex flex-col justify-start overflow-hidden bg-white px-4 pb-12 pt-32 text-neutral-900 sm:px-6 sm:pt-36 md:px-10">
      <div className="relative mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-2 md:items-center">
        <div className="flex flex-col items-center text-center gap-y-8 md:items-start md:text-left">
          <p className="font-display text-2xl font-semibold italic uppercase tracking-[0.2em] text-neutral-500 sm:text-4xl">
            Indie Game Developers
          </p>
          <SlafurryMark className="h-24 w-24 md:hidden sm:h-28 sm:w-28" />
          <h1 className="mt-3 font-display text-4xl leading-[0.95] tracking-wide sm:text-6xl lg:text-7xl">
            SLAFURRY
            <br />
            STUDIOS
          </h1>
          <p className="mt-5 max-w-md font-display text-xl text-neutral-500 joke-only">
            {tagline}
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
          <div className="flex flex-col items-center w-full sm:w-1/2">
            <p className="font-display text-xl sm:text-2xl font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
              Upcoming Project
            </p>
            <div className="relative mt-6 overflow-hidden pixel-border bg-white dark:bg-neutral-900 w-full sm:w-[min(680px,90%)]">
              <Link href={`/games/${upcomingGame.slug}`}>
                <div className="-mx-6 -mt-6 overflow-hidden">
                  {upcomingGame.coverImage ? (
                    <img
                      src={upcomingGame.coverImage}
                      alt={upcomingGame.coverImageAlt || upcomingGame.title}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  ) : (
                    <PlaceholderImage
                      label={upcomingGame.title}
                      className="aspect-[16/9] w-full"
                    />
                  )}
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="font-display text-xl sm:text-2xl font-semibold leading-snug text-neutral-900 dark:text-white">
                    {upcomingGame.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 font-display text-sm sm:text-xl text-neutral-600 dark:text-neutral-400">
                    {upcomingGame.shortDesc}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}