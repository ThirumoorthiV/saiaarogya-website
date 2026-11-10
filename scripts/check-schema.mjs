/**
 * Structured-data check over dist/ (§8, §13 #6). Parses every JSON-LD block
 * and checks required/recommended properties for Hospital, Physician,
 * FAQPage, BreadcrumbList, MedicalClinic and ItemList. Also confirms local
 * image URLs referenced by the schema exist in dist/.
 *
 * This is a local pre-check; after deploying, confirm with Google's
 * Rich Results Test (https://search.google.com/test/rich-results).
 *
 *   node scripts/check-schema.mjs
 */
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const SITE = "https://www.saiaarogya.hospital";

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name === "index.html") out.push(p);
  }
  return out;
}

const REQUIRED = {
  Hospital: ["name", "url", "telephone", "address", "medicalSpecialty", "image"],
  Physician: ["name", "url", "medicalSpecialty", "address", "hospitalAffiliation"],
  FAQPage: ["mainEntity"],
  BreadcrumbList: ["itemListElement"],
  MedicalClinic: ["name", "url", "parentOrganization"],
  ItemList: ["itemListElement"],
  AboutPage: ["url"],
  Article: ["headline", "datePublished"],
};

const problems = [];
const counts = {};
const files = (await walk("dist")).filter((f) => !f.includes(`${path.sep}admin${path.sep}`));

for (const f of files) {
  const route = "/" + path.relative("dist", path.dirname(f)).split(path.sep).join("/");
  const html = await readFile(f, "utf8");
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  for (const raw of blocks) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      problems.push(`${route}: invalid JSON-LD (${e.message})`);
      continue;
    }
    const type = data["@type"];
    counts[type] = (counts[type] ?? 0) + 1;
    if (data["@context"] !== "https://schema.org") problems.push(`${route}: ${type} missing @context`);
    for (const k of REQUIRED[type] ?? []) {
      const v = data[k];
      if (v === undefined || v === null || (Array.isArray(v) && v.length === 0)) problems.push(`${route}: ${type} missing "${k}"`);
    }
    if (type === "Hospital" || type === "Physician") {
      const a = data.address ?? {};
      for (const k of ["streetAddress", "addressLocality", "addressRegion", "postalCode", "addressCountry"]) {
        if (!a[k]) problems.push(`${route}: ${type}.address missing ${k}`);
      }
    }
    if (type === "FAQPage") {
      for (const q of data.mainEntity ?? []) {
        if (q["@type"] !== "Question" || !q.name || !q.acceptedAnswer?.text) problems.push(`${route}: FAQPage has an incomplete question`);
      }
    }
    if (type === "BreadcrumbList") {
      (data.itemListElement ?? []).forEach((it, i) => {
        if (it.position !== i + 1 || !it.name || !String(it.item).startsWith(SITE)) problems.push(`${route}: BreadcrumbList item ${i + 1} invalid`);
      });
    }
    for (const key of ["image", "logo"]) {
      const url = data[key];
      if (typeof url === "string" && url.startsWith(SITE)) {
        try {
          await access(path.join("dist", url.slice(SITE.length)));
        } catch {
          problems.push(`${route}: ${type}.${key} points to a missing file ${url}`);
        }
      }
    }
  }
}

console.log(`JSON-LD blocks found: ${Object.entries(counts).map(([k, v]) => `${k} ×${v}`).join(", ")}`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n${[...new Set(problems)].join("\n")}`);
  process.exit(1);
}
console.log("All structured data parses and has the required properties.");
