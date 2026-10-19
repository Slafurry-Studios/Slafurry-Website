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
    <footer className="mt-auto bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              aria-label={link.label}
              target="_blank"
              rel="noreferrer"
              className="flex h-24 w-24 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-white hover:bg-white hover:text-neutral-950"
            >
              <BrandIcon slug={link.platform} className="h-16 w-16" />
            </a>
          ))}
        </div>

        <Link href="/" className="flex items-center gap-8">
          <SlafurryMark className="h-16 w-16" />
          <span className="font-heading text-4xl tracking-wide">
            SLAFURRY STUDIOS
          </span>
        </Link>
      </div>

      <p className="mt-20 text-center font-body text-base text-white/50">
        © {new Date().getFullYear()} Slafurry Studios. "All Rights Reserved."
      </p>
    </footer>
  );
}
