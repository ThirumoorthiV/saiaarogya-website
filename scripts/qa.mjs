/* global document, window */
/**
 * Automated QA over the built site (dist/), using the locally installed Chrome.
 *
 *   node scripts/qa.mjs [--shots <dir>] [--paths /,/about/]
 *
 * For every page at 360, 768 and 1440 px it checks:
 *  - no horizontal overflow (§13 #9)
 *  - exactly one <h1>, a <title> and a meta description (§13 #5)
 *  - every <img> has an alt attribute (§13 #5)
 *  - no console errors / hydration errors
 * Optional screenshots are written to --shots.
 */
import http from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import handler from "serve-handler";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const argVal = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const shotsDir = argVal("--shots");
const only = argVal("--paths")?.split(",");

const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const WIDTHS = [360, 768, 1440];

const sitemap = await readFile("dist/sitemap.xml", "utf8");
const allPaths = [...sitemap.matchAll(/<loc>https:\/\/www\.saiaarogya\.hospital([^<]*)<\/loc>/g)].map((m) => m[1]);
const paths = only ?? allPaths;

const server = http.createServer((req, res) => handler(req, res, { public: "dist", trailingSlash: true }));
await new Promise((r) => server.listen(4319, r));
const base = "http://localhost:4319";

const browser = await chromium.launch({ executablePath: CHROME });
if (shotsDir) await mkdir(shotsDir, { recursive: true });

const problems = [];
for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  let consoleErrors = [];
  page.on("console", (msg) => msg.type() === "error" && consoleErrors.push(msg.text()));
  page.on("pageerror", (err) => consoleErrors.push(err.message));
  page.on("response", (res) => {
    if (res.url().startsWith("http://localhost") && res.status() >= 400) consoleErrors.push(`HTTP ${res.status()} ${res.url()}`);
  });
  // Block third-party requests (fonts, maps) so QA is deterministic and offline-safe.
  await page.route(/^(?!http:\/\/localhost)/, (route) => route.abort());

  for (const p of paths) {
    consoleErrors = [];
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      h1: document.querySelectorAll("h1").length,
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
      noAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).map((i) => i.src),
      wide: [...document.querySelectorAll("body *")]
        .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
        .slice(0, 3)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`),
    }));
    const errs = consoleErrors.filter((e) => !/ERR_FAILED|net::|Failed to load resource/.test(e));
    const issues = [];
    if (r.overflow > 0) issues.push(`horizontal overflow ${r.overflow}px (${r.wide.join(" | ")})`);
    if (r.h1 !== 1) issues.push(`${r.h1} <h1> elements`);
    if (!r.title) issues.push("missing <title>");
    if (!r.desc) issues.push("missing meta description");
    if (r.noAlt.length) issues.push(`img without alt: ${r.noAlt.join(", ")}`);
    if (errs.length) issues.push(`console errors: ${errs.slice(0, 2).join(" || ")}`);
    if (issues.length) problems.push(`[${width}px] ${p}: ${issues.join("; ")}`);
    if (shotsDir) {
      const name = `${width}${p.replace(/\//g, "_") || "_"}.png`;
      await page.screenshot({ path: path.join(shotsDir, name), fullPage: true });
    }
  }
  await context.close();
}

await browser.close();
server.close();

console.log(`Checked ${paths.length} pages × ${WIDTHS.length} widths.`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n` + problems.join("\n"));
  process.exit(1);
}
console.log("No problems found.");
