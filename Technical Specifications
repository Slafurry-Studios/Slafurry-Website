# Slafurry Studios — Technical Spec

Stack: Next.js (App Router) · Prisma · Supabase (Postgres + Auth + Storage) · Vercel

---

## 1. Prisma Schema (Final, Konsolidasi)

```prisma
// ============================================================
// GAMES
// ============================================================

model Game {
  id             String          @id @default(cuid())
  slug           String          @unique
  title          String
  coverImage     String
  coverImageAlt  String          // alt text — wajib
  shortDesc      String
  longDesc       String
  status         GameStatus      @default(IN_DEVELOPMENT)
  featured       Boolean         @default(false) // nentuin game yang muncul di "Upcoming Project" Home
  order          Int             @default(0)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  // SEO
  metaTitle       String?
  metaDescription String?
  ogImage         String?

  playLinks      PlayLink[]
  pressKitAssets PressKitAsset[]
  montageVideos  MontageVideo[]
}

enum GameStatus {
  UPCOMING
  RELEASED
  IN_DEVELOPMENT
}

model PlayLink {
  id     String @id @default(cuid())
  label  String // "Steam", "Itch.io"
  url    String
  gameId String
  game   Game   @relation(fields: [gameId], references: [id], onDelete: Cascade)
}

// ============================================================
// HERO VIDEO MONTAGE
// ============================================================

model MontageVideo {
  id       String  @id @default(cuid())
  label    String
  videoUrl String  // Supabase Storage bucket "montage-videos"
  gameId   String?
  game     Game?   @relation(fields: [gameId], references: [id])
  order    Int     @default(0)
  isActive Boolean @default(true)
}

// ============================================================
// CONTENT (DEVLOG / NEWS)
// ============================================================

model Post {
  id          String       @id @default(cuid())
  slug        String       @unique
  title       String
  coverImage  String
  coverImageAlt String     // alt text — wajib, accessibility + SEO
  excerpt     String
  content     String       @db.Text // HTML dari Tiptap WYSIWYG
  category    PostCategory
  tags        String[]     @default([]) // ["feature", "update", "announcement"] — filter publik
  authorName  String       @default("Slafurry Studios")
  status      PostStatus   @default(DRAFT)
  publishedAt DateTime?
  autosavedAt DateTime?    // timestamp autosave terakhir, beda dari updatedAt (publish manual)
  viewCount   Int          @default(0) // buat sort "Most Popular"
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  // SEO — diisi manual, gak auto-generate dari title/excerpt
  metaTitle       String?
  metaDescription String?
  ogImage         String?

  // Draft preview — share link ke non-admin sebelum publish, tanpa perlu login
  previewToken String? @unique

  // Previous/Next manual override — kalau kosong, fallback ke urutan by publishedAt
  prevPostId String?
  nextPostId String?
  prevPost   Post?  @relation("PostSequencePrev", fields: [prevPostId], references: [id])
  nextPost   Post?  @relation("PostSequenceNext", fields: [nextPostId], references: [id])
  prevOf     Post[] @relation("PostSequencePrev")
  nextOf     Post[] @relation("PostSequenceNext")

  comments    Comment[]
}

enum PostCategory {
  DEVLOG
  NEWS
}

enum PostStatus {
  DRAFT
  PUBLISHED
}

model Comment {
  id          String        @id @default(cuid())
  postId      String
  post        Post          @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorName  String
  authorEmail String
  content     String        @db.Text
  status      CommentStatus @default(PENDING)
  ipHash      String?       // hashed IP — rate-limit & abuse trace, bukan identify individu
  createdAt   DateTime      @default(now())
}

enum CommentStatus {
  PENDING
  APPROVED
  REJECTED
}

// ============================================================
// PRESS
// ============================================================

model PressRelease {
  id          String   @id @default(cuid())
  outlet      String   // "IGN", "Gamejolt"
  title       String
  url         String
  publishedAt DateTime @default(now())
}

model PressKitAsset {
  id      String         @id @default(cuid())
  label   String         // "Slafurry Studios", "An Unfinished Game"
  type    PressAssetType
  fileUrl String
  gameId  String?
  game    Game?          @relation(fields: [gameId], references: [id])
}

enum PressAssetType {
  LOGO
  BANNER
  CHARACTER
}

// ============================================================
// CONTACT
// ============================================================

model ContactMessage {
  id        String          @id @default(cuid())
  name      String
  email     String
  category  ContactCategory @default(GENERAL)
  message   String          @db.Text
  status    ContactStatus   @default(NEW)
  ipHash    String?         // pola anti-spam sama seperti Comment
  createdAt DateTime        @default(now())
}

enum ContactCategory {
  GENERAL
  BUSINESS
  PRESS
}

enum ContactStatus {
  NEW
  READ
  REPLIED
}

// ============================================================
// ACHIEVEMENT SYSTEM (server config, client-side state)
// ============================================================

model Achievement {
  id            String             @id @default(cuid())
  key           String             @unique // "welcome", "read_5_devlogs", "cheating"
  title         String
  description   String
  hint          String?
  icon          String             @default("/mascot-default.png")
  triggerType   AchievementTrigger
  triggerConfig Json               // fleksibel per tipe trigger
  flagHash      String?            // sha256(kode) — HANYA untuk FLAG_CODE, tidak pernah dikirim ke client
  isSecret      Boolean            @default(false)
  category      String?            // "Exploration", "Story", "Secret", "Meta" — grouping di panel
  order         Int                @default(0)
  isActive      Boolean            @default(true)
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt
}

enum AchievementTrigger {
  PAGE_VISIT       // { path: "/press" }
  EVENT            // { eventName: "toggled_serious_mode" }
  VISIT_COUNT      // { count: 3 }
  SCROLL_DEPTH     // { path: "/", percent: 100 }
  TIME_ON_SITE     // { seconds: 300 }
  META_ALL         // unlock kalau semua achievement lain kebuka
  FLAG_CODE        // butuh input manual, diverifikasi server
  CHEAT_DETECTED   // tidak pernah dipanggil lewat jalur normal — hanya via integrity-check mismatch
}

// ============================================================
// SETTINGS / SOCIAL / MISC
// ============================================================

model SocialLink {
  id      String      @id @default(cuid())
  platform String     // slug simple-icons: "discord", "steam", "itchdotio", "tiktok", "mail", dll — dipakai langsung sbg icon key
  label   String      // teks tampil: "Discord Server", "Say Hello"
  url     String
  section LinkSection
  order   Int         @default(0)
}

enum LinkSection {
  COMMUNITY // Itch.io, Discord, Steam
  CONTACT   // Say Hello, Business Inquiries
  FOOTER    // social icons
}

model Redirect {
  id        String   @id @default(cuid())
  from      String   @unique // slug/path lama, e.g. "/devlog/old-slug"
  to        String             // path baru
  createdAt DateTime @default(now())
}

model SiteSettings {
  id               Int      @id @default(1) // singleton
  tagline          String
  taglineSerious   String
  aboutText        String   @db.Text
  aboutTextSerious String   @db.Text
  contactHeading        String  @default("Get in touch")
  contactHeadingSerious String  @default("Contact us")
  contactIntro          String  @db.Text
  contactIntroSerious   String  @db.Text
  foundedAt        DateTime // basis hitung "X months, X days..." (skip kalau serious mode)
  contactEmail     String
  businessEmail    String
  defaultOgImage   String   // 1200x630px — fallback OG banner utk halaman/post tanpa ogImage sendiri
}

model AdminUser {
  id             String     @id @default(cuid())
  supabaseUserId String     @unique
  name           String
  createdAt      DateTime   @default(now())
  auditLogs      AuditLog[]
}

// ============================================================
// ANALYTICS & AUDIT
// ============================================================

model PageView {
  id        String   @id @default(cuid())
  path      String
  referrer  String?
  country   String?
  device    String?  // "mobile" | "desktop"
  createdAt DateTime @default(now())

  @@index([path, createdAt])
}

model AuditLog {
  id          String    @id @default(cuid())
  adminUserId String
  adminUser   AdminUser @relation(fields: [adminUserId], references: [id])
  action      String    // "CREATE" | "UPDATE" | "DELETE"
  entityType  String    // "Achievement", "Post", "Game", dst
  entityId    String
  changes     Json      // diff before/after
  createdAt   DateTime  @default(now())
}
```

