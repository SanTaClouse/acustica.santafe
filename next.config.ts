import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Con Cache Components, `new Date()` en el render rompe el prerender:
  // el año del footer se fija en el build.
  env: {
    BUILD_YEAR: String(new Date().getFullYear()),
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
