import react from "@vitejs/plugin-react"
import { URL, fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa"

const pwaOptions: Partial<VitePWAOptions> = {
  mode: "production",
  base: "/",

  registerType: "prompt",
  manifest: {
    start_url: "/",
    id: "/",
    lang: "fi",
    name: "Salasanakone | Luo Salasana",
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
    background_color: "#ffffff",
    display: "standalone",
    description:
      "Salasanakone - Luo vahva, muistettava ja hyvä salasana tällä salasanageneraattorilla helposti, nopeasti ja automaattisesti käyttämällä Suomen kielen sanoja.",
  },
  devOptions: {
    enabled: true,
    /* when using generateSW the PWA plugin will switch to classic */
    type: "module",
    navigateFallback: "index.html",
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
    outDir: "dist",
    minify: "esbuild",
    assetsDir: "./src/assets",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
  plugins: [react(), VitePWA(pwaOptions)],
})
