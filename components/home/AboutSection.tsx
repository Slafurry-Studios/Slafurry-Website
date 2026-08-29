import { useTranslations } from "next-intl";
import { SlafurryMark } from "@/components/icons/SlafurryMark";
import { StudioAgeCounter } from "./StudioAgeCounter";

// Teks di bawah ini sementara hardcode, bakal ditarik dari
// SiteSettings.aboutText / aboutTextSerious pas hook ke database (step 4).
export function AboutSection() {
  const t = useTranslations("home");

  return (
    <section className="flex min-h-screen items-center border-t border-neutral-200 px-6 py-16 dark:border-neutral-800 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[220px_1fr] md:items-center">
        <SlafurryMark className="mx-auto h-40 w-40 text-neutral-900 dark:text-white md:mx-0" />

        <div>
          <h2 className="font-heading text-4xl tracking-wide">{t("about")}</h2>
          <div className="mt-4 space-y-4 font-body text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            <p>
              <strong className="text-neutral-900 dark:text-white">
                Slafurry Studios
              </strong>{" "}
              is a collective independent game developer based on Earth,
              Milky Way
              <span className="joke-only">
                {" "}
                with an experience of <StudioAgeCounter />,
              </span>{" "}
              driven by passion and the urge to create unforgettable
              journeys.
            </p>
            <p>
              We are a group of developers, artists, and creators brought
              together by our love for games and the ideas that turn into
              something real. We create games across different genres and
              styles, from small experiments to ambitious worlds, always
              looking for something new to explore.
            </p>
            <p className="joke-only">
              We started making games because it seemed like a fun thing to
              do. Somewhere along the way, the joke went too far. Now we are
              going professional.
            </p>
            <p className="joke-only text-neutral-500 dark:text-neutral-400">
              Still from Earth, though.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
