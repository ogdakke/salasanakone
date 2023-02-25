import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
    outDir: "dist",
    minify: "esbuild",
    assetsDir: "./src/assets"
  },
  plugins: [react()],

})
