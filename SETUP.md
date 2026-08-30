# Slafurry Studios — Website

Stack: Next.js 16 (App Router) · Prisma 6 · Supabase (Postgres + Auth + Storage) · Vercel · next-intl · Framer Motion

## Status: Step 1 (Setup) — done

Yang udah disiapin di step ini:

- ✅ Next.js + TypeScript + Tailwind v4 project
- ✅ `prisma/schema.prisma` — full schema dari technical spec (Game, Post, Comment, Press, Achievement, Contact, Analytics, Audit Log, dll)
- ✅ `prisma/seed.ts` — seed data awal (SiteSettings, 2 starter achievement, social links placeholder)
- ✅ i18n (`next-intl`) — routing `en`/`id`, `en` sebagai default
- ✅ `proxy.ts` (Next.js 16 — dulu namanya `middleware.ts`) — gabungan locale routing + Supabase session refresh + proteksi `/admin/*`
- ✅ Font Bebas Neue (heading) + Poppins (body) via `next/font/google`
- ✅ Tailwind v4 dark mode (class-based, bukan `prefers-color-scheme`) + hook `.serious` buat Serious Mode
- ✅ `lib/prisma.ts`, `lib/supabase/client.ts`, `lib/supabase/server.ts`
- ✅ Placeholder Home page (buat konfirmasi setup nyambung)

**Belum dikerjain** (nyusul di step berikutnya sesuai roadmap): komponen UI asli (Navbar, Footer, Hero montage, dst), achievement engine, admin panel, dan semua yang bergantung ke database beneran.

## Setup di lokal

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Isi environment variables** — copy `.env.example` jadi `.env`, isi dengan kredensial dari Supabase project lo:
   ```bash
   cp .env.example .env
   ```
   Ambil `DATABASE_URL`, `DIRECT_URL` dari Supabase → Project Settings → Database (mode "Transaction" buat pooled, "Session"/direct buat `DIRECT_URL`). Ambil `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` dari Project Settings → API Keys (sistem key terbaru Supabase — beda nama dari `anon`/`service_role` yang lama, tapi fungsinya sama).

3. **Generate Prisma client & push schema ke database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Seed data awal**
   ```bash
   npm run db:seed
   ```

5. **Jalanin dev server**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` — bakal auto-redirect ke `/en`.

> **Catatan**: project ini disiapkan di sandbox yang network-nya dibatasi (gak bisa akses `binaries.prisma.sh` atau `fonts.googleapis.com`), jadi `prisma generate` dan font Google belum sempat divalidasi end-to-end di sana. Keduanya seharusnya jalan normal di mesin lo yang punya akses internet biasa — kalau ternyata ada error waktu langkah 3, kabarin detail error-nya.

## Deploy ke Vercel

1. Push repo ini ke GitHub
2. Import project di Vercel, connect ke repo
3. Tambahin semua env vars dari `.env` ke Vercel Project Settings → Environment Variables
4. Deploy — build command & output udah otomatis kedetect (Next.js)
5. Setelah deploy pertama sukses, jalanin `npx prisma db push` & `npm run db:seed` sekali (bisa dari lokal, asal `.env` udah nunjuk ke database production yang sama)

## Struktur proyek

Lihat `slafurry-studios-technical-spec.md` (di luar folder ini) buat detail lengkap schema & rencana struktur folder ke depan.