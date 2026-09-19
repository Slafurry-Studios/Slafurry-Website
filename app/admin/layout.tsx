"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconMessage,
  IconClock,
  IconMail,
  IconDeviceGamepad2,
  IconTrophy,
  IconPhone,
} from "@tabler/icons-react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: IconLayoutDashboard,
  },
  {
    label: "Posts",
    href: "/admin/posts",
    icon: IconMessage,
  },
  {
    label: "Comments",
    href: "/admin/comments",
    icon: IconClock,
  },
  {
    label: "Contacts",
    href: "/admin/contacts",
    icon: IconMail,
  },
  {
    label: "Games",
    href: "/admin/games",
    icon: IconDeviceGamepad2,
  },
  {
    label: "Press",
    href: "/admin/press",
    icon: IconMail,
  },
  {
    label: "Achievements",
    href: "/admin/achievements",
    icon: IconTrophy,
  },
  {
    label: "Montage",
    href: "/admin/montage",
    icon: IconPhone,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: IconClock,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: IconLayoutDashboard,
  },
];

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const pathname = usePathname();

  /*
   * pathname contoh:
   *
   * /en/admin
   * /en/admin/posts
   * /en/admin/comments
   *
   * Ambil locale dari segment pertama.
   */
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] || "en";

  /*
   * Buang locale:
   *
   * /en/admin/posts
   *       ↓
   * /admin/posts
   */
  const adminPath =
    "/" + segments.slice(1).join("/");

  const isActive = (href: string) => {
    // Dashboard hanya aktif tepat di /admin
    if (href === "/admin") {
      return adminPath === "/admin";
    }

    // Menu lainnya aktif di route + child route
    return (
      adminPath === href ||
      adminPath.startsWith(`${href}/`)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {/* Sidebar */}
        <nav className="sticky left-0 top-0 z-50 h-screen w-64 shrink-0 border-r border-neutral-800/50 bg-neutral-950">
          <div className="h-full p-6">
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                const href = `/${locale}${item.href}`;

                return (
                  <li key={item.label}>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                        active
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-400 hover:bg-neutral-900/50 hover:text-white"
                      }`}
                    >
                      <Icon size={16} />

                      <span className="font-medium">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Page content */}
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
