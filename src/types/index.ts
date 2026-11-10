/**
 * Content data model — the CMS collections in requirements §10 (English only).
 * Every collection is a JSON file in src/content/, editable through Decap CMS (/admin/).
 *
 * Convention for unconfirmed content: the value is `null` (or an empty array)
 * and the UI renders a visible <Todo> marker. Every marker is listed in
 * docs/CONTENT_TODO.md.
 */

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export const DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAY_NAMES: Record<DayOfWeek, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};
export type VisitingDay = DayOfWeek | "Daily";

/** True when a doctor with these visiting days is available on `day`. */
export const visitsOn = (days: VisitingDay[], day: DayOfWeek) => days.includes("Daily") || days.includes(day);

export interface Department {
  name: string;
  slug: string;
  /** Icon key, see src/components/ui/DepartmentIcon.tsx */
  icon: string;
  /** One-line summary; null = not yet written (TODO) */
  summary: string | null;
  /** Description paragraphs; empty = TODO */
  description: string[];
  /** Services & conditions treated; empty = TODO */
  services: string[];
  order: number;
  isActive: boolean;
}

export type DoctorType = "Resident" | "Consultant";

export interface Doctor {
  name: string;
  slug: string;
  /** Image path; null = photo pending (TODO) */
  photo: string | null;
  qualification: string;
  /** Department slug (reference) */
  department: string;
  type: DoctorType;
  /** Specific days, or ["Daily"]; empty = not yet confirmed (TODO) */
  visitingDays: VisitingDay[];
  /** e.g. "10:00 AM – 1:00 PM"; null = TODO */
  timing: string | null;
  /** empty = TODO */
  languages: string[];
  order: number;
  isActive: boolean;
}

export interface OpdTiming {
  department: string;
  day: DayOfWeek;
  /** 24h "HH:MM" */
  startTime: string;
  endTime: string;
  notes?: string | null;
}

export type StoryCategory = "Patient" | "Camp" | "Update";

export interface Story {
  title: string;
  slug: string;
  coverImage: string | null;
  coverAlt: string;
  body: string[];
  category: StoryCategory;
  /** ISO date */
  date: string;
  consentConfirmed: boolean;
  /** Sample content for demos — shown with a "Demo story" label */
  isDemo?: boolean;
}

export type GalleryCategory = "Hospital" | "Camps" | "Events";

export interface GalleryItem {
  image: string;
  /** Also used as alt text */
  caption: string;
  category: GalleryCategory;
  date: string | null;
}

export interface ImpactStat {
  label: string;
  /** null = number not yet confirmed (TODO) */
  value: string | null;
  asOfDate: string | null;
  order: number;
}

export type FaqPage = "PatientGuide" | "SupportUs" | "Department";

export interface Faq {
  question: string;
  /** null = answer not yet confirmed (TODO) */
  answer: string | null;
  page: FaqPage;
  department?: string | null;
  order: number;
}

export interface OpdHoursRule {
  days: DayOfWeek[];
  open: string;
  close: string;
}

export interface SiteSettings {
  hospitalName: string;
  /** E.164, e.g. +918499991259 */
  phone: string;
  phoneDisplay: string;
  emergencyPhone: string | null;
  email: string;
  whatsapp: string | null;
  address: {
    lines: string[];
    locality: string;
    district: string;
    region: string;
    postalCode: string;
    country: string;
  };
  geo: { lat: number; lng: number } | null;
  mapUrl: string;
  mapEmbedUrl: string;
  /** General OPD hours; empty = TODO (drives the "Open now" badge) */
  opdHours: OpdHoursRule[];
  opdSummary: string | null;
  holidayNotice: string | null;
  trust: { name: string; url: string | null; registeredOffice: string };
  donation: {
    indianDonorUrl: string | null;
    internationalEmail: string;
    /** Trust donation helpline (from the current /donateus page) */
    contactPhone: string;
    /** Tax / FCRA / CSR registrations shown on the Donate page */
    registrations: { label: string; value: string }[];
    impactPerContribution: string[];
    taxInfo: string | null;
    fundUse: string | null;
  };
  social: { label: string; url: string }[];
}

export interface Person {
  name: string;
  slug: string;
  photo: string | null;
  role?: string | null;
  bio?: string | null;
}

export interface GovernanceGroup {
  title: string;
  subtitle?: string | null;
  people: Person[];
}

export interface NetworkOrg {
  name: string;
  short?: string | null;
  description: string;
  url: string | null;
}

export interface TimelineEvent {
  date: string;
  title: string;
  text: string;
}
