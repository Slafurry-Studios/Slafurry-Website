import type { Game, SiteSettings } from "@prisma/client";
import { PillButton } from "@/components/ui/PillButton";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";

export function Hero({ upcomingGame, settings }: { upcomingGame: Game | null; settings: SiteSettings | null }) {
  
  const tagline = settings?.tagline ?? "&ldquo;The joke went too far. Now we are going professional.&rdquo;";
  const seriousTagline = settings?.taglineSerious ?? tagline;

  return (
    <section className="relative -mt-24 flex min-h-screen flex-col justify-center overflow-hidden bg-white px-6 pb-16 pt-24 text-neutral-900 md:px-10">
      <div className="relative mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-body text-lg font-semibold uppercase tracking-[0.2em] text-neutral-500">
            "Indie Game Developers"
          </p>
          <h1 className="mt-3 font-heading text-7xl leading-[0.95] tracking-wide sm:text-8xl">
            Slafurry
            <br />
            Studios
          </h1>
          <p className="mt-5 max-w-md font-body text-lg italic text-neutral-500 joke-only">
            {tagline}
          </p>
          <p className="mt-5 max-w-md font-body text-lg italic text-neutral-500 serious-only">
            {seriousTagline}
          </p>
          <div className="mt-8">
            <PillButton
              href="/games"
              className="border-0! rounded-none! bg-[url(/cta_btn.png)] bg-[length:100%_100%] bg-no-repeat transition-all! hover:scale-105 hover:bg-transparent! hover:text-neutral-900!"
            >
              "Play Our Games"
            </PillButton>
          </div>
        </div>

        {/* Belum ada Game yang ditandai `featured` di database — sembunyiin
            kolom ini daripada nampilin section kosong/pecah. */}
        {upcomingGame && (
          <div>
            <p className="font-body text-lg font-semibold uppercase tracking-wide underline underline-offset-4">
              "Upcoming Project"
            </p>
            {/* border.png dobel peran: mask bentuk (mask-image) + border
                handdrawn (overlay mix-blend-multiply — putihnya netral,
                itemnya jadi garis tepi). CSS border lama dihapus. */}
            <div className="relative mt-3 aspect-[16/9] w-full bg-white [-webkit-mask-image:url(/border.png)] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%_100%] [mask-image:url(/border.png)] [mask-repeat:no-repeat] [mask-size:100%_100%]">
              <PlaceholderImage
                label={upcomingGame.title}
                className="h-full w-full"
              />
              <img
                src="/border.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply"
              />
            </div>
            <p className="mt-3 max-w-sm font-body text-lg text-neutral-500">
              {upcomingGame.shortDesc}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}