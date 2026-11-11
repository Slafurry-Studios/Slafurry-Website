import Link from "next/link";
import { SlafurryMark } from "@/components/icons/SlafurryMark";
import { BrandIcon } from "@/components/icons/BrandIcon";

const FOOTER_LINKS = [
  { platform: "mail", label: "Email", url: "mailto:hello@slafurrystudios.com" },
  { platform: "youtube", label: "YouTube", url: "https://youtube.com" },
  { platform: "instagram", label: "Instagram", url: "https://instagram.com" },
  { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com" },
  { platform: "tiktok", label: "TikTok", url: "https://tiktok.com" },
] as const;

export function Footer() {
  return (
    <div className="mx-auto max-w-[90rem] px-3 md:px-8 mt-auto mb-4">
      <footer className="pixel-dark-frame px-6 py-6 text-white flex flex-col justify-between min-h-[12rem]">
        <div className="mx-auto flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.platform}
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
            className="pixel-border-white flex h-12 items-center gap-2 px-4 text-white sm:h-14 sm:gap-3 sm:px-5"
          >
            <SlafurryMark className="relative z-20 h-6 w-6 sm:h-7 sm:w-7" />
            <span className="relative z-20 font-display text-base tracking-wide sm:text-xl">
              SLAFURRY STUDIOS
            </span>
          </Link>
        </div>

        <p className="pt-6 text-center font-display text-xs text-neutral-400">
          © {new Date().getFullYear()} Slafurry Studios. All Rights Reserved.
          <Link
            href="/secret"
            className="ml-1 text-xs hover:text-neutral-200 transition-colors"
          >
            🥚
          </Link>
        </p>
      </footer>
    </div>
  );
}
