import type { RouteRecord } from "vite-react-ssg";
import { Layout } from "@/components/layout/Layout";

/**
 * Route table — sitemap and URLs from requirements §4.3 / §4.4.
 * The same page routes are mounted under "/" (English) and "/te" (Telugu).
 * Each page is code-split with `lazy`; modules export `Component`.
 */
const placeholder = () => import("@/pages/Placeholder");

/** Fresh route objects per language tree — the router assigns ids by mutating them. */
const pageRoutes = (): RouteRecord[] => [
  { index: true, lazy: () => import("@/pages/Home") },

  { path: "about", lazy: placeholder },
  { path: "about/history", lazy: placeholder },
  { path: "about/governance", lazy: placeholder },

  { path: "departments", lazy: placeholder },
  { path: "departments/:slug", lazy: placeholder },

  { path: "doctors", lazy: placeholder },
  { path: "doctors/:slug", lazy: placeholder },

  { path: "patient-guide", lazy: () => import("@/pages/patient-guide/Index") },
  { path: "patient-guide/opd-timings", lazy: () => import("@/pages/patient-guide/OpdTimings") },
  { path: "patient-guide/how-to-reach", lazy: () => import("@/pages/patient-guide/HowToReach") },
  { path: "patient-guide/registration", lazy: () => import("@/pages/patient-guide/Registration") },
  { path: "patient-guide/facilities", lazy: () => import("@/pages/patient-guide/Facilities") },
  { path: "patient-guide/faqs", lazy: () => import("@/pages/patient-guide/Faqs") },

  { path: "impact", lazy: placeholder },
  { path: "impact/stories", lazy: placeholder },
  { path: "impact/stories/:slug", lazy: placeholder },
  { path: "impact/camps", lazy: placeholder },
  { path: "impact/gallery", lazy: placeholder },

  { path: "support-us", lazy: placeholder },
  { path: "support-us/donate", lazy: placeholder },
  { path: "support-us/international-donors", lazy: placeholder },
  { path: "support-us/volunteer", lazy: placeholder },
  { path: "support-us/transparency", lazy: placeholder },

  { path: "contact", lazy: () => import("@/pages/Contact") },

  { path: "policies/:slug", lazy: placeholder },

  { path: "*", lazy: () => import("@/pages/NotFound") },
];

export const routes: RouteRecord[] = [
  { path: "/te", element: <Layout lang="te" />, children: pageRoutes() },
  { path: "/", element: <Layout lang="en" />, children: pageRoutes() },
];
