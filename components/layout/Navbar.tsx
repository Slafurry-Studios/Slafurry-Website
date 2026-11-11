"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

const itemVariants: any = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 22, stiffness: 300 },
  },
};

const menuVariants: any = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeOut" },
  },
};

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <nav className="relative mx-auto flex max-w-4xl items-center justify-between pixel-frame-filled px-3 md:px-4 py-0.5">
        <Link href="/" className="flex items-center gap-2 px-2 text-neutral-900 dark:text-white press-btn">
          <SlafurryMark className="h-7 w-7 press-btn" />
          <span className="whitespace-nowrap font-display text-base font-bold tracking-wide sm:text-xl press-btn">
            SLAFURRY STUDIOS
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-8">
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`font-display text-xl text-neutral-800 press-btn hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white ${
                      active ? "font-semibold underline underline-offset-4" : ""
                    }`}
                  >
                    {item.key.charAt(0).toUpperCase() + item.key.slice(1)}
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center pixel-border-sm text-neutral-900 hover:scale-105 lg:hidden press-btn"
          >
            {menuOpen ? (
              <motion.div
                initial={false}
                animate={menuOpen ? "open" : "closed"}
                variants={{
                  closed: { rotate: 0 },
                  open: { rotate: 90 },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <IconX size={18} stroke={1.75} />
              </motion.div>
            ) : (
              <IconMenu size={18} stroke={1.75} />
            )}
          </button>

          <AnimatePresence mode="wait">
            {menuOpen && (
              <motion.ul
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={menuVariants}
                className="absolute right-0 top-full z-50 mt-2 w-48 pixel-border-sm bg-white p-2 shadow-lg lg:hidden"
              >
                {NAV_ITEMS.map((item, index) => {
                  const active =
                    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial="hidden"
                      animate="visible"
                      variants={itemVariants}
                      transition={{ delay: index * 0.06 }}
                      className={`block rounded-xl px-3 py-2 font-display text-xl text-neutral-800 hover:bg-neutral-100 ${
                        active ? "font-semibold underline underline-offset-4" : ""
                      }`}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block font-display text-xl text-neutral-800 hover:bg-neutral-100"
                      >
                        {item.key.charAt(0).toUpperCase() + item.key.slice(1)}
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}
