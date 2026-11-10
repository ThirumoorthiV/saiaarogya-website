/**
 * Runs after pre-rendering (vite-react-ssg onFinished):
 *  - writes sitemap.xml
 *  - writes robots.txt
 *  - copies the rendered 404 page to /404.html (served by Vercel for unknown URLs)
 */
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { SITE_URL } from "../src/lib/staticPaths";

export async function writeSeoFiles(dir: string, paths: string[]) {
  const pages = paths.filter((p) => p !== "/404");
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map((p) => `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
    .join("\n");

  await writeFile(
    path.join(dir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    "utf8",
  );
  await writeFile(path.join(dir, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`, "utf8");
  await copyFile(path.join(dir, "404", "index.html"), path.join(dir, "404.html"));
}
