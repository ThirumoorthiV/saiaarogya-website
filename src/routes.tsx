import type { RouteRecord } from "vite-react-ssg";
import { Layout } from "@/components/layout/Layout";

/**
 * Route table — sitemap and URLs from requirements §4.3 / §4.4 (English only).
 * Each page is code-split with `lazy`; page modules export `Component`.
 */
export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, lazy: () => import("@/pages/Home") },

      { path: "about", lazy: () => import("@/pages/about/Index") },
      { path: "about/history", lazy: () => import("@/pages/about/History") },
      { path: "about/governance", lazy: () => import("@/pages/about/Governance") },

      { path: "departments", lazy: () => import("@/pages/departments/Index") },
      { path: "departments/:slug", lazy: () => import("@/pages/departments/Detail") },

      { path: "doctors", lazy: () => import("@/pages/doctors/Index") },
      { path: "doctors/:slug", lazy: () => import("@/pages/doctors/Detail") },

      { path: "patient-guide", lazy: () => import("@/pages/patient-guide/Index") },
      { path: "patient-guide/opd-timings", lazy: () => import("@/pages/patient-guide/OpdTimings") },
      { path: "patient-guide/how-to-reach", lazy: () => import("@/pages/patient-guide/HowToReach") },
      { path: "patient-guide/registration", lazy: () => import("@/pages/patient-guide/Registration") },
      { path: "patient-guide/facilities", lazy: () => import("@/pages/patient-guide/Facilities") },
      { path: "patient-guide/faqs", lazy: () => import("@/pages/patient-guide/Faqs") },

      { path: "impact", lazy: () => import("@/pages/impact/Index") },
      { path: "impact/stories", lazy: () => import("@/pages/impact/Stories") },
      { path: "impact/stories/:slug", lazy: () => import("@/pages/impact/StoryDetail") },
      { path: "impact/camps", lazy: () => import("@/pages/impact/Camps") },
      { path: "impact/gallery", lazy: () => import("@/pages/impact/GalleryPage") },

      { path: "support-us", lazy: () => import("@/pages/support/Index") },
      { path: "support-us/donate", lazy: () => import("@/pages/support/Donate") },
      { path: "support-us/international-donors", lazy: () => import("@/pages/support/International") },
      { path: "support-us/volunteer", lazy: () => import("@/pages/support/Volunteer") },
      { path: "support-us/transparency", lazy: () => import("@/pages/support/Transparency") },

      { path: "contact", lazy: () => import("@/pages/Contact") },
      { path: "policies/:slug", lazy: () => import("@/pages/Policy") },

      { path: "*", lazy: () => import("@/pages/NotFound") },
    ],
  },
];
