/**
 * Content data model — mirrors the CMS collections in requirements §10.
 * Every collection lives as a JSON file in src/content/ and is editable
 * by staff through Decap CMS (/admin/).
 *
 * Convention for unconfirmed content: the value is `null` (or an empty
 * array) and the UI renders a visible <Todo> marker. Every such item is
 * listed in docs/CONTENT_TODO.md.
 */

export type Lang = "en" | "te";

/** Text with an English value and an optional Telugu translation. */
export interface LocalizedText {
  en: string;
  /** TODO(telugu): translation pending for most fields */
  te?: string | null;
}

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export const DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export type VisitingDay = DayOfWeek | "Daily";

/** True when the doctor is available on the given day. */
export const visitsOn = (days: VisitingDay[], day: DayOfWeek) => days.includes("Daily") || days.includes(day);

export interface Department {
  name: LocalizedText;
  slug: string;
  /** Lucide icon name, see src/components/ui/DepartmentIcon.tsx */
  icon: string;
  /** One-line summary; null = not yet written (TODO) */
  summary: LocalizedText | null;
  /** Longer description paragraphs; empty = TODO */
  description: LocalizedText[];
  /** Services & conditions treated; empty = TODO */
  services: LocalizedText[];
  order: number;
  isActive: boolean;
}

export type DoctorType = "Resident" | "Consultant";

export interface Doctor {
  name: string;
  slug: string;
  /** Path under /images/doctors/ ; null = photo pending (TODO) */
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
  /** Department slug (reference) */
  department: string;
  day: DayOfWeek;
  /** 24h "HH:MM" */
  startTime: string;
  endTime: string;
  notes?: string | null;
}

export type StoryCategory = "Patient" | "Camp" | "Update";

export interface Story {
  title: LocalizedText;
  slug: string;
  coverImage: string | null;
  coverAlt: string;
  /** Paragraphs */
  body: LocalizedText[];
  category: StoryCategory;
  /** ISO date */
  date: string;
  consentConfirmed: boolean;
}

export type GalleryCategory = "Hospital" | "Camps" | "Events";

export interface GalleryItem {
  image: string;
  /** Used as alt text */
  caption: LocalizedText;
  category: GalleryCategory;
  /** ISO date if known */
  date: string | null;
}

export interface ImpactStat {
  label: LocalizedText;
  /** null = number not yet confirmed (TODO) */
  value: string | null;
  /** ISO date; null = TODO */
  asOfDate: string | null;
  order: number;
}

export type FaqPage = "PatientGuide" | "SupportUs" | "Department";

export interface Faq {
  question: LocalizedText;
  /** null = answer not yet confirmed (TODO) */
  answer: LocalizedText | null;
  page: FaqPage;
  /** For page = Department */
  department?: string | null;
  order: number;
}

export interface OpdHoursRule {
  days: DayOfWeek[];
  /** 24h "HH:MM" */
  open: string;
  close: string;
}

export interface SiteSettings {
  hospitalName: string;
  /** E.164, e.g. +918499991259 */
  phone: string;
  phoneDisplay: string;
  /** null = no emergency number confirmed (TODO) */
  emergencyPhone: string | null;
  email: string;
  /** null = no WhatsApp number confirmed (TODO) */
  whatsapp: string | null;
  address: {
    lines: string[];
    locality: string;
    district: string;
    region: string;
    postalCode: string;
    country: string;
  };
  /** null = exact coordinates not confirmed (TODO) */
  geo: { lat: number; lng: number } | null;
  mapUrl: string;
  mapEmbedUrl: string;
  /** General OPD hours; empty = not confirmed (TODO) */
  opdHours: OpdHoursRule[];
  /** Short human summary for the utility bar; null = TODO */
  opdSummary: LocalizedText | null;
  holidayNotice: LocalizedText | null;
  trust: {
    name: string;
    url: string | null;
    registeredOffice: string;
  };
  donation: {
    /** External online donation link for Indian donors; null = TODO */
    indianDonorUrl: string | null;
    internationalEmail: string;
    /** e.g. "₹X covers a day of OPD medicines"; empty = TODO */
    impactPerContribution: string[];
    /** e.g. 80G details; null = TODO */
    taxInfo: string | null;
    /** How funds are used; null = TODO */
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
  description: LocalizedText;
  /** null = official URL not yet confirmed (TODO) */
  url: string | null;
}

export interface TimelineEvent {
  date: string;
  title: string;
  text: string;
}

export interface EnquiryReason {
  value: "patient" | "donation" | "volunteer" | "partnership" | "other";
  label: string;
}
