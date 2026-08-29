import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    // Dibutuhkan karena root layout kita pakai top-level dynamic segment
    // (app/[locale]/layout.tsx) — persis kasus yang didokumentasikan
    // Next.js butuh global-not-found.tsx, bukan cuma app/not-found.tsx biasa.
    globalNotFound: true,
  },
  images: {
    // Sesuaikan hostname ini kalau project ref Supabase udah ada,
    // buat "coverImage"/"ogImage" yang di-serve dari Supabase Storage.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
