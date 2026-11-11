# Panduan Database Lokal (Fase 2B)

Proyek ini bisa dijalankan sepenuhnya pada PostgreSQL lokal (Docker) tanpa akun
Supabase. Prisma adalah satu-satunya jalur akses data. Semua koneksi diatur
melalui variabel lingkungan; tidak ada URL/host yang di-hardcode.

## Memulai di lokal

1. Salin contoh env dan isi nilai lokal (sudah siap pakai):

   ```bash
   cp .env.example .env.local
   ```

   Pastikan `AUTH_PROVIDER=local` dan `STORAGE_PROVIDER=local` untuk pengembangan lokal.

2. Nyalakan PostgreSQL lewat Docker:

   ```bash
   npm run db:up
   ```

   Service `postgres` berjalan di port 5432, database `slafurry`, serta database
   terpisah `slafurry_test` untuk tes.

3. Jalankan migrasi dan seed:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Jalankan dev server:

   ```bash
   npm run dev
   ```

   Buka `http://localhost:3000`. Login admin lokal:
   email `admin@slafurrystudios.local`, sandi `admin`.

## Skrip database

| Skrip | Keterangan |
|-------|------------|
| `db:up` | Nyalakan container PostgreSQL (docker compose up -d --wait). |
| `db:down` | Matikan dan hapus container PostgreSQL. |
| `db:migrate` | Jalankan `prisma migrate dev` terhadap database lokal. |
| `db:reset` | `prisma migrate reset --force` lalu seed ulang database lokal. |
| `db:seed` | Menanamkan data awal idempotent (`prisma/seed.ts`). |
| `db:studio` | Buka Prisma Studio. |
| `test:db` | Jalankan unit test dengan variabel `DATABASE_URL` menunjuk ke `slafurry_test`. |

## Kembali ke Supabase

Pindah kembali ke Supabase cukup dengan mengganti variabel lingkungan, tanpa
mengubah kode aplikasi:

1. Set `DATABASE_URL` dan `DIRECT_URL` ke database Supabase (pooled untuk
   `DATABASE_URL` dengan `?pgbouncer=true`, langsung port 5432 untuk
   `DIRECT_URL`).
2. Set `AUTH_PROVIDER=supabase` dan `STORAGE_PROVIDER=supabase`.
3. Isi kunci Supabase: `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`.
4. Jalankan migrasi produksi:

   ```bash
   npx prisma migrate deploy
   ```

   Gunakan `migrate deploy`, **bukan** `migrate reset` atau `db push`.
5. Terapkan `supabase/policies.sql` (RLS) bila ada, di luar folder migrasi Prisma.
6. Verifikasi login admin melalui Supabase email/sandi.

## Peringatan (wajib dibaca)

- JANGAN menjalankan `prisma migrate reset` atau `prisma db push` terhadap
  database Supabase produksi. Ini akan menghapus data.
- JANGAN memakai `pg_dump` untuk membuang skema `auth` atau `storage` Supabase;
  keduanya bukan bagian dari skema aplikasi Prisma.
- Jika perlu memindahkan data, buat dump **data-only** dari tabel schema
  `public` saja, bukan skema auth/storage.
- `AUTH_PROVIDER=local` ditolak saat `NODE_ENV=production` atau `VERCEL`
  di-set (local auth provider hanya untuk pengembangan dan tes).

## Struktur skema

Semua tabel berada di schema `public`: `Game`, `PlayLink`, `MontageVideo`,
`Post`, `Comment`, `PressRelease`, `PressKitAsset`, `ContactMessage`,
`Achievement`, `SocialLink`, `Redirect`, `SiteSettings`, `AdminUser`,
`PageView`, `AuditLog`. Tidak ada referensi ke schema `auth`/`storage`, RLS,
trigger, atau fungsi khusus Supabase di migrasi Prisma.
