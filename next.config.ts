import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
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
