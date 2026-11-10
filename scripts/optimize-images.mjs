/**
 * Converts original images (downloaded from the current Wix site) into
 * web-ready WebP files in public/images.
 *
 * Usage: node scripts/optimize-images.mjs <source-dir>
 * Source originals are NOT committed (too large). Keep them in a local folder.
 */
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/optimize-images.mjs <source-dir>");
  process.exit(1);
}
const out = path.resolve("public/images");

/** [source file, output name, width, optional extra] */
const photos = [
  ["hospital-beds.jpg", "hospital-ward", 1600],
  ["hospital-beds.jpg", "hospital-ward-sm", 800],
  ["shared-1.jpg", "consultation", 1040],
  ["shared-1.jpg", "consultation-sm", 640],
  ["hospital.jpg", "opd-waiting-area", 1280],
  ["shared-2.jpg", "dental-consultation", 1040],
  ["shared-3.jpg", "patient-care", 1040],
  ["whatsapp-2024-12-16.jpg", "medical-equipment", 1200],
  ["getty-b.png", "trust-activities", 1200],
  ["evo.png", "sri-sathya-sai-baba", 640],
  ["madhusudan-sai.avif", "sri-madhusudan-sai", 640],
];

const people = [
  "r-venkateswara-rao.png",
  "r-kondala-rao.png",
  "veeramachaneni-sivaprasad.png",
  "kalyan-chakravarthy-konduri.png",
  "g-dharma-data.png",
  "hari-umakanta-rao.png",
  "k-v-rambabu.jpg",
  "dr-narsaraju.png",
  "dvn-raju.png",
  "nagaraju-penumetsa.png",
  "karuna-raju-manthena.png",
  "r-lakshmipathi.png",
];

async function report(file) {
  const { size } = await stat(file);
  console.log(`${path.relative(process.cwd(), file)}  ${(size / 1024).toFixed(0)} KB`);
}

await mkdir(path.join(out, "people"), { recursive: true });

for (const [file, name, width] of photos) {
  const dest = path.join(out, `${name}.webp`);
  await sharp(path.join(src, file))
    .resize({ width, withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .webp({ quality: 72 })
    .toFile(dest);
  await report(dest);
}

for (const file of people) {
  const dest = path.join(out, "people", file.replace(/\.(png|jpg)$/, ".webp"));
  await sharp(path.join(src, file))
    .resize(320, 320, { fit: "cover" })
    .flatten({ background: "#ffffff" })
    .webp({ quality: 75 })
    .toFile(dest);
  await report(dest);
}

// Logo mark: the original logo has white wordmark text (only visible on dark
// backgrounds), so we crop just the symbol and set the name in HTML text.
const logo = path.join(src, "logo.png");
await sharp(logo).extract({ left: 150, top: 0, width: 348, height: 345 }).png().toFile(path.join(out, "logo-mark.png"));
await sharp(logo).extract({ left: 150, top: 0, width: 348, height: 345 }).resize(96).webp({ quality: 90 }).toFile(path.join(out, "logo-mark.webp"));
await sharp(logo).webp({ quality: 90 }).toFile(path.join(out, "logo-full-on-dark.webp"));
await report(path.join(out, "logo-mark.webp"));

// Favicons
await sharp(logo).extract({ left: 150, top: 0, width: 348, height: 345 }).resize(32, 32, { fit: "contain", background: "#ffffff00" }).png().toFile("public/favicon-32.png");
await sharp(logo).extract({ left: 150, top: 0, width: 348, height: 345 }).resize(180, 180, { fit: "contain", background: "#ffffff" }).png().toFile("public/apple-touch-icon.png");

// Trust logo
await sharp(path.join(src, "logo-schema.png")).resize(360).webp({ quality: 90 }).toFile(path.join(out, "sujala-sravanthi-trust-logo.webp"));

// Open Graph share image 1200x630 (JPEG for WhatsApp compatibility)
await sharp(path.join(src, "hospital-beds.jpg")).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 78 }).toFile(path.join(out, "og-default.jpg"));
await report(path.join(out, "og-default.jpg"));
