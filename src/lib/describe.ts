/**
 * Builds a meta description of 140–160 characters (§8) from sentences.
 * Sentences are added in order while they fit; filler sentences pad short
 * descriptions; an over-long first sentence is cut at a word boundary.
 */
const FILLERS = [
  "All care is completely free of charge.",
  "Sai Aarogya Hospital, Bapatla, Andhra Pradesh.",
  "Call us before you visit.",
  "Free for everyone.",
  "Bapatla District.",
];

export function fitDescription(sentences: string[], min = 140, max = 160): string {
  let out = "";
  for (const s of [...sentences, ...FILLERS]) {
    const next = out ? `${out} ${s}` : s;
    if (next.length <= max) out = next;
    if (out.length >= min) return out;
  }
  if (out.length >= min) return out;
  // Still short (or first sentence too long): cut the joined text to max at a word boundary.
  const joined = [...sentences, ...FILLERS].join(" ");
  const cut = joined.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—–-]+$/, "")}…`;
}