---

## 2. Struktur Kode Next.js

```
/app
  layout.tsx                    → baca cookie (theme, serious_mode) → set <html> class, no-flash
  page.tsx                      → Home
  /games
    page.tsx
    [slug]/page.tsx
  /devlog
    page.tsx
    [slug]/page.tsx             → shared UI sama /news via <ArticleRead />
  /news
    page.tsx
    [slug]/page.tsx
  /press
    page.tsx
  /contact
    page.tsx                     → shortcut cards (Say Hello/Business) + form
  /admin                        → protected via middleware.ts
    layout.tsx
    login/page.tsx
    page.tsx                    → dashboard
    games/                      → CRUD
    posts/                      → CRUD (devlog + news)
    comments/                   → moderation queue
    press/                      → releases + kit assets
    contact/                    → inbox: filter status/category, mark as replied
    achievements/               → CRUD + "hash & save" tool utk FLAG_CODE
    montage/                    → CRUD video montage
    settings/page.tsx
  /api
    achievements/
      route.ts                  → GET daftar achievement publik (title/desc "???" kalau isSecret & belum unlock)
      redeem/route.ts           → POST { code } → hash & compare server-side, rate-limited via cookie

/components
  ui/                           → Button, Card, Badge (reusable)
  layout/
    Navbar.tsx                  → termasuk gear → SettingsDropdown
    Footer.tsx
    SettingsDropdown.tsx        → Language, Light/Dark, Serious Mode toggle
  home/
    HeroMontage.tsx              → client, shuffle+play video playlist
    ProjectCarousel.tsx
  achievements/
    AchievementProvider.tsx     → context: listen route change + custom events
    AchievementToast.tsx        → popup kanan bawah (queue, auto-dismiss)
    AchievementPanel.tsx        → panel list (locked greyscale / unlocked full color)
    AchievementCTA.tsx          → floating smiley kiri bawah + badge counter
    RedeemFlagInput.tsx         → form input kode manual
    SecretKeystrokeListener.tsx → global buffer keystroke (konami-style), auto-submit ke /redeem
  admin/
    DataTable.tsx
    RichTextEditor.tsx          → Tiptap wrapper
    ImageUploader.tsx           → upload ke Supabase Storage

/lib
  prisma.ts                     → Prisma client singleton
  supabase/
    client.ts                   → browser client
    server.ts                   → server client (middleware & server actions)
  auth.ts                       → session helper
  settings/
    cookie.ts                   → read/write theme & serious_mode cookie
    SettingsContext.tsx          → client context, sync cookie ⇄ localStorage
  achievements/
    definitions.ts               → tipe TriggerConfig per AchievementTrigger
    engine.ts                    → matcher: event → cocokin ke achievement aktif
    storage.ts                   → get/set localStorage `slafurry_achievements` + hitung & verifikasi `sig`
    integrity.ts                 → generate & validasi signature (deteksi tamper → trigger "Cheating!")
    eventBus.ts                  → dispatch/listen custom events lintas komponen

middleware.ts                   → cek Supabase session, redirect /admin/* kalau belum login

/prisma
  schema.prisma
  seed.ts                       → seed Achievement bawaan, SiteSettings default, SocialLink

.env
  DATABASE_URL                  → pooled (pgbouncer)
  DIRECT_URL                    → buat `prisma migrate`
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY     → server-only
```

