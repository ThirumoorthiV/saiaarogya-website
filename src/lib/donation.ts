/**
 * Donation data shared by the Donate form (browser) and the Netlify Functions (server):
 * the validation schema, the Razorpay order notes, and the payload sent to Frappe.
 *
 * Keep this file free of "@/..." imports and React: it is bundled into the functions too.
 *
 * Flow: Donate click → /api/donations/create (Razorpay Order or Subscription, with the
 * form details in `notes`) → Razorpay Checkout → Razorpay webhook (order.paid /
 * subscription.charged) → /api/razorpay/webhook → POST to the Frappe webhook, once per payment.
 */
import { z } from "zod";

/* Field options copied from the donation form on the current website (/donateus). */
export const PURPOSES = ["Healthcare", "Social Welfare", "Education", "Surgery Gap Funding", "Nutrition"] as const;
export const SALUTATIONS = ["Mr", "Mrs", "Ms", "M/s"] as const;
export const DONATION_TYPES = ["One time donation", "Recurring donations"] as const;
export const FREQUENCIES = ["Weekly", "Monthly", "Quarterly", "Yearly"] as const;
export type Frequency = (typeof FREQUENCIES)[number];

/** Indian mobile: optional +91 / 91 / 0 prefix, then 10 digits starting 6–9. */
const INDIAN_PHONE = /^(?:\+?91|0)?[6-9]\d{9}$/;
const PAN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const PIN = /^[1-9][0-9]{5}$/;
/** Razorpay limits: each note value ≤ 256 characters, at most 15 notes. */
const NOTE_MAX = 250;
export const MAX_AMOUNT = 10_00_000; // ₹10 lakh per transaction (guard against typos)

const req = (label: string, max: number) => z.string().trim().min(1, `Please enter your ${label}.`).max(max, `Please keep your ${label} under ${max} characters.`);

export const donationSchema = z
  .object({
    purpose: z.enum(PURPOSES, { message: "Please choose a donation purpose." }),
    salutation: z.union([z.literal(""), z.enum(SALUTATIONS)]),
    firstName: req("first name", 60),
    lastName: req("last name", 60),
    email: z.string().trim().email("Please enter a valid email address.").max(120),
    mobile: z
      .string()
      .transform((v) => v.replace(/[\s()-]/g, ""))
      .refine((v) => INDIAN_PHONE.test(v), "Please enter a valid 10-digit Indian mobile number."),
    dob: z
      .string()
      .optional()
      .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), "Please enter a valid date."),
    pan: z
      .string()
      .trim()
      .transform((v) => v.toUpperCase())
      .refine((v) => PAN.test(v), "Please enter a valid PAN, e.g. ABCDE1234F."),
    address: req("address", NOTE_MAX),
    city: req("city", 80),
    state: req("state", 80),
    zip: z
      .string()
      .trim()
      .refine((v) => PIN.test(v), "Please enter a valid 6-digit PIN code."),
    country: req("country", 80),
    donationType: z.enum(DONATION_TYPES, { message: "Please choose a donation type." }),
    frequency: z.union([z.literal(""), z.enum(FREQUENCIES)]),
    occurrences: z.string().trim().optional(),
    amount: z
      .string()
      .trim()
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
