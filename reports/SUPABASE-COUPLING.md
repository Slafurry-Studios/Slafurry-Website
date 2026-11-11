# Laporan Audit Coupling Supabase

Tanggal: 2026-11-06
Cabang: `feat/fase-2b-postgres-adapter-i18n-cleanup`

## Ringkasan

Semua akses data aplikasi sudah melalui Prisma. Nol pemakaian `supabase.from(...)`
atau query data langsung lewat Supabase client. Pemakaian `@supabase/ssr` dan
`@supabase/supabase-js` terbatas pada auth (session) dan storage saja.

## Pemakaian `@supabase/ssr` dan `@supabase/supabase-js`

### Kategori: auth (session / getUser / signIn)

| Berkas | Baris | Pemakaian | Tujuan |
|--------|-------|-----------|--------|
| `proxy.ts` | 1, 10, 32 | `createServerClient` dari `@supabase/ssr`; `supabase.auth.getUser()` | Refresh sesi cookie tiap request middleware; ambil user untuk guard `/api/admin/*` dan `/admin/*` |
| `lib/supabase/server.ts` | 1, 8 | `createServerClient` dari `@supabase/ssr` | `createClient()` buat Server Components & Server Actions — baca sesi dari cookie |
| `lib/supabase/client.ts` | 1, 5 | `createBrowserClient` dari `@supabase/ssr` | Browser client buat komponen klien (halaman login admin) |
| `lib/audit.ts` | 3, 47-48 | `createClient` dari `@lib/supabase/server`; `supabase.auth.getUser()` | Ambil Supabase user ID dari sesi untuk audit log |

### Kategori: storage (service-role key)

| Berkas | Baris | Pemakaian | Tujuan |
|--------|-------|-----------|--------|
| `lib/supabase/server.ts` | 35-39 | `require("@supabase/supabase-js")` → `createClient` dengan `SUPABASE_SECRET_KEY` | `createServiceRoleClient()` — bypass RLS, buat operasi admin/storage |
| `lib/supabase/storage.ts` | 29-30 | `createServiceRoleClient()`; `supabase.storage.from(bucket).remove([path])` | `deleteStorageFile()` — hapus berkas dari Supabase Storage |
| `app/api/admin/upload/route.ts` | 47, 51-56 | `createServiceRoleClient()`; `supabase.storage.from(bucket).upload(...)` | Unggah berkas ke bucket Supabase Storage |

### Kategori: query data langsung (`.from(...)`)

Tidak ada. Semua query data lewat Prisma (`lib/queries/*`, `lib/actions/*`,
`app/api/admin/*`). Terpenuhi.

### Kategori: realtime

Tidak ada pemakaian channel/realtime Supabase.

## `prisma/schema.prisma`

- Provider: `postgresql`, `url = env("DATABASE_URL")`, `directUrl = env("DIRECT_URL")`. Sudah benar.
- Tabel: semua di schema `public`. Tidak ada schema `auth` / `storage` / non-public.
- Tidak ada `auth.users`, tidak ada `uuid_generate_v4`/ekstensi, tidak ada RLS,
  tidak ada trigger, tidak ada `auth.uid()`.
- `AdminUser.supabaseUserId` (@unique) menyimpan ID user Supabase sebagai referensi
  eksternal. Ini adalah tabel milik aplikasi, bukan tabel auth Supabase.

## Folder migrasi

Tidak ada folder `prisma/migrations`. Belum ada migrasi yang di-generate. Migrasi
baru harus dibuat via `prisma migrate dev` dan harus portabel (tanpa referensi
schema `auth`/`storage`, RLS, atau fungsi Supabase). Ekstensi `pgcrypto` jika
dibutuhkan dideklarasikan dengan `CREATE EXTENSION IF NOT EXISTS` di berkas
migrasi SQL, atau dipindahkan ke `supabase/policies.sql` di luar migrasi Prisma.

## Middleware dan alur login admin

- Middleware: `proxy.ts` (Next.js 16). Urutan: refresh sesi Supabase → guard
  `/api/admin/*` (401 JSON kalau tidak ada sesi) → lookup redirect (prisma,
  try/catch) → guard `/admin/*` (redirect ke `/admin/login?returnTo=…`) → redirect
  `/admin/login` kalau sudah login.
- Login admin: `app/admin/login/page.tsx` (`"use client"`) memakai
  `createClient()` dari `@lib/supabase/client` dan
  `supabase.auth.signInWithPassword({ email, password })`.
- `AdminUser` adalah model DB, bukan sumber otentikasi. Otentikasi sepenuhnya
  di Supabase (email/sandi).

## Temuan terkait Fase 2B

1. Nol query `supabase.from(...)`. Tidak ada komit migrasi data yang dibutuhkan —
   semua data sudah via Prisma.
2. Supabase hanya dipakai untuk auth (session) dan storage. Kedua lapisan ini
   perlu dibungkus ke dalam adapter (`lib/auth/`, `lib/storage/`) supaya provider
   dipilih lewat env (`AUTH_PROVIDER`, `STORAGE_PROVIDER`).
3. `lib/audit.ts` memanggil Supabase untuk `getSession` — harus diarahkan via
   adapter auth juga.
4. `proxy.ts` memanggil Supabase langsung — harus diarahkan via adapter auth.

## Keputusan data

Tidak ada perubahan struktur data yang dibutuhkan saat ini. `AdminUser.supabaseUserId`
dipertahankan sebagai pemetaan ke ID user Supabase saat `AUTH_PROVIDER=supabase`.