---

## 3. Fonts & Motion

**Fonts** — `next/font/google`, self-hosted otomatis (no runtime request, no layout shift):
```ts
// lib/fonts.ts
import { Bebas_Neue, Poppins } from "next/font/google";

export const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-heading" });
export const poppins = Poppins({ weight: ["300","400","500","600","700"], subsets: ["latin"], variable: "--font-body" });
```
`--font-heading` dipakai di semua judul (h1-h3, judul card), `--font-body` di paragraf/label/button.

**Framer Motion** — `"use client"` only, dipetain ke:
| Elemen | Animasi |
|---|---|
| Achievement toast | slide-in kanan bawah + fade, `AnimatePresence` buat queue & exit |
| Achievement panel | scale+fade buka, item list stagger |
| Achievement CTA badge | pulse/bounce pas counter nambah |
| Settings dropdown | height/opacity expand |
| Hero montage | crossfade antar video |
| Project carousel (Home) | slide antar card |
| Admin DataTable/modal | fade/scale standar |
| Achievement locked→unlocked | greyscale-to-color transition + glow |

Folder tambahan: `lib/fonts.ts`, `components/motion/FadeIn.tsx`, `components/motion/AchievementToastAnimator.tsx`.

## 4. Filter, Sort & Fleksibilitas Konten

