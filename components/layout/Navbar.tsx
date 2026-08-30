"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { SlafurryMark } from "@/components/icons/SlafurryMark";
import { SettingsDropdown } from "./SettingsDropdown";

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/games", key: "games" },
  { href: "/devlog", key: "devlog" },
  { href: "/news", key: "news" },
  { href: "/press", key: "press" },
  { href: "/contact", key: "contact" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-neutral-900 bg-white/90 px-4 py-2 backdrop-blur dark:border-neutral-200 dark:bg-neutral-900/90 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-neutral-900 dark:text-white">
          <SlafurryMark className="h-7 w-7" />
          <span className="hidden font-body text-sm font-bold tracking-wide sm:inline">
            SLAFURRY STUDIOS
          </span>
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`font-body text-sm text-neutral-800 transition-colors hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white ${
                    active ? "font-semibold underline underline-offset-4" : ""
                  }`}
                >
                  {t(item.key)}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {/* Mobile nav drawer nyusul di step responsive polish — untuk step 2
              ini nav item disembunyikan di layar kecil (md:flex di atas) */}
          <SettingsDropdown />
        </div>
      </nav>
    </header>
  );
}
