import react from "@vitejs/plugin-react";
import path, { resolve } from "path";
import {
  visualizer,
  type PluginVisualizerOptions,
} from "rollup-plugin-visualizer";
import type { PluginOption } from "vite";
import { VitePWA, type VitePWAOptions } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

const pwaOptions: Partial<VitePWAOptions> = {
  mode: "production",
  base: "/",
  registerType: "prompt",
  workbox: {
    // Exclude HTML from precache so middleware can handle language routing
    globIgnores: ["**/index.html", "**/en/index.html"],
    navigateFallback: null,
  },
  manifest: {
    start_url: "/",
    id: "/",
    lang: "fi",
    name: "Salasanakone | Passphrase Generator",
    short_name: "Salasanakone",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "64x64",
        type: "image/svg",
      },
      {
        src: "/favicon@512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon@192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    orientation: "portrait",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    display: "standalone",
    description:
      "Create strong passwords / Luo vahvoja salasanoja - Password generator using Finnish and English words.",
  },
  devOptions: {
    enabled: true,
    /* when using generateSW the PWA plugin will switch to classic */
    type: "module",
  },
};

const visualizerOptions: PluginVisualizerOptions = {
  template: "sunburst",
  open: true,
  gzipSize: true,
  brotliSize: true,
  filename: "bundle-analysis/analyse.html", // will be saved in project's root
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
    outDir: "dist",
    minify: "esbuild",
    assetsDir: "./src/assets",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        en: resolve(__dirname, "en/index.html"),
      },
    },
  },
  worker: {
    format: "es",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@config": path.resolve(__dirname, "./config"),
    },
  },
  plugins: [
    react(),
    VitePWA(pwaOptions),
    visualizer(visualizerOptions) as PluginOption,
  ],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  test: {
    environment: "jsdom",
  },
});
