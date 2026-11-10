/**
 * POST /api/razorpay/webhook   (set this URL in Razorpay Dashboard → Webhooks)
 * Events: order.paid (one-time) and subscription.charged (each recurring instalment).
 *
 * Verifies X-Razorpay-Signature, then forwards the donor's form details (from the Razorpay
 * notes) plus the donation amount to the Frappe webhook: the 12 Frappe keys + amount.
 * Frappe is called once per successful payment. If Frappe fails we return 502 so
 * Razorpay retries the webhook later (Razorpay retries only when we do not return 2xx).
 */
import { toFrappePayload, type RazorpayPayment } from "../../src/lib/donation";
import { env, json, verifySignature } from "../lib/razorpay";

export const config = { path: "/api/razorpay/webhook" };

interface Event {
  event: string;
  payload: {
    payment?: { entity: RazorpayPayment & { notes?: Record<string, string> } };
    order?: { entity: { id: string; notes?: Record<string, string> } };
    subscription?: { entity: { id: string; notes?: Record<string, string> } };
  };
}

export default async (req: Request) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });
  const raw = await req.text(); // the signature is over the raw body — do not re-serialise
  if (!verifySignature(raw, req.headers.get("x-razorpay-signature"), env("RAZORPAY_WEBHOOK_SECRET"))) {
    return json(401, { error: "Invalid signature" });
  }

  const evt = JSON.parse(raw) as Event;
  const payment = evt.payload.payment?.entity;
  let notes: Record<string, string> | undefined;
  if (evt.event === "order.paid") notes = evt.payload.order?.entity.notes;
  else if (evt.event === "subscription.charged") notes = evt.payload.subscription?.entity.notes;
  else return json(200, { ignored: evt.event });

  if (!payment || !notes?.pan_card) return json(200, { ignored: "not a website donation" });

  const url = env("FRAPPE_WEBHOOK_URL");
  if (!url) {
    console.error("razorpay-webhook: FRAPPE_WEBHOOK_URL is not set");
    return json(500, { error: "Frappe not configured" });
  }
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (env("FRAPPE_WEBHOOK_AUTH")) headers.Authorization = env("FRAPPE_WEBHOOK_AUTH");

  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(toFrappePayload(notes, payment)) }).catch((e: unknown) => {
    console.error("razorpay-webhook: Frappe request failed", e);
    return null;
  });
  if (!res || !res.ok) {
    console.error("razorpay-webhook: Frappe responded", res?.status, await res?.text().catch(() => ""));
    return json(502, { error: "Frappe did not accept the donation" });
  }
  return json(200, { ok: true, payment: payment.id });
};
