/**
 * Typed access to the JSON content collections (CMS data, requirements §10).
 */
import type { Department, Doctor, Faq, FaqPage, GalleryItem, GovernanceGroup, ImpactStat, NetworkOrg, OpdTiming, SiteSettings, Story, TimelineEvent } from "@/types";

import siteSettingsJson from "./site-settings.json";
import departmentsJson from "./departments.json";
import doctorsJson from "./doctors.json";
import opdTimingsJson from "./opd-timings.json";
import storiesJson from "./stories.json";
import galleryJson from "./gallery.json";
import impactStatsJson from "./impact-stats.json";
import faqsJson from "./faqs.json";
import aboutJson from "./about.json";
import policiesJson from "./policies.json";

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export const siteSettings = siteSettingsJson as SiteSettings;

export const departments: Department[] = (departmentsJson.items as Department[]).filter((d) => d.isActive).sort(byOrder);
export const doctors: Doctor[] = (doctorsJson.items as Doctor[]).filter((d) => d.isActive).sort(byOrder);
export const opdTimings = opdTimingsJson.items as OpdTiming[];

/** Patient stories are only ever shown with written consent. */
export const stories: Story[] = (storiesJson.items as Story[]).filter((s) => s.consentConfirmed || s.category !== "Patient").sort((a, b) => b.date.localeCompare(a.date));

export const gallery = galleryJson.items as GalleryItem[];
export const impactStats: ImpactStat[] = (impactStatsJson.items as ImpactStat[]).sort(byOrder);
export const faqs: Faq[] = (faqsJson.items as Faq[]).sort(byOrder);

export interface Portrait {
  name: string;
  photo: string;
  quote: string;
  body: string[];
}
export interface AboutContent {
  intro: string[];
  inspiration: Portrait;
  founder: Portrait;
  mission: { name: string; body: string[] };
  trust: { name: string; logo: string; body: string[] };
  history: string[];
  timeline: TimelineEvent[];
  governance: GovernanceGroup[];
  network: NetworkOrg[];
  multiSpeciality: { heading: string; points: { title: string; text: string }[]; published: boolean };
}
export const about = aboutJson as AboutContent;

export interface Policy {
  slug: string;
  title: string;
  sections: { heading: string | null; paragraphs: string[]; list: string[] }[];
}
export const policies = policiesJson.items as Policy[];

export const getDepartment = (slug: string) => departments.find((d) => d.slug === slug);
export const getDoctor = (slug: string) => doctors.find((d) => d.slug === slug);
export const getStory = (slug: string) => stories.find((s) => s.slug === slug);
export const getPolicy = (slug: string) => policies.find((p) => p.slug === slug);
export const doctorsInDepartment = (slug: string) => doctors.filter((d) => d.department === slug);
export const faqsFor = (page: FaqPage, department?: string) => faqs.filter((f) => f.page === page && (page !== "Department" || f.department === department));

/** Phone link helper — single source of truth (§5.9). */
export const tel = `tel:${siteSettings.phone}`;
/** Emergency number for display: reuses the formatted main number when they are the same. */
export const emergencyDisplay = siteSettings.emergencyPhone === siteSettings.phone ? siteSettings.phoneDisplay : siteSettings.emergencyPhone;
export const emergencyIsMainPhone = siteSettings.emergencyPhone === siteSettings.phone;
