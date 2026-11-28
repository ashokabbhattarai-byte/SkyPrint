import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 blocks cross-origin requests to dev assets (/_next/*, HMR).
  // Without this, the page loads over an ngrok tunnel but its JS returns 403,
  // so React never hydrates and scroll-driven sections (GSAP, Lenis) stay frozen.
  allowedDevOrigins: [
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "*.ngrok.app",
    "*.ngrok.io",
  ],
  // public/ files are served with max-age=0 by default, so every visit
  // re-requests all ~240 hero frames. Let browsers keep them for a week.
  async headers() {
    const cache = [
      {
        key: "Cache-Control",
        value: "public, max-age=604800, stale-while-revalidate=86400",
      },
    ];
    return [
      { source: "/sequences/:path*", headers: cache },
      { source: "/images/:path*", headers: cache },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
