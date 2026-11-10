/**
 * Structured data (JSON-LD) builders — requirements §8.
 * Hospital, Physician, FAQPage and BreadcrumbList.
 */
import { departments, siteSettings } from "@/content";
import type { Doctor, Faq } from "@/types";
import { SITE_URL } from "./staticPaths";

type Json = Record<string, unknown>;

/** Department slug → schema.org MedicalSpecialty enumeration value(s). */
const SPECIALTY_MAP: Record<string, string[]> = {
  "general-medicine": ["PrimaryCare"],
  "general-surgery": ["Surgical"],
  dentistry: ["Dentistry"],
  orthopaedics: ["Musculoskeletal"],
  paediatrics: ["Pediatric"],
  ophthalmology: ["Optometric"],
  "obstetrics-gynaecology": ["Obstetric", "Gynecologic"],
  cardiology: ["Cardiovascular"],
  dermatology: ["Dermatology"],
  urology: ["Urologic"],
};

const specialtyUrls = (slug: string) => (SPECIALTY_MAP[slug] ?? []).map((s) => `https://schema.org/${s}`);

export const HOSPITAL_ID = `${SITE_URL}/#hospital`;

function postalAddress(): Json {
  const a = siteSettings.address;
  return {
    "@type": "PostalAddress",
    streetAddress: a.lines.join(", "),
    addressLocality: a.locality,
    addressRegion: a.region,
    postalCode: a.postalCode,
    addressCountry: a.country,
  };
}

const DAY_NAMES: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

export function hospitalSchema(): Json {
  const s = siteSettings;
  const schema: Json = {
    "@context": "https://schema.org",
    "@type": "Hospital",
    "@id": HOSPITAL_ID,
    name: `${s.hospitalName}, Bapatla`,
    alternateName: "Sai Aarogya Hospital – Bapatla",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/images/logo-mark.png`,
    image: `${SITE_URL}/images/og-default.jpg`,
    description:
      "Quality secondary care, accessible to all, free of charge. A unit of Sri Sathya Sai Sujala Sravanthi Trust under the Sri Madhusudan Sai Global Humanitarian Mission.",
    telephone: s.phone,
    email: s.email,
    address: postalAddress(),
    isAccessibleForFree: true,
    priceRange: "Free",
    medicalSpecialty: [...new Set(departments.flatMap((d) => specialtyUrls(d.slug)))],
    parentOrganization: { "@type": "NGO", name: s.trust.name },
  };
  if (s.geo) schema.geo = { "@type": "GeoCoordinates", latitude: s.geo.lat, longitude: s.geo.lng };
  if (s.opdHours.length) {
    schema.openingHoursSpecification = s.opdHours.map((r) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: r.days.map((d) => `https://schema.org/${DAY_NAMES[d]}`),
      opens: r.open,
      closes: r.close,
    }));
  }
  return schema;
}

export function physicianSchema(doctor: Doctor, path: string): Json {
  const dept = departments.find((d) => d.slug === doctor.department);
  const schema: Json = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    url: `${SITE_URL}${path}`,
    description: `${doctor.name}, ${doctor.qualification}${dept ? ` — ${dept.name}` : ""} at Sai Aarogya Hospital, Bapatla.`,
    medicalSpecialty: specialtyUrls(doctor.department),
    hospitalAffiliation: { "@type": "Hospital", "@id": HOSPITAL_ID, name: `${siteSettings.hospitalName}, Bapatla` },
    address: postalAddress(),
    telephone: siteSettings.phone,
    isAccessibleForFree: true,
  };
  if (doctor.photo) schema.image = `${SITE_URL}${doctor.photo}`;
  return schema;
}

/** Only questions with a confirmed answer are included. */
export function faqSchema(items: Faq[]): Json | null {
  const answered = items.filter((f) => f.answer);
  if (!answered.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: answered.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
