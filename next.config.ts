import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ["shiki"],
  webpack(config) {
    // Resolve 'alsa-design-system' (used in compiled dist/ files) back to source
    config.resolve.alias["alsa-design-system"] = path.resolve(__dirname, "index.ts");
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, path: false, os: false,
    };
    // Don't re-bundle when the library build output changes — it isn't part
    // of the docs app's source. Without this the dev server invalidates
    // vendor chunks every time `tsc` or `npm run build:lib` touches dist/,
    // which leads to ENOENT errors for stale chunk references.
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
    };
    return config;
  },
};

export default nextConfig;
