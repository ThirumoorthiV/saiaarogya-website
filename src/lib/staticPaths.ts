/**
 * Single list of every pre-rendered route (requirements §4.4).
 * Used by vite-react-ssg (includedRoutes) and to generate sitemap.xml.
 * Kept free of React imports so vite.config.ts can import it.
 */
import departmentsJson from "../content/departments.json";
import doctorsJson from "../content/doctors.json";
import storiesJson from "../content/stories.json";
import policiesJson from "../content/policies.json";

export const SITE_URL = "https://www.saiaarogya.hospital";

/** Static (non-CMS) pages, English paths, with trailing slash. */
export const STATIC_PAGES = [
  "/",
  "/about/",
  "/about/history/",
  "/about/governance/",
  "/departments/",
  "/doctors/",
  "/patient-guide/",
  "/patient-guide/opd-timings/",
  "/patient-guide/how-to-reach/",
  "/patient-guide/registration/",
  "/patient-guide/facilities/",
  "/patient-guide/faqs/",
  "/impact/",
  "/impact/stories/",
  "/impact/camps/",
  "/impact/gallery/",
  "/support-us/",
  "/support-us/donate/",
  "/support-us/international-donors/",
  "/support-us/volunteer/",
  "/support-us/transparency/",
  "/contact/",
] as const;

/** All English paths including CMS-driven detail pages. */
export function getEnglishPaths(): string[] {
  const active = <T extends { isActive?: boolean }>(x: T) => x.isActive !== false;
  return [
    ...STATIC_PAGES,
    ...departmentsJson.items.filter(active).map((d) => `/departments/${d.slug}/`),
    ...doctorsJson.items.filter(active).map((d) => `/doctors/${d.slug}/`),
    ...(storiesJson.items as { slug: string }[]).map((s) => `/impact/stories/${s.slug}/`),
    ...policiesJson.items.map((p) => `/policies/${p.slug}/`),
  ];
}

/** Telugu mirror of an English path. */
export const toTelugu = (p: string) => (p === "/" ? "/te/" : `/te${p}`);

/** Every route to pre-render (EN + TE + 404 page). */
export function getStaticPaths(): string[] {
  const en = getEnglishPaths();
  return [...en, ...en.map(toTelugu), "/404"];
}
