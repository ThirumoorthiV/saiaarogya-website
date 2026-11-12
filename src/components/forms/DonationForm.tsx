import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HeartHandshake, Lock } from "lucide-react";
import { siteSettings } from "@/content";
import { DONATION_TYPES, FREQUENCIES, PURPOSES, SALUTATIONS, donationSchema, type Donation, type DonationInput } from "@/lib/donation";
import { trackEvent } from "@/components/layout/Analytics";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Field, describedBy, inputClass } from "@/components/ui/Field";
import { cn } from "@/components/ui/cn";
import { FormError, FormSuccess } from "./FormStatus";
import { filtered } from "./filter";
import { clean, LIMITS } from "@/lib/fieldRules";

const inr = (v: string | number) => `₹${Number(v).toLocaleString("en-IN")}`;
const CHECKOUT_JS = "https://checkout.razorpay.com/v1/checkout.js";

/* Minimal typing for Razorpay Checkout (https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/) */
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open(): void;
  on(event: "payment.failed", cb: (r: { error?: { description?: string } }) => void): void;
}
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}
interface CreateResponse {
  keyId: string;
  orderId?: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  purpose: string;
  donor: { name: string; email: string; contact: string };
  error?: string;
}

let checkoutLoading: Promise<void> | null = null;
/** Load Razorpay Checkout only when the donor clicks Donate. */
function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  checkoutLoading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = CHECKOUT_JS;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      checkoutLoading = null;
      reject(new Error("Could not load Razorpay"));
    };
    document.head.appendChild(s);
  });
  return checkoutLoading;
}

type Status = { kind: "idle" } | { kind: "paid"; paymentId: string } | { kind: "error"; title: string } | { kind: "cancelled" };

/**
 * Donation form for Indian passport holders (§5.7), with the same fields as the current
 * website's form. Donate → /api/donations/create (Vercel Function: Razorpay Order or
 * Subscription with the form details in its notes) → Razorpay Checkout → signature check.
 * Razorpay's webhook then sends the details to Frappe (api/razorpay/webhook.ts).
 */
