import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  experimental: {
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

export default nextConfig;
