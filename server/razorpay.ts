/**
 * Server-only helpers for the donation functions. Secrets come from Vercel environment
 * variables (Project → Settings → Environment Variables) and never reach the browser:
 *   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET   — Dashboard → Account & Settings → API keys
 *   RAZORPAY_WEBHOOK_SECRET                — Dashboard → Webhooks (the secret you set there)
 *   FRAPPE_WEBHOOK_URL                     — the Frappe endpoint that records donations
 *   FRAPPE_WEBHOOK_AUTH (optional)         — sent as the Authorization header, e.g. "token key:secret"
 *   ALLOWED_ORIGINS (optional)             — comma-separated origins allowed to create orders
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const env = (name: string) => process.env[name] ?? "";

export const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

/** Constant-time check of a hex HMAC-SHA256 signature. */
export function verifySignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export const razorpayConfigured = () => Boolean(env("RAZORPAY_KEY_ID") && env("RAZORPAY_KEY_SECRET"));

/** Call the Razorpay REST API with basic auth. Throws with Razorpay's error description on failure. */
export async function razorpay<T>(path: string, body: unknown): Promise<T> {
  const auth = Buffer.from(`${env("RAZORPAY_KEY_ID")}:${env("RAZORPAY_KEY_SECRET")}`).toString("base64");
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: { description?: string } };
  if (!res.ok) throw new Error(data.error?.description ?? `Razorpay ${path} failed (${res.status})`);
  return data;
}

/** Reject cross-site order creation when ALLOWED_ORIGINS is set. */
export function originAllowed(req: Request): boolean {
  const allowed = env("ALLOWED_ORIGINS")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!allowed.length) return true;
  const origin = req.headers.get("origin");
  return !origin || allowed.includes(origin);
}
