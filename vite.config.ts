import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'production',
  base: '/',
  
  registerType: 'prompt',
  manifest: {
    start_url: "/",
    id: "/",
    lang: "fi",
    name: "Luo Salasana",
    short_name: "Luo Salasana",
    icons: [
    {
      "src": "/favicon.svg",
      "sizes": "64x64",
      "type": "image/svg"
    },
    {
      "src": "/favicon-512.svg",
      "sizes": "512x512",
      "type": "image/svg",
      "purpose": "any"
    },
    {
      "src": "/favicon-192.svg",
      "sizes": "192x192",
      "type": "image/svg",
      "purpose": "any"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  orientation: "portrait",
  
  // theme_color: "#ffffff",
  background_color: "#ffffff",
  display: "standalone",
  description: "Luo Suomalainen Salasana - Vahvat ja muistettavissa olevat salasanat helposti!"

  },
  devOptions: {
    enabled: true,
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html',
  },
}


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
    outDir: "dist",
    minify: "esbuild",
    assetsDir: "./src/assets"
  },
  plugins: [react(), VitePWA(pwaOptions)],

})