export function DonationForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [busy, setBusy] = useState(false);
  // DOB can't be in the future (set after hydration so the pre-rendered HTML matches)
  const [today, setToday] = useState<string | undefined>();
  useEffect(() => setToday(new Date().toLocaleDateString("en-CA")), []);
  const statusRef = useRef<HTMLDivElement>(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, submitCount },
  } = useForm<DonationInput, unknown, Donation>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      purpose: "Healthcare",
      salutation: "",
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      dob: "",
      pan: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
      donationType: "One time donation",
      frequency: "",
      occurrences: "",
      amount: "1000",
      terms: false,
    },
  });
  const [donationType, amount] = useWatch({ control, name: ["donationType", "amount"] });
  const recurring = donationType === "Recurring donations";
  const validAmount = /^\d+$/.test(amount ?? "") && Number(amount) >= 1;

  useEffect(() => {
    if (status.kind !== "idle") statusRef.current?.focus();
  }, [status]);

  const fail = (title: string) => {
    setBusy(false);
    setStatus({ kind: "error", title });
  };

  const onSubmit = async (d: Donation) => {
    setStatus({ kind: "idle" });
    setBusy(true);
    let order: CreateResponse;
    try {
      const res = await fetch("/api/donations/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
      order = (await res.json().catch(() => ({}))) as CreateResponse;
      if (!res.ok || (!order.orderId && !order.subscriptionId))
        return fail(res.status === 503 || res.status === 404 ? "Online donations are being set up." : (order.error ?? "We could not start the payment."));
      await loadCheckout();
    } catch {
      return fail("We could not start the payment.");
    }
    if (!window.Razorpay) return fail("We could not start the payment.");

    trackEvent("donation_checkout_open", { purpose: d.purpose, type: d.donationType });
    const rzp = new window.Razorpay({
      key: order.keyId,
      ...(order.orderId ? { order_id: order.orderId, amount: order.amount, currency: order.currency } : { subscription_id: order.subscriptionId }),
      name: "Sri Sathya Sai Sujala Sravanthi Trust",
      description: `Donation – ${order.purpose}`,
      image: `${window.location.origin}/images/logo-mark.png`,
      prefill: order.donor,
      theme: { color: "#7A0C0C" },
      modal: {
        ondismiss: () => {
          setBusy(false);
          setStatus({ kind: "cancelled" });
        },
      },
      handler: async (r: RazorpayResponse) => {
        try {
          const v = await fetch("/api/donations/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
          const ok = v.ok && ((await v.json()) as { ok?: boolean }).ok;
          setBusy(false);
          if (!ok) return fail("We could not confirm your payment.");
          trackEvent("donation_paid", { purpose: d.purpose, type: d.donationType });
          reset();
          setStatus({ kind: "paid", paymentId: r.razorpay_payment_id });
        } catch {
          fail("We could not confirm your payment.");
        }
      },
    });
    rzp.on("payment.failed", (r) => fail(r.error?.description ? `Payment failed: ${r.error.description}` : "The payment failed."));
    rzp.open();
  };

  if (status.kind === "paid") {
    return (
      <FormSuccess
        ref={statusRef}
        title="Thank you for your generosity!"
        text={`Your donation was received (payment ID ${status.paymentId}). The Trust will email your receipt. For any questions, call ${siteSettings.donation.contactPhone}.`}
        resetLabel="Make another donation"
        onReset={() => setStatus({ kind: "idle" })}
      />
    );
  }

  type TextName = "firstName" | "lastName" | "email" | "mobile" | "dob" | "pan" | "address" | "city" | "state" | "zip" | "country" | "occurrences";
  const input = (
    id: string,
    name: TextName,
    label: string,
    opts: {
      type?: string;
      autoComplete?: string;
      inputMode?: "numeric" | "tel" | "email" | "text";
      placeholder?: string;
      required?: boolean;
      className?: string;
      maxLength?: number;
      filter?: (v: string) => string;
      max?: string;
    } = {},
  ) => {
    const err = errors[name]?.message;
    const required = opts.required ?? true;
    return (
      <Field id={id} label={label} required={required} optional={!required} error={err}>
        <input
          id={id}
          type={opts.type ?? "text"}
          autoComplete={opts.autoComplete}
          inputMode={opts.inputMode}
          placeholder={opts.placeholder}
          maxLength={opts.maxLength}
          max={opts.max}
          className={cn(inputClass(!!err), opts.className)}
          aria-required={required || undefined}
          aria-invalid={!!err}
          aria-describedby={describedBy(id, false, !!err)}
          {...(opts.filter ? filtered(register(name), opts.filter) : register(name))}
        />
      </Field>
    );
  };

  const select = (id: string, name: "purpose" | "salutation" | "donationType" | "frequency", label: string, options: readonly string[], required = true, placeholder?: string) => {
    const err = errors[name]?.message;
    return (
      <Field id={id} label={label} required={required} error={err}>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Select
              id={id}
              labelId={`${id}-label`}
              name={name}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={options.map((o) => ({ value: o, label: o }))}
              placeholder={placeholder}
              required={required}
              invalid={!!err}
              describedBy={describedBy(id, false, !!err)}
            />
          )}
        />
      </Field>
    );
  };

  const hasErrors = Object.keys(errors).length > 0;
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <noscript>
        <p className="rounded-2xl bg-maroon-50 px-4 py-3 text-sm text-maroon-900">Please enable JavaScript to donate online, or contact the Trust using the details on this page.</p>
      </noscript>
      {status.kind === "error" && <FormError ref={statusRef} title={status.title} />}
      {status.kind === "cancelled" && (
        <p ref={statusRef} tabIndex={-1} role="status" className="rounded-2xl bg-ink-100 px-4 py-3 text-ink-900 outline-none">
          Payment cancelled. Your details are still filled in. Press Donate to try again.
        </p>
      )}
      {hasErrors && submitCount > 0 && (
        <p role="alert" className="font-medium text-alert-700">
          Please correct the highlighted fields.
        </p>
      )}

      {select("don-purpose", "purpose", "Donation Purpose", PURPOSES)}
      {select("don-salutation", "salutation", "Salutation", SALUTATIONS, false, "Select")}
      <div className="grid items-start gap-5 sm:grid-cols-2">
        {input("don-first", "firstName", "First name", { autoComplete: "given-name", maxLength: LIMITS.name, filter: (v) => clean.name(v) })}
        {input("don-last", "lastName", "Last name", { autoComplete: "family-name", maxLength: LIMITS.name, filter: (v) => clean.name(v) })}
      </div>
      <div className="grid items-start gap-5 sm:grid-cols-2">
        {input("don-email", "email", "Email", { type: "email", autoComplete: "email", maxLength: LIMITS.email, filter: clean.email })}
        {input("don-mobile", "mobile", "Mobile", { type: "tel", inputMode: "numeric", autoComplete: "tel-national", placeholder: "9876543210", filter: clean.mobile })}
      </div>
      <div className="grid items-start gap-5 sm:grid-cols-2">
        {input("don-dob", "dob", "DOB", { type: "date", autoComplete: "bday", required: false, max: today })}
        {input("don-pan", "pan", "PAN", { autoComplete: "off", placeholder: "ABCDE1234F", className: "uppercase", maxLength: LIMITS.pan, filter: clean.pan })}
      </div>
      {input("don-address", "address", "Address", { autoComplete: "street-address", maxLength: LIMITS.address, filter: clean.text(LIMITS.address) })}
      <div className="grid items-start gap-5 sm:grid-cols-2">
        {input("don-city", "city", "City", { autoComplete: "address-level2", maxLength: LIMITS.place, filter: clean.place })}
        {input("don-state", "state", "State", { autoComplete: "address-level1", maxLength: LIMITS.place, filter: clean.place })}
      </div>
      <div className="grid items-start gap-5 sm:grid-cols-2">
        {input("don-zip", "zip", "Zip/Postal Code", { inputMode: "numeric", autoComplete: "postal-code", placeholder: "522329", maxLength: LIMITS.pin, filter: clean.digits(LIMITS.pin) })}
        {input("don-country", "country", "Country", { autoComplete: "country-name", maxLength: LIMITS.place, filter: clean.place })}
      </div>
      {select("don-type", "donationType", "Donation Type", DONATION_TYPES)}
      {recurring && (
        <div className="grid items-start gap-5 rounded-2xl bg-maroon-50 p-4 sm:grid-cols-2">
          {select("don-frequency", "frequency", "Frequency", FREQUENCIES, true, "Select")}
          {input("don-occ", "occurrences", "No of occurrence", { inputMode: "numeric", placeholder: "e.g. 12", maxLength: LIMITS.occurrences, filter: clean.digits(LIMITS.occurrences) })}
        </div>
      )}

      <Field id="don-amount" label="Enter the amount you wish to pay:" required error={errors.amount?.message}>
        <div className="relative">
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-semibold text-ink-600">
            ₹
          </span>
          <input
            id="don-amount"
            inputMode="numeric"
            className={cn(inputClass(!!errors.amount), "pl-9 text-lg font-semibold")}
            aria-required="true"
            aria-invalid={!!errors.amount}
            aria-describedby={describedBy("don-amount", false, !!errors.amount)}
            maxLength={LIMITS.amount}
            {...filtered(register("amount"), clean.rupees)}
          />
        </div>
      </Field>

      <div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-ink-200 bg-white p-4 hover:bg-maroon-50">
          <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0" aria-invalid={!!errors.terms} aria-describedby={errors.terms ? "don-terms-error" : undefined} {...register("terms")} />
          <span className="text-[15px] text-ink-900">
            I agree to the terms &amp; conditions
            <span className="text-alert-700" aria-hidden>
              {" "}
              *
            </span>
          </span>
        </label>
        {errors.terms && (
          <p id="don-terms-error" className="mt-1.5 text-sm font-medium text-alert-700">
            {errors.terms.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={busy} icon={<HeartHandshake className="h-5 w-5" aria-hidden />} className="w-full">
        {busy ? "Opening secure payment…" : validAmount ? `Donate ${inr(amount ?? 0)}` : "Donate"}
      </Button>
      <p className="flex items-center justify-center gap-2 text-sm text-ink-600">
        <Lock className="h-4 w-4" aria-hidden />
        Secure payment by Razorpay · UPI, cards and netbanking
      </p>
    </form>
  );
}
