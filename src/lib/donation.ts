/**
 * Donation data shared by the Donate form (browser) and the Vercel Functions in api/ (server):
 * the validation schema, the Razorpay order notes, and the payload sent to Frappe.
 *
 * Keep this file free of "@/..." imports and React: it is imported by the functions too.
 *
 * Flow: Donate click → /api/donations/create (Razorpay Order or Subscription, with the
 * form details in `notes`) → Razorpay Checkout → Razorpay webhook (order.paid /
 * subscription.charged) → /api/razorpay/webhook → POST to the Frappe webhook, once per payment.
 */
import { z } from "zod";
import { LIMITS, PAN, PIN, rules } from "./fieldRules.js";

/* Field options copied from the donation form on the current website (/donateus). */
export const PURPOSES = ["Healthcare", "Social Welfare", "Education", "Surgery Gap Funding", "Nutrition"] as const;
export const SALUTATIONS = ["Mr", "Mrs", "Ms", "M/s"] as const;
export const DONATION_TYPES = ["One time donation", "Recurring donations"] as const;
export const FREQUENCIES = ["Weekly", "Monthly", "Quarterly", "Yearly"] as const;
export type Frequency = (typeof FREQUENCIES)[number];

/** Razorpay limits: each note value ≤ 256 characters, at most 15 notes. */
const NOTE_MAX = 250;
export const MAX_AMOUNT = 10_00_000; // ₹10 lakh per transaction (guard against typos)

/** yyyy-mm-dd, a real date, not in the future, after 1900. */
const validDob = (v: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const t = Date.parse(`${v}T00:00:00Z`);
  return Number.isFinite(t) && t <= Date.now() && v >= "1900-01-01" && new Date(t).toISOString().startsWith(v);
};
const req = (label: string, max: number) => z.string().trim().min(1, `Please enter your ${label}.`).max(max, `Please keep your ${label} under ${max} characters.`);

export const donationSchema = z
  .object({
    purpose: z.enum(PURPOSES, { message: "Please choose a donation purpose." }),
    salutation: z.union([z.literal(""), z.enum(SALUTATIONS)]),
    firstName: rules.name("first name"),
    lastName: rules.name("last name", LIMITS.name, 1),
    email: rules.email(),
    mobile: rules.mobile(),
    dob: z
      .string()
      .optional()
      .refine((v) => !v || validDob(v), "Please enter a valid date of birth (not in the future)."),
    pan: z
      .string()
      .trim()
      .transform((v) => v.toUpperCase())
      .refine((v) => v.length > 0, "Please enter your PAN.")
      .refine((v) => v.length === 0 || PAN.test(v), "Please enter a valid 10-character PAN, e.g. ABCDE1234F."),
    address: req("address", NOTE_MAX)
      .min(5, "Please enter your full address.")
      .refine((v) => !/[<>]/.test(v), "Your address cannot contain < or >."),
    city: rules.place("city"),
    state: rules.place("state"),
    zip: z
      .string()
      .trim()
      .refine((v) => v.length > 0, "Please enter your PIN code.")
      .refine((v) => v.length === 0 || PIN.test(v), "Please enter a valid 6-digit PIN code."),
    country: rules.place("country"),
    donationType: z.enum(DONATION_TYPES, { message: "Please choose a donation type." }),
    frequency: z.union([z.literal(""), z.enum(FREQUENCIES)]),
    occurrences: z.string().trim().optional(),
    amount: z
      .string()
      .trim()
      .transform((v) => v.replace(/\.$/, "")) // "5000." (paise ignored) → "5000"
      .refine((v) => /^\d+$/.test(v) && Number(v) >= 1, "Please enter the amount in rupees.")
      .refine((v) => Number(v) <= MAX_AMOUNT, "For donations above ₹10,00,000 please contact the Trust."),
    terms: z.boolean().refine((v) => v, "Please agree to the terms & conditions."),
  })
  .superRefine((d, ctx) => {
    if (d.donationType !== "Recurring donations") return;
    if (!d.frequency) ctx.addIssue({ code: "custom", path: ["frequency"], message: "Please choose how often." });
    const n = Number(d.occurrences);
    if (!Number.isInteger(n) || n < 1 || n > 120) ctx.addIssue({ code: "custom", path: ["occurrences"], message: "Please enter the number of occurrences (1–120)." });
  });
export type DonationInput = z.input<typeof donationSchema>;
export type Donation = z.output<typeof donationSchema>;

export const isRecurring = (d: Pick<Donation, "donationType">) => d.donationType === "Recurring donations";

/** Razorpay plan period for each frequency (Quarterly = every 3 months). */
export const PLAN_PERIOD: Record<Frequency, { period: "weekly" | "monthly" | "yearly"; interval: number }> = {
  Weekly: { period: "weekly", interval: 1 },
  Monthly: { period: "monthly", interval: 1 },
  Quarterly: { period: "monthly", interval: 3 },
  Yearly: { period: "yearly", interval: 1 },
};

/**
 * Form details stored on the Razorpay Order / Subscription (`notes`, max 15).
 * Keys are the Frappe field names, so the webhook can forward them unchanged.
 */
export function toRazorpayNotes(d: Donation): Record<string, string> {
  const cut = (v: string | undefined) => (v ?? "").slice(0, NOTE_MAX);
  return {
    pan_card: d.pan,
    salutation: d.salutation,
    first_name: cut(d.firstName),
    last_name: cut(d.lastName),
    email: cut(d.email),
    mobile: d.mobile,
    dob: d.dob ?? "",
    address: cut(d.address),
    city: cut(d.city),
    state: cut(d.state),
    pincode: d.zip,
    country: cut(d.country),
    donation_purpose: d.purpose,
    donation_type: d.donationType,
    recurrence: isRecurring(d) ? `${d.frequency}|${d.occurrences}` : "",
  };
}

/**
 * The 12 form keys Frappe accepts (Frappe donation field names), sent with the donation amount.
 */
export const FRAPPE_FORM_KEYS = ["pan_card", "salutation", "email", "first_name", "last_name", "address", "city", "state", "pincode", "country", "donation_purpose", "donation_type"] as const;
/** Frappe field that receives the donation amount in rupees. */
export const FRAPPE_AMOUNT_KEY = "amount";

export interface RazorpayPayment {
  id: string;
  amount: number; // paise
  currency: string;
  method?: string;
  order_id?: string | null;
  created_at?: number; // unix seconds
}

/**
 * Payload POSTed to the Frappe webhook after Razorpay confirms the payment:
 * exactly the 12 form keys plus the amount (rupees). Nothing else is sent.
 */
export function toFrappePayload(notes: Record<string, string | undefined>, payment: Pick<RazorpayPayment, "amount">): Record<string, string | number> {
  const form = Object.fromEntries(FRAPPE_FORM_KEYS.map((k) => [k, notes[k] ?? ""]));
  return { ...form, [FRAPPE_AMOUNT_KEY]: payment.amount / 100 };
}
