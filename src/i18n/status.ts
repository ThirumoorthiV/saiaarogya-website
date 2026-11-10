import te from "./te.json";

/**
 * Telugu goes "live" for search engines automatically once te.json contains
 * translations. Until then /te/ pages still work for visitors, but they are
 * noindex, canonical to the English page, declare lang="en" (the content is
 * English), and are left out of hreflang and the sitemap — so Google never
 * sees English text labelled as Telugu or duplicate pages.
 */
export const TELUGU_READY = Object.keys(te as Record<string, unknown>).length > 0;
