import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // "en" default karena audience utama adalah komunitas game dev internasional
  // (Steam, itch.io, IGN — semua berbahasa Inggris). Konten dinamis (Post/Game)
  // di database juga ditulis dalam Bahasa Inggris; "id" di sini hanya
  // nge-translate string UI (nav, button, label), bukan konten.
  locales: ["en", "id"],
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];
