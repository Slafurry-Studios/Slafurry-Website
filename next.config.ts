import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
    serverActions: {
      allowedOrigins: [
        "slafurrystudios.com",
        "www.slafurrystudios.com",
        "localhost:3000",
      ],
    },
  },
  images: {
    // Adjust this hostname if your Supabase project ref exists,
    // for "coverImage"/"ogImage" served from Supabase Storage.
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
