/**
 * Lists every content placeholder so nothing is missed before launch:
 *  - <Todo id="…"> and data-todo="…" markers in the code
 *  - null / empty values in the CMS JSON (src/content)
 * and checks each code id is documented in docs/CONTENT_TODO.md.
 *
 *   npm run todo:scan
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = (await walk("src")).filter((f) => /\.(tsx?|json)$/.test(f));
const ids = new Map();
for (const f of files.filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"))) {
  const text = await readFile(f, "utf8");
  for (const m of text.matchAll(/(?:<Todo[^>]*\bid=|data-todo=)"([a-z0-9-]+)"/g)) {
    if (!ids.has(m[1])) ids.set(m[1], new Set());
    ids.get(m[1]).add(path.relative(".", f));
  }
}

const doc = await readFile("docs/CONTENT_TODO.md", "utf8");
console.log(`Placeholder ids used in code (${ids.size}):`);
const undocumented = [];
for (const [id, where] of [...ids].sort()) {
  const ok = doc.includes(`\`${id}\``);
  if (!ok) undocumented.push(id);
  console.log(`  ${ok ? "✓" : "✗"} ${id}  — ${[...where].join(", ")}`);
}

console.log("\nUnconfirmed values in src/content (null or empty):");
for (const f of files.filter((f) => f.includes(`${path.sep}content${path.sep}`) && f.endsWith(".json"))) {
  const json = JSON.parse(await readFile(f, "utf8"));
  const hits = [];
  const visit = (v, at) => {
    if (v === null) hits.push(at);
    else if (Array.isArray(v)) {
      if (v.length === 0) hits.push(`${at} (empty)`);
      v.forEach((x, i) => visit(x, `${at}[${i}]`));
    } else if (typeof v === "object") Object.entries(v).forEach(([k, x]) => k !== "te" && visit(x, at ? `${at}.${k}` : k));
  };
  visit(json, "");
  if (hits.length) console.log(`  ${path.basename(f)}: ${hits.length} — e.g. ${hits.slice(0, 4).join(", ")}`);
}

if (undocumented.length) {
  console.error(`\n✗ Not documented in docs/CONTENT_TODO.md: ${undocumented.join(", ")}`);
  process.exit(1);
}
console.log("\n✓ Every placeholder id is documented in docs/CONTENT_TODO.md");
