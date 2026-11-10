/**
 * SEO meta check over the built site (§8, §13 #5):
 *  - every page has a <title> and meta description
 *  - titles and descriptions are unique (per language)
 *  - descriptions are 140–160 characters
 *  - exactly one <h1> in the static HTML
 *
 *   node scripts/check-meta.mjs        (run after `npm run build`)
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name === "index.html") out.push(p);
  }
  return out;
}

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const files = (await walk("dist")).filter((f) => !f.includes(`${path.sep}404${path.sep}`));
const problems = [];
const seen = { title: new Map(), desc: new Map() };
const noindexPages = [];

for (const f of files) {
  const html = await readFile(f, "utf8");
  const route = "/" + path.relative("dist", path.dirname(f)).split(path.sep).join("/");
  const lang = route.startsWith("/te") ? "te" : "en";
  const title = decode(html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? "");
  const desc = decode(html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/)?.[1] ?? "");
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  const noindex = /name="robots" content="noindex/.test(html);

  if (!title) problems.push(`${route}: missing title`);
  if (!desc) problems.push(`${route}: missing description`);
  else if (!noindex && (desc.length < 140 || desc.length > 160)) problems.push(`${route}: description is ${desc.length} chars`);
  if (h1 !== 1) problems.push(`${route}: ${h1} <h1>`);
  if (noindex) {
    noindexPages.push(route);
    continue;
  }
  for (const [k, v] of [["title", title], ["desc", desc]]) {
    const key = `${lang}|${v}`;
    if (seen[k].has(key)) problems.push(`${route}: duplicate ${k} with ${seen[k].get(key)}`);
    else seen[k].set(key, route);
  }
}

console.log(`Checked ${files.length} pages.`);
if (noindexPages.length) console.log(`${noindexPages.length} page(s) are noindex (placeholders) and were skipped for uniqueness.`);
if (problems.length) {
  console.log(problems.join("\n"));
  process.exit(1);
}
console.log("All titles/descriptions present, unique and 140–160 chars; one <h1> per page.");
