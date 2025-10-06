import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "htwnocisxgarrpzxravc.supabase.co" },
    ],
  },
};

export default nextConfig;
