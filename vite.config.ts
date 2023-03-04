import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'
import replace from '@rollup/plugin-replace'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'production',
  base: '/',
  manifest: {
    name: "Luo Salasana",
    short_name: "Luo Salasana",
    icons: [
    {
      "src": "/favicon.png",
      "sizes": "64x64",
      "type": "image/png"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  orientation: "portrait",
  
  theme_color: "#ffffff",
  background_color: "#ffffff",
  display: "standalone",
  description: "Luo Suomalainen Salasana - Vahvat ja muistettavissa olevat salasanat helposti!"

  },
  devOptions: {
    enabled: process.env.VERCEL_DEV === 'true',
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
