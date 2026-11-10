/**
 * POST /api/donations/verify
 * Checks the signature Razorpay Checkout returns to the browser, so the thank-you message is
 * only shown for a genuine payment. Recording the donation in Frappe is done by the webhook
 * (razorpay-webhook.ts), which also covers donors who close the tab after paying.
 */
import { env, json, verifySignature } from "../lib/razorpay";

export const config = { path: "/api/donations/verify" };

interface Body {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature?: string;
}

export default async (req: Request) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });
  const b = ((await req.json().catch(() => ({}))) ?? {}) as Body;
  const secret = env("RAZORPAY_KEY_SECRET");
  if (!b.razorpay_payment_id || !b.razorpay_signature) return json(400, { ok: false });

  // Orders sign "order_id|payment_id"; subscriptions sign "payment_id|subscription_id".
  const signed = b.razorpay_order_id ? `${b.razorpay_order_id}|${b.razorpay_payment_id}` : b.razorpay_subscription_id ? `${b.razorpay_payment_id}|${b.razorpay_subscription_id}` : "";
  const ok = Boolean(signed) && verifySignature(signed, b.razorpay_signature, secret);
  return json(ok ? 200 : 400, { ok, paymentId: ok ? b.razorpay_payment_id : undefined });
};
