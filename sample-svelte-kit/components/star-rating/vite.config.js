import { svelte } from "@sveltejs/vite-plugin-svelte"
import { defineConfig } from "vite"

// Peranti inlines the files dist/index.html links, and the frame can't load
// anything else: one JS file, one CSS file, assets inlined as data URLs.
export default defineConfig({
  plugins: [svelte()],
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
