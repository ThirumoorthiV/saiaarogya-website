/**
 * Telugu translation progress: how many UI strings in src/i18n/en.json have a
 * Telugu value in te.json, and how many content fields have a `te` value.
 *
 *   npm run i18n:status
 */
import { readFile, readdir } from "node:fs/promises";

const flat = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) => (v && typeof v === "object" ? flat(v, `${prefix}${k}.`) : [`${prefix}${k}`]));

const en = flat(JSON.parse(await readFile("src/i18n/en.json", "utf8")));
const te = new Set(flat(JSON.parse(await readFile("src/i18n/te.json", "utf8"))));
const done = en.filter((k) => te.has(k));
console.log(`UI strings: ${done.length}/${en.length} translated (${Math.round((done.length / en.length) * 100)}%)`);

let fields = 0;
let translated = 0;
const walk = (v) => {
  if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === "object") {
    if ("en" in v && "te" in v) {
      fields++;
      if (v.te) translated++;
    } else Object.values(v).forEach(walk);
  }
};
for (const f of await readdir("src/content")) {
  if (f.endsWith(".json")) walk(JSON.parse(await readFile(`src/content/${f}`, "utf8")));
}
console.log(`Content fields: ${translated}/${fields} have Telugu text`);
console.log(te.size ? "Telugu is LIVE for search engines (te.json not empty)." : "Telugu not live yet: /te/ pages are noindex until te.json has translations.");
