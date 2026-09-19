"use client";

import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "Layout" },
  { label: "Posts", href: "/admin/posts", icon: "Message" },
  { label: "Comments", href: "/admin/comments", icon: "Clock" },
  { label: "Contacts", href: "/admin/contacts", icon: "Mail" },
  { label: "Games", href: "/admin/games", icon: "DeviceGamepad" },
  { label: "Press", href: "/admin/press", icon: "Mail" },
  { label: "Achievements", href: "/admin/achievements", icon: "Trophy" },
  { label: "Montage", href: "/admin/montage", icon: "Phone" },
  { label: "Settings", href: "/admin/settings", icon: "Clock" },
  { label: "Analytics", href: "/admin/analytics", icon: "Layout" },
];

type IconMap = {
  [k in NavItem["icon"]]: string;
};

const iconSvgMap: IconMap = {
  Layout: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x3="3" y3="9" x2="21" y2="9"></line><line x3="3" y3="15" x2="21" y2="15"></line></svg>`,
  Message: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h18"></path><path d="M3 8h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><path d="M17 21v2a2 2 0 0 1-2 2h-4.5"></path></svg>`,
  Clock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  Mail: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2-3a2 2 0 0 1 2 2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4"></path><path d="M16 22l4.586-4.586a2 2 0 0 1 2.828 2.828l1.828 1.828a2 2 0 0 1-2.828 2.828L15 22"></path></svg>`,
  DeviceGamepad: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 1.73l7 4a2 2 0 0 0 2-1.73z"></path><polyline points="3 6 5 6 21 6"></path><line x1="3" y1="6" x2="21" y2="6"></path><line x1="3" y1="12" x2="21" y1="12"></path><line x1="3" y1="18" x2="21" y1="18"></path></svg>`,
  Trophy: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5"></path><path d="M2 7l10 5"></path></svg>`,
  Phone: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4 4v6a2 2 0 0 1-2 2 19.79 19.79 0 0 1-8.63 3.07 19.5 19.5 0 0 1-6-6 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6"></svg>`,
};

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === pathname ||
    (href === "/" && pathname === "/") ||
    (href.startsWith("/admin") && pathname.startsWith("/admin"));

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-neutral-950 border-r border-neutral-800/50 sticky top-0 z-50">
      <div className="h-full p-6">
        <ul className="space-y-2 text-sm">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const iconSvg = iconSvgMap[item.icon];
            return (
              <li
                key={item.label}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-900/50 dark:hover:bg-neutral-800/50"
                style={{ color: active ? "white" : "" }}
              >
                <div dangerouslySetInnerHTML={{ __html: iconSvg }} />
                <span className="font-medium">{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}