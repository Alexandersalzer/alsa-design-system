import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  distDir: ".next-docs",
  serverExternalPackages: ["shiki"],
  webpack(config) {
    // Resolve 'alsa-design-system' (used in compiled dist/ files) back to source
    config.resolve.alias["alsa-design-system"] = path.resolve(__dirname, "index.ts");
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, path: false, os: false,
    };
    return config;
  },
};

export default nextConfig;
