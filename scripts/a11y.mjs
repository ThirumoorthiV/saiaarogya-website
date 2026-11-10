/* global document, window */
/**
 * Accessibility audit (§8, §13 #7) over the built site with axe-core
 * (the engine behind Lighthouse's accessibility score), WCAG 2.1 A + AA rules,
 * at 360 px and 1440 px. Also runs a keyboard check: the first Tab lands
 * on the skip link and Enter moves focus to <main>.
 *
 *   node scripts/a11y.mjs [--paths /,/contact/]
 */
import http from "node:http";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import handler from "serve-handler";
import { chromium } from "playwright-core";

const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve("axe-core/axe.min.js"), "utf8");
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const args = process.argv.slice(2);
const i = args.indexOf("--paths");
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const paths = i >= 0 ? args[i + 1].split(",") : [...sitemap.matchAll(/<loc>https:\/\/www\.saiaarogya\.hospital([^<]*)<\/loc>/g)].map((m) => m[1]);

const server = http.createServer((req, res) => handler(req, res, { public: "dist", trailingSlash: true }));
await new Promise((r) => server.listen(4370, r));
const browser = await chromium.launch({ executablePath: CHROME });
const problems = [];

for (const width of [360, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
  for (const p of paths) {
    await page.goto(`http://localhost:4370${p}`, { waitUntil: "networkidle" });
    await page.addScriptTag({ content: axeSource });
    const result = await page.evaluate(async () =>
      // eslint-disable-next-line no-undef
      axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] }, resultTypes: ["violations"] }),
    );
    for (const v of result.violations) {
      problems.push(`[${width}px] ${p}: ${v.id} (${v.impact}) ×${v.nodes.length} — ${v.nodes[0]?.target.join(" ")}`);
    }
  }
  await page.close();
}

// Keyboard: skip link
const kb = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await kb.goto("http://localhost:4370/", { waitUntil: "networkidle" });
await kb.keyboard.press("Tab");
const first = await kb.evaluate(() => document.activeElement?.getAttribute("href"));
await kb.keyboard.press("Enter");
await kb.waitForTimeout(200);
const afterSkip = await kb.evaluate(() => document.activeElement?.id || window.location.hash);
if (first !== "#main") problems.push(`keyboard: first Tab focuses ${first}, expected the skip link`);
if (!["main", "#main"].includes(afterSkip)) problems.push(`keyboard: skip link moved focus to ${afterSkip}`);

await browser.close();
server.close();
console.log(`axe-core WCAG 2.1 A/AA: ${paths.length} pages × 2 widths. Keyboard skip-link check: ${first === "#main" ? "ok" : "failed"}.`);
if (problems.length) {
  console.log(`${problems.length} problem(s):\n${problems.join("\n")}`);
  process.exit(1);
}
console.log("No accessibility violations found.");
