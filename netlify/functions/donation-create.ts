/**
 * POST /api/donations/create
 * Validates the Donate form and creates a Razorpay Order (one-time) or Plan + Subscription
 * (recurring). The form details travel in the Razorpay `notes`, so the webhook can forward
 * them to Frappe after payment. Returns what the browser needs to open Razorpay Checkout.
 */
import { donationSchema, isRecurring, PLAN_PERIOD, toRazorpayNotes, type Frequency } from "../../src/lib/donation";
import { env, json, originAllowed, razorpay, razorpayConfigured } from "../lib/razorpay";

export const config = { path: "/api/donations/create" };

export default async (req: Request) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });
  if (!originAllowed(req)) return json(403, { error: "Forbidden" });
  if (!razorpayConfigured()) return json(503, { error: "Online donations are not set up yet." });

  const parsed = donationSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json(400, { error: "Please check the form.", fields: parsed.error.issues.map((i) => i.path.join(".")) });

  const d = parsed.data;
  const amount = Number(d.amount) * 100; // paise
  const notes = toRazorpayNotes(d);
  const receipt = `DON-${Date.now().toString(36).toUpperCase()}`;
  const donor = { name: [d.salutation, d.firstName, d.lastName].filter(Boolean).join(" "), email: d.email, contact: d.mobile };

  try {
    if (isRecurring(d)) {
      const { period, interval } = PLAN_PERIOD[d.frequency as Frequency];
      const plan = await razorpay<{ id: string }>("/plans", {
        period,
        interval,
        item: { name: `Donation – ${d.purpose} (${d.frequency})`, amount, currency: "INR" },
        notes: { donation_purpose: d.purpose },
      });
      const sub = await razorpay<{ id: string }>("/subscriptions", {
        plan_id: plan.id,
        total_count: Number(d.occurrences),
        customer_notify: 1,
        notes,
      });
      return json(200, { keyId: env("RAZORPAY_KEY_ID"), subscriptionId: sub.id, amount, currency: "INR", purpose: d.purpose, donor });
    }
    const order = await razorpay<{ id: string }>("/orders", { amount, currency: "INR", receipt, notes });
    return json(200, { keyId: env("RAZORPAY_KEY_ID"), orderId: order.id, amount, currency: "INR", purpose: d.purpose, donor });
  } catch (e) {
    console.error("donation-create", e);
    return json(502, { error: "We could not start the payment. Please try again in a moment." });
  }
};
