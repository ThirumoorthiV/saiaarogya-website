import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { getStaticPaths } from "./src/lib/staticPaths";
import { writeSeoFiles } from "./scripts/seo-files";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  ssgOptions: {
    entry: "src/main.tsx",
    dirStyle: "nested",
    formatting: "none",
    // Inline above-the-fold CSS and load the rest without blocking first paint
    beastiesOptions: { preload: "media", pruneSource: false, reduceInlineStyles: false, preloadFonts: false },
    // Pre-render every static and CMS-driven route (EN + /te/)
    includedRoutes: () => getStaticPaths(),
    onFinished: (dir) => writeSeoFiles(dir, getStaticPaths()),
  },
});
