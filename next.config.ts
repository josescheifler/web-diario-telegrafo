import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Las fuentes de la imagen para Instagram se leen del disco: hay que incluirlas en el servidor
  outputFileTracingIncludes: {
    '/nota/\\[id\\]/instagram': ['./assets/fuentes/**/*'],
    '/nota/*/instagram': ['./assets/fuentes/**/*'],
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
