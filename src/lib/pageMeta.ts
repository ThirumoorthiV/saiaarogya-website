/**
 * Titles, meta descriptions (140–160 chars, §8) and breadcrumbs for every
 * static page. Detail pages (department, doctor, story, policy) build theirs
 * from CMS data. `npm run lint` + scripts/check-meta.mjs verify lengths.
 */
import type { Crumb } from "@/components/layout/Breadcrumbs";

export interface PageMeta {
  title: string;
  /** Visible page heading (H1) when it should differ from the SEO title */
  h1?: string;
  description: string;
  crumbs: Crumb[];
}

const about: Crumb = { label: "About", to: "/about/" };
const guide: Crumb = { label: "Patient Guide", to: "/patient-guide/" };
const impact: Crumb = { label: "Our Impact", to: "/impact/" };
const support: Crumb = { label: "Support Us", to: "/support-us/" };

export const PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "Sai Aarogya Hospital, Bapatla – Free Multi-Speciality Care",
    description:
      "Quality secondary care, accessible to all, free of charge. Find a doctor, OPD timings and directions to Sai Aarogya Hospital in Bapatla, Andhra Pradesh.",
    crumbs: [],
  },
  "/about/": {
    h1: "Our story",
    title: "About Us – Our Story, Mission and Trust",
    description:
      "How Sai Aarogya Hospital, Bapatla brings free, compassionate healthcare to rural Andhra Pradesh — our inspiration, founder, mission and the Trust behind us.",
    crumbs: [{ label: "About" }],
  },
  "/about/history/": {
    h1: "Our history",
    title: "Our History – From Aravinda Ashramam to Sai Aarogya",
    description:
      "From a 20-bed hospital at Kajipalem to Sai Aarogya Hospital, inaugurated on 13 December 2024 — the timeline of free healthcare in Bapatla District.",
    crumbs: [about, { label: "History" }],
  },
  "/about/governance/": {
    h1: "Governance",
    title: "Governance – Trustees, Advisors and Management",
    description:
      "Meet the Board of Trustees, Advisors and Management Committee who guide Sai Aarogya Hospital, Bapatla and the Sri Sathya Sai Sujala Sravanthi Trust.",
    crumbs: [about, { label: "Governance" }],
  },
  "/departments/": {
    h1: "Departments",
    title: "Departments – 10 Specialities, Free of Charge",
    description:
      "General medicine, surgery, dentistry, orthopaedics, paediatrics, eye care, obstetrics & gynaecology, cardiology, dermatology and urology — all free in Bapatla.",
    crumbs: [{ label: "Departments" }],
  },
  "/doctors/": {
    h1: "Our doctors",
    title: "Our Doctors – Specialists and Visiting Schedule",
    description:
      "Find a doctor at Sai Aarogya Hospital, Bapatla. Filter resident and consultant doctors by department and visiting day, then plan your free consultation.",
    crumbs: [{ label: "Doctors" }],
  },
  "/patient-guide/": {
    h1: "Patient Guide",
    title: "Patient Guide – Timings, Directions and Registration",
    description:
      "Everything you need before visiting Sai Aarogya Hospital, Bapatla: OPD timings, how to reach us, registration steps, what to bring, facilities and FAQs.",
    crumbs: [{ label: "Patient Guide" }],
  },
  "/patient-guide/opd-timings/": {
    h1: "OPD timings & visiting schedule",
    title: "OPD Timings and Doctor Visiting Schedule",
    description:
      "OPD timings and the weekly visiting schedule of every department at Sai Aarogya Hospital, Bapatla. Check which specialist is available before you travel.",
    crumbs: [guide, { label: "OPD Timings" }],
  },
  "/patient-guide/how-to-reach/": {
    h1: "How to reach us",
    title: "How to Reach Sai Aarogya Hospital, Khajipalem",
    description:
      "Directions to Sai Aarogya Hospital at Khajipalem, Pittlavanipalem Mandal, Bapatla District — map, landmarks, nearest bus stop and road route from Bapatla.",
    crumbs: [guide, { label: "How to Reach" }],
  },
  "/patient-guide/registration/": {
    h1: "Registration & what to bring",
    title: "Registration and What to Bring",
    description:
      "How to register for a free consultation at Sai Aarogya Hospital, Bapatla in three simple steps, and the documents and reports you should bring with you.",
    crumbs: [guide, { label: "Registration" }],
  },
  "/patient-guide/facilities/": {
    h1: "Facilities",
    title: "Hospital Facilities – Wards, Lab and Pharmacy",
    description:
      "Facilities available to patients at Sai Aarogya Hospital, Bapatla, including inpatient wards and diagnostic services — all provided completely free of charge.",
    crumbs: [guide, { label: "Facilities" }],
  },
  "/patient-guide/faqs/": {
    h1: "Frequently asked questions",
    title: "Patient FAQs – Is Treatment Really Free?",
    description:
      "Answers to common questions from patients and families: is everything really free, do I need an appointment, are medicines free and can I bring an attendant.",
    crumbs: [guide, { label: "FAQs" }],
  },
  "/impact/": {
    h1: "Our impact",
    title: "Our Impact – Free Healthcare in Rural Andhra Pradesh",
    description:
      "The difference free secondary care is making in Bapatla District — key numbers, patient stories, medical camps and photos from Sai Aarogya Hospital.",
    crumbs: [{ label: "Our Impact" }],
  },
  "/impact/stories/": {
    h1: "Patient stories",
    title: "Patient Stories",
    description:
      "Real stories, shared with consent, from patients and families who received free treatment at Sai Aarogya Hospital in Bapatla, Andhra Pradesh.",
    crumbs: [impact, { label: "Patient Stories" }],
  },
  "/impact/camps/": {
    h1: "Medical camps & updates",
    title: "Medical Camps and Updates",
    description:
      "News, updates and free medical camps from Sai Aarogya Hospital, Bapatla and the Sai Swasthya Wellness Centres serving rural Andhra Pradesh communities.",
    crumbs: [impact, { label: "Camps & Updates" }],
  },
  "/impact/gallery/": {
    h1: "Gallery",
    title: "Photo Gallery",
    description:
      "Photos of Sai Aarogya Hospital, Bapatla — our wards, OPD, doctors at work, medical camps and events. Browse by category and view each image full screen.",
    crumbs: [impact, { label: "Gallery" }],
  },
  "/support-us/": {
    h1: "Every contribution keeps care free",
    title: "Support Us – Help Keep Care Free for Everyone",
    description:
      "Every contribution keeps care free at Sai Aarogya Hospital, Bapatla. Donate from India or abroad, volunteer your time, and see how funds are used.",
    crumbs: [{ label: "Support Us" }],
  },
  "/support-us/donate/": {
    h1: "Donate",
    title: "Donate – For Indian Donors",
    description:
      "Donate online to Sri Sathya Sai Sujala Sravanthi Trust and help Sai Aarogya Hospital, Bapatla provide free, compassionate healthcare to rural communities.",
    crumbs: [support, { label: "Donate" }],
  },
  "/support-us/international-donors/": {
    h1: "International donors",
    title: "International Donors",
    description:
      "Foreign nationals who wish to support free healthcare at Sai Aarogya Hospital, Bapatla can contact the Sri Sathya Sai Sujala Sravanthi Trust by email.",
    crumbs: [support, { label: "International Donors" }],
  },
  "/support-us/volunteer/": {
    h1: "Volunteer with us",
    title: "Volunteer With Us",
    description:
      "Volunteer at Sai Aarogya Hospital, Bapatla. Medical professionals and non-medical volunteers can share their time and skills to keep healthcare free for all.",
    crumbs: [support, { label: "Volunteer" }],
  },
  "/support-us/transparency/": {
    h1: "Transparency",
    title: "Transparency – How Your Donation Is Used",
    description:
      "How donations to Sai Aarogya Hospital are used, how receipts are issued, tax information and the policies of the Sri Sathya Sai Sujala Sravanthi Trust.",
    crumbs: [support, { label: "Transparency" }],
  },
  "/contact/": {
    h1: "Contact us",
    title: "Contact Us – Address, Phone and Map",
    description:
      "Contact Sai Aarogya Hospital, Khajipalem, Bapatla District, Andhra Pradesh 522329. Call us, send an enquiry or get directions on the map. All care is free.",
    crumbs: [{ label: "Contact" }],
  },
};

export function getPageMeta(path: string): PageMeta {
  const meta = PAGE_META[path];
  if (!meta) throw new Error(`No page meta for ${path}`);
  return meta;
}
