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
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between bg-[url(/navbar_handrawn.png)] bg-[length:100%_100%] bg-no-repeat px-6 md:px-10 py-7">
        <Link href="/" className="flex items-center gap-2 text-neutral-900 dark:text-white">
          <SlafurryMark className="h-7 w-7" />
          <span className="hidden font-body text-xl font-bold tracking-wide sm:inline">
            SLAFURRY STUDIOS
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-8">
          <ul className="hidden items-center gap-8 md:flex mr-20">
            {NAV_ITEMS.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`font-body text-xl text-neutral-800 transition-colors hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white ${
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-900 text-neutral-900 transition-all hover:scale-105 md:hidden"
          >
            {menuOpen ? <IconX size={18} stroke={1.75} /> : <IconMenu size={18} stroke={1.75} />}
          </button>
        </div>

        {/* Mobile dropdown — nempel di bawah navbar. */}
        {menuOpen && (
          <ul className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg md:hidden">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-xl px-3 py-2 font-body text-xl text-neutral-800 transition-colors hover:bg-neutral-100 ${
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
