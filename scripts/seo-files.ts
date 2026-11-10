/**
 * Runs after pre-rendering (vite-react-ssg onFinished):
 *  - writes sitemap.xml with hreflang alternates (EN + TE)
 *  - writes robots.txt
 *  - copies the rendered 404 page to /404.html (served by Netlify for unknown URLs)
 */
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { SITE_URL, toTelugu } from "../src/lib/staticPaths";
import { TELUGU_READY } from "../src/i18n/status";

export async function writeSeoFiles(dir: string, paths: string[]) {
  const en = paths.filter((p) => !p.startsWith("/te/") && p !== "/404");
  const today = new Date().toISOString().slice(0, 10);

  // Telugu URLs (and hreflang alternates) are listed only once translations exist.
  const urls = en
    .flatMap((p) => (TELUGU_READY ? [p, toTelugu(p)] : [p]))
    .map((p) => {
      if (!TELUGU_READY) {
        return `  <url>
    <loc>${SITE_URL}${p}</loc>
    <lastmod>${today}</lastmod>
  </url>`;
      }
      const enPath = p.startsWith("/te/") ? p.replace(/^\/te/, "") || "/" : p;
      const tePath = toTelugu(enPath);
      return `  <url>
    <loc>${SITE_URL}${p}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en-IN" href="${SITE_URL}${enPath}"/>
    <xhtml:link rel="alternate" hreflang="te-IN" href="${SITE_URL}${tePath}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${enPath}"/>
  </url>`;
    })
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
  await writeFile(path.join(dir, "sitemap.xml"), sitemap, "utf8");

  const robots = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`;
  await writeFile(path.join(dir, "robots.txt"), robots, "utf8");

  await copyFile(path.join(dir, "404", "index.html"), path.join(dir, "404.html"));
}
