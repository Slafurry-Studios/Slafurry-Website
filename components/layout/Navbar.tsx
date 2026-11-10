"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconMenu, IconX } from "@tabler/icons-react";
import { SlafurryMark } from "@/components/icons/SlafurryMark";

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/games", key: "games" },
  { href: "/devlog", key: "devlog" },
  { href: "/news", key: "news" },
  { href: "/press", key: "press" },
  { href: "/contact", key: "contact" },
] as const;

export function Navbar() {
    const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <nav className="relative mx-auto flex max-w-4xl items-center justify-between pixel-frame-filled px-3 md:px-4 py-0.5">
        <Link href="/" className="flex items-center gap-2 px-2 text-neutral-900 dark:text-white">
          <SlafurryMark className="h-7 w-7" />
          <span className="whitespace-nowrap font-display text-base font-bold tracking-wide sm:text-xl">
            SLAFURRY STUDIOS
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-8">
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`font-display text-xl text-neutral-800 transition-all hover:scale-[1.02] hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white ${
                      active ? "font-semibold underline underline-offset-4" : ""
                    }`}
                  >
                    {item.key.charAt(0).toUpperCase() + item.key.slice(1)}
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* Burger — nav item desktop disembunyikan di layar kecil (md:flex). */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center pixel-border-sm text-neutral-900 transition-all hover:scale-105 lg:hidden"
          >
            {menuOpen ? <IconX size={18} stroke={1.75} /> : <IconMenu size={18} stroke={1.75} />}
          </button>
        </div>

        {/* Mobile dropdown — nempel di bawah navbar. */}
        {menuOpen && (
          <ul className="absolute right-0 top-full z-50 mt-2 w-48 pixel-border-sm bg-white p-2 shadow-lg lg:hidden">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-xl px-3 py-2 font-display text-xl text-neutral-800 transition-all hover:scale-[1.02] hover:bg-neutral-100 ${
                      active ? "font-semibold underline underline-offset-4" : ""
                    }`}
                  >
                    {item.key.charAt(0).toUpperCase() + item.key.slice(1)}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </header>
  );
}