| Halaman | Filter/sort |
|---|---|
| Games | Filter by `status` (All/Released/Upcoming/In Development) |
| Devlog & News | Filter by `tags`, search box (title/excerpt), sort by tanggal (default) atau `viewCount` (Most Popular) |
| Press Releases | Filter by `outlet` |
| Achievement panel | Filter Unlocked/Locked/Secret, grouping by `category`, sort by `order` atau tanggal unlock |

**Admin DataTable** (`components/admin/DataTable.tsx`) — reusable di semua section (Games, Posts, Comments, dll), fitur wajib:
- Search box (by title/nama)
- Filter dropdown by `status`/`category`
- Sort by column (klik header)
- Bulk action (misal select multiple comment → approve sekaligus)

**Draft preview**: `Post.previewToken` — generate random token pas admin klik "Share Preview", link publik `/devlog/[slug]?preview=[token]` bypass status DRAFT check, gak butuh login.

**Redirect handling**: middleware.ts cek tabel `Redirect` sebelum 404 — kalau slug lama ditemukan, 301 redirect ke `to`. Berguna kalau slug post/game diubah setelah link-nya sempat disebar (misal di press release IGN).

---

## 5. Analytics, Consent, Audit, Autosave, i18n, Error Pages

**Analytics (self-hosted + admin dashboard)** — client component di root layout fire-and-forget `POST /api/analytics/track` tiap page load, **hanya kalau cookie consent accepted**. Endpoint validasi `path` terhadap whitelist route valid + rate-limit by IP (cegah spam data palsu). Dashboard di `/admin/analytics` — otomatis ter-cover proteksi middleware `/admin/*` yang sama, gak butuh layer tambahan. Isi dashboard: grafik pageview harian, top 10 halaman, top referrer, breakdown device.

**Cookie consent** — banner sekali di first visit (`components/layout/CookieConsent.tsx`), pilihan Accept/Reject. Cookie functional (theme, serious mode) tetap jalan walau reject karena strictly necessary; yang di-gate cuma `PageView` tracking.

**Comment & contact form anti-spam** — honeypot field disembunyikan via CSS (bot ngisi, manusia enggak), dicek di server action; kalau keisi, data gak disimpan (tapi UI tetap tampil sukses biar bot gak tau ditolak). Plus rate-limit cookie counter (maks N attempt/10 menit). Pola yang sama dipakai untuk `Comment` maupun `ContactMessage` — satu helper function di-reuse untuk keduanya. Contact form submit juga trigger email notifikasi (via Resend) ke `contactEmail`/`businessEmail` sesuai `category` yang dipilih, sehingga admin tidak wajib buka `/admin` untuk tahu ada pesan masuk — tapi tetap tersimpan di DB sebagai source of truth dan bisa di-manage di `/admin/contact`.

**Sound effect achievement** — `public/sfx/unlock.mp3`, di-play via Audio API pas toast unlock. Toggle **Mute sound** ditaro di Settings dropdown bareng Theme & Serious Mode — disimpan di `SettingsContext` (cookie + localStorage), bukan di DB (preference visitor, bukan admin).

**Audit log** — tiap server action create/update/delete di admin CRUD manapun dibungkus satu wrapper `withAudit()`, otomatis bikin `AuditLog` entry. Ditampilkan read-only + filterable di `/admin/audit-log`.

**Draft autosave + wajib preview sebelum publish** — Tiptap `onUpdate` di-debounce ~3 detik, `PATCH` update `content` + `autosavedAt` (status tetap `DRAFT`). Tombol **Preview** generate `previewToken` kalau belum ada, buka `/devlog/[slug]?preview=[token]` di tab baru — jalur ini yang dipakai buat review sebelum `status` diubah ke `PUBLISHED`, jadi konten gak pernah "ketest" di publik.

**Language selector (i18n)** — `next-intl`, routing direstruktur jadi `app/[locale]/...`, string UI di `messages/en.json` & `messages/id.json`, dengan **`en` sebagai locale default** (audience game dev mayoritas internasional — Steam/itch.io/IGN semua berbahasa Inggris). Konten dinamis di DB (title/excerpt/content Post & Game) ditulis dalam **Bahasa Inggris sebagai base language**; `id.json` hanya nge-translate string UI (nav, button, label), bukan konten. Multi-language content bisa nyusul nanti pakai pola field ganda sama seperti `*Serious`.

**Error pages** — `app/not-found.tsx` & `app/error.tsx` custom, on-brand (mascot doodle, copy jenaka konsisten sama tone studio, otomatis netral kalau Serious Mode aktif). 404 page nyimpen satu `HTML comment` tersembunyi di source sebagai salah satu achievement `FLAG_CODE` — nyambung ke sistem achievement yang udah ada, gak nambah infra baru.

