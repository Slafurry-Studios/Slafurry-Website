import Link from "next/link";
import { SlafurryMark } from "@/components/icons/SlafurryMark";
import { BrandIcon } from "@/components/icons/BrandIcon";
import { getFooterLinks } from "@/lib/queries/home";
import type { SocialLink } from "@prisma/client";

export async function Footer() {
  const links: SocialLink[] = await getFooterLinks();

  return (
    <div className="mx-auto max-w-[90rem] px-3 md:px-8 mt-auto mb-4">
      <footer className="pixel-dark-frame px-6 py-6 text-white flex flex-col justify-between min-h-[12rem]">
        <div className="mx-auto flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                aria-label={link.label}
                target="_blank"
                rel="noreferrer"
                className="pixel-border-white flex h-12 w-12 items-center justify-center text-white transition-all hover:scale-105 sm:h-14 sm:w-14"
              >
                <BrandIcon slug={link.platform} className="relative z-20 h-6 w-6 sm:h-7 sm:w-7" />
              </a>
            ))}
          </div>

          <Link
            href="/"
            className="pixel-border-white flex h-12 items-center gap-2 px-2 sm:px-5 text-white sm:h-14 sm:gap-3"
          >
            <SlafurryMark className="relative z-20 h-6 w-6 sm:h-7 sm:w-7" />
            <span className="relative z-20 font-display text-sm tracking-tight whitespace-nowrap sm:text-xl sm:tracking-wide">
              SLAFURRY STUDIOS
            </span>
          </Link>
        </div>

        <p className="pt-6 text-center font-display text-xs text-neutral-400">
          © {new Date().getFullYear()} Slafurry Studios. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
