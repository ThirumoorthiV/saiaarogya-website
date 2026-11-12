/**
 * Field rules shared by every form (Contact / Enquiry, Volunteer, Donate) and by the
 * donation API functions. Two layers:
 *  1. `clean.*` runs while the visitor types or pastes: it removes characters the field
 *     can never contain and enforces the length (e.g. mobile = digits only, max 10).
 *  2. `rules.*` (zod) runs on submit and on the server: it checks the final value.
 *
 * Keep this file free of "@/..." imports and React: the Vercel functions import it too.
 */
import { z } from "zod";

export const LIMITS = { name: 60, fullName: 100, email: 120, phone: 10, pin: 6, pan: 10, place: 80, address: 250, short: 120, medium: 200, message: 2000, amount: 7, occurrences: 3 } as const;

/** 10-digit Indian mobile number starting 6–9. */
export const MOBILE = /^[6-9]\d{9}$/;
export const PAN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const PIN = /^[1-9][0-9]{5}$/;
/** Letters (any script), spaces and . ' - — e.g. "K. Sai-Ram", "D'Souza". */
const NAME = /^\p{L}[\p{L}\p{M} .'-]*$/u;
/** City / state / country. */
const PLACE = /^\p{L}[\p{L}\p{M} .'()-]*$/u;
/** Practical email check (the browser's own rule): no spaces, one @, a dot in the domain. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Strip +91 / 91 / 0 in front of a 10-digit number, then keep digits only (max 10). */
export function cleanMobile(v: string) {
  let d = v.replace(/\D/g, "");
  if (d.length > 10 && d.startsWith("91")) d = d.slice(2);
  if (d.length > 10 && d.startsWith("0")) d = d.slice(1);
  return d.slice(0, LIMITS.phone);
}

/** Live input filters (applied on every keystroke / paste). */
export const clean = {
  mobile: cleanMobile,
  name: (v: string, max: number = LIMITS.name) =>
    v
      .replace(/[^\p{L}\p{M} .'-]/gu, "")
      .replace(/^[\s.'-]+/, "")
      .replace(/ {2,}/g, " ")
      .slice(0, max),
  place: (v: string) =>
    v
      .replace(/[^\p{L}\p{M} .'()-]/gu, "")
      .replace(/^[\s.'()-]+/, "")
      .replace(/ {2,}/g, " ")
      .slice(0, LIMITS.place),
  email: (v: string) => v.replace(/\s/g, "").slice(0, LIMITS.email),
  /** Whole rupees: ignore anything after a decimal point ("500.50" → "500"), digits only. */
  rupees: (v: string) => {
    const [whole = "", ...rest] = v.split(".");
    const int = whole.replace(/\D/g, "").replace(/^0+/, "").slice(0, LIMITS.amount);
    // Keep a typed "." so the paise typed after it are dropped, not added to the rupees
    return rest.length && int ? `${int}.` : int;
  },
  digits: (max: number) => (v: string) => v.replace(/\D/g, "").slice(0, max),
  pan: (v: string) =>
    v
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, LIMITS.pan),
  /** Free text: drop angle brackets and control characters, cap the length. */
  text: (max: number) => (v: string) =>
    v
      .replace(/[<>]/g, "")
      // eslint-disable-next-line no-control-regex -- intentionally strips invisible control characters (keeps tab and new lines)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .slice(0, max),
};

/** Submit-time / server-side checks (zod). */
export const rules = {
  mobile: () =>
    z
      .string()
      .transform(cleanMobile)
      .refine((v) => v.length > 0, "Please enter your mobile number.")
      .refine((v) => v.length === 0 || v.length === 10, "Mobile number must be exactly 10 digits.")
      .refine((v) => v.length !== 10 || MOBILE.test(v), "Please enter a valid Indian mobile number (starting with 6, 7, 8 or 9)."),
  name: (label: string, max: number = LIMITS.name, min = 2) =>
    z
      .string()
      .trim()
      .min(1, `Please enter your ${label}.`)
      .min(min, `Your ${label} must be at least ${min} letters.`)
      .max(max, `Please keep your ${label} under ${max} characters.`)
      .refine((v) => NAME.test(v), `Your ${label} can contain only letters, spaces, dots, hyphens and apostrophes.`),
  place: (label: string) =>
    z
      .string()
      .trim()
      .min(1, `Please enter your ${label}.`)
      .min(2, `Please enter a valid ${label}.`)
      .max(LIMITS.place, `Please keep your ${label} under ${LIMITS.place} characters.`)
      .refine((v) => PLACE.test(v), `Your ${label} can contain only letters and spaces.`),
  email: () =>
    z
      .string()
      .trim()
      .min(1, "Please enter your email address.")
      .max(LIMITS.email, "Please enter a shorter email address.")
      .refine((v) => EMAIL.test(v), "Please enter a valid email address, e.g. name@example.com."),
  optionalEmail: () =>
    z
      .string()
      .trim()
      .max(LIMITS.email, "Please enter a shorter email address.")
      .refine((v) => v === "" || EMAIL.test(v), "Please enter a valid email address (e.g. name@example.com), or leave it empty."),
  optionalText: (label: string, max: number) =>
    z
      .string()
      .trim()
      .max(max, `Please keep the ${label} under ${max} characters.`)
      .refine((v) => !/[<>]/.test(v), `The ${label} cannot contain < or >.`)
      .optional(),
};