**Sitemap, robots, RSS** — `app/sitemap.ts` & `app/robots.ts` (built-in Next.js, generate otomatis dari `Post`/`Game` yang `PUBLISHED`/`isActive`). RSS di `app/devlog/rss.xml/route.ts` & `app/news/rss.xml/route.ts`, generate XML dari query Post terbaru per kategori.

**OG banner (social share preview)** — `generateMetadata()` server-side per route (wajib server-side, bukan client, karena scraper WhatsApp/Discord/Twitter baca HTML mentah tanpa render JS). Fallback chain: `Post.ogImage`/`Game.ogImage` → kalau kosong, pakai `SiteSettings.defaultOgImage`; halaman statis (Home, Games/Devlog/News list, Press, Contact) selalu pakai `defaultOgImage`. Ukuran wajib 1200×630px. `twitter:card` di-set `summary_large_image`, reuse image yang sama — gak perlu asset terpisah. Catatan: WhatsApp cache gambar OG cukup lama di sisi mereka, jadi ganti `ogImage` setelah link disebar gak langsung update di preview semua orang.

---

## 6. Responsive Design (Mobile & Tablet)

**Breakpoints** — ikut default Tailwind, konsisten sama proses desain lo yang di Figma pasti udah kebiasa angka ini:
`sm` 640px · `md` 768px (tablet portrait) · `lg` 1024px (tablet landscape / small laptop) · `xl` 1280px (desktop, sesuai desain final yang di-upload)

**Prinsip umum**: desain yang di-upload itu treated sebagai `xl` breakpoint (desktop). Semua turunan di bawahnya didesain gue sendiri ngikutin brand system yang udah ada (Bebas Neue heading, Poppins body, dark navbar, rounded pill buttons) — bukan nebak-nebak, tapi konsisten sama komponen yang udah didefinisikan.

### Per-komponen

| Komponen | Desktop (`xl`) | Tablet (`md`–`lg`) | Mobile (`<md`) |
|---|---|---|---|
| **Navbar** | Pill bar penuh, semua nav item + gear kelihatan | Sama, item mulai lebih rapat | Logo + hamburger + gear; nav item pindah ke slide-out drawer dari kanan |
| **Settings dropdown** | Dropdown kecil di bawah gear icon | Sama | Full-width bottom sheet (lebih gampang di-tap daripada dropdown kecil) |
| **Hero montage** | Video full-bleed, teks & CTA overlay kiri, upcoming project card kanan | Video tetap full-bleed, card upcoming pindah ke bawah teks (stack vertikal) | Video height dikurangi (~60vh), teks+CTA+card semua stack vertikal, video source pakai resolusi lebih kecil (`<source media>`) buat hemat data |
| **About section** | 2 kolom (mascot kiri, teks kanan) | Sama, proporsi disesuaikan | 1 kolom, mascot di atas, teks di bawah |
| **Project carousel** | 3 card kelihatan (prev/current/next), panah kiri-kanan | 1-2 card kelihatan | 1 card, swipe gesture (touch) menggantikan klik panah |
| **Games/Devlog/News grid** | Grid 3 kolom | Grid 2 kolom | 1 kolom, stack |
| **Article Read** | Konten max-width ~800px center, prev/next side-by-side | Sama | Konten full-width dengan padding, prev/next stack vertikal |
| **Press page** | 2 kolom (Releases kiri, Kit kanan) | Sama, lebih sempit | 1 kolom, Kit di bawah Releases |
| **Achievement toast** | Kanan bawah, fixed width ~360px | Sama | Full-width (dengan margin kiri-kanan 12px), tetap di bawah biar gak nutup konten atas |
| **Achievement CTA (smiley)** | Kiri bawah, fixed | Sama | Kiri bawah, ukuran tombol diperbesar dikit (min. 44×44px touch target) |
| **Achievement panel** | Modal card di atas overlay | Sama | Full-screen sheet dari bawah (bukan modal kecil di tengah — lebih natural buat mobile) |
| **Cookie consent banner** | Bar tipis di bawah layar | Sama | Sama, tapi tombol Accept/Reject full-width stack biar gampang di-tap |
| **Footer** | Icon row + brand kanan, sejajar | Sama | Stack: icon row dulu, brand di bawahnya, center-aligned |
| **Admin sidebar nav** | Sidebar tetap kiri | Collapsible (icon-only, expand on hover) | Hidden by default, hamburger buka drawer overlay |
| **Admin DataTable** | Table biasa, semua kolom kelihatan | Table dengan horizontal scroll kalau kolom kebanyakan | Table **berubah jadi card list** — tiap row jadi card kecil dengan label:value stack, biar gak perlu scroll horizontal yang nyusahin di HP |
| **Tiptap editor (admin)** | Toolbar penuh + sidebar (SEO fields, tags) di samping | Sidebar pindah ke bawah editor | Toolbar disederhanain (dropdown "more" buat opsi jarang dipakai), sidebar collapse jadi accordion |

