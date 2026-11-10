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
    <div className="mx-auto max-w-7xl px-4 md:px-8 mt-auto mb-6">
      <footer className="pixel-dark-frame px-6 py-6 text-white">
        <div className="mx-auto flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                aria-label={link.label}
                target="_blank"
                rel="noreferrer"
                className="flex h-16 w-16 items-center justify-center border border-white/40 text-white transition-all hover:scale-105 hover:border-white"
              >
                <BrandIcon slug={link.platform} className="h-10 w-10" />
              </a>
            ))}
          </div>

          <Link href="/" className="flex items-center gap-4">
            <SlafurryMark className="h-10 w-10" />
            <span className="font-display text-2xl tracking-wide">
              SLAFURRY STUDIOS
            </span>
          </Link>
        </div>

        <p className="mt-6 text-center font-display text-sm text-white/50">
          © {new Date().getFullYear()} Slafurry Studios. "All Rights Reserved."
        </p>
      </footer>
    </div>
  );
}
