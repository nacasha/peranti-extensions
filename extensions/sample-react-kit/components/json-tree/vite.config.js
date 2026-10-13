import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// Peranti inlines the files dist/index.html links, and the frame can't load
// anything else: one JS file, one CSS file, assets inlined as data URLs.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: "assets/index.js",
        assetFileNames: "assets/[name][extname]"
      }
    }
  }
})