### Catatan implementasi

- **Touch target minimum 44×44px** buat semua elemen interaktif di mobile (tombol, nav item, achievement CTA) — standar accessibility (WCAG), bukan cuma estetika.
- **Video montage di mobile**: pertimbangkan `prefers-reduced-data` / cek koneksi (`navigator.connection.effectiveType`) — kalau koneksi lambat, fallback ke poster image statis alih-alih autoplay video, biar gak makan kuota.
- **Achievement toast + CTA berpotensi tumpuk** di layar kecil kalau banyak toast queue — engine harus batasi maks 1 toast kelihatan di mobile (yang lain nunggu di queue), beda dari desktop yang bisa stack 2-3.
- Semua breakpoint di atas pakai Tailwind responsive prefix (`md:`, `lg:`, `xl:`) langsung di komponen, gak ada CSS terpisah per breakpoint — konsisten sama pendekatan utility-first yang udah dipakai di seluruh project.

---

## 7. Catatan Implementasi Kritis

- **Flag hash** (`Achievement.flagHash`) hanya pernah dibaca di server (`/api/achievements/redeem`) — tidak pernah include di response API publik.
- **`CHEAT_DETECTED`** tidak punya jalur unlock resmi di `engine.ts` — hanya dipicu dari `integrity.ts` saat signature localStorage tidak cocok (tamper manual / debug hook).
- **No-flash theme**: `app/layout.tsx` (server component) wajib baca cookie dan set class `<html>` sebelum render pertama, sebelum `SettingsContext` client hydrate.
- **Serious Mode**: field `*Serious` di `SiteSettings` dipilih di level komponen berdasarkan `useSettings().seriousMode`; achievement engine (`AchievementProvider`) skip total render (toast/CTA/panel) saat serious mode aktif.
- **Comment moderasi**: publik hanya lihat `status: APPROVED`; approve/reject dari `/admin/comments`.

---

## 8. Urutan Build (Roadmap)

1. Setup — Next.js + Supabase + Prisma + deploy skeleton ke Vercel, struktur `app/[locale]/...` (next-intl) dari awal biar gak refactor routing belakangan
2. Public pages statis (dummy data) — semua page + Navbar/Footer + SettingsDropdown (theme, serious mode, mute sound, language), font Bebas Neue/Poppins, custom 404/500 pages — **dibangun responsive dari awal (mobile/tablet/desktop sekaligus), bukan desktop dulu baru disesuaikan belakangan**
3. Hero video montage (shuffle playlist + crossfade via Framer Motion)
4. Hook ke database — dummy → Prisma queries, filter/sort publik (tags, status, search), alt text wajib di semua image field
5. Settings system — cookie/localStorage sync, theme, Serious Mode + copy switching
6. Cookie consent banner — gate sebelum analytics tracking aktif
7. Achievement engine — provider, event bus, localStorage + signature, toast + SFX, CTA, panel (grouped by category), redeem flow, cheat detection, 404-page easter egg
8. Admin auth (Supabase Auth) + middleware + Redirect handling
9. Admin CRUD — Games (featured, SEO, alt text), Posts (tags, SEO, autosave, preview token, prev/next), Press, Achievements, Montage, Settings, Social Links (icon picker)
10. Admin DataTable — search, filter, sort, bulk action (dipasang bareng tiap CRUD di step 9)
11. Audit log — wrapper `withAudit()` dipasang di semua server action step 9
12. Comment system — submit form + honeypot + rate-limit + moderation queue
13. Analytics — tracking endpoint + dashboard `/admin/analytics`
14. Sitemap, robots.txt, RSS feed
15. i18n — translate string UI ke `messages/en.json` & `id.json`
16. Polish — SEO metadata final check, OG image, responsive, loading states
