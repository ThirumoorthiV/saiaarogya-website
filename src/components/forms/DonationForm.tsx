import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HeartHandshake, Lock } from "lucide-react";
import { siteSettings } from "@/content";
import { SITE_URL } from "@/lib/staticPaths";
import { formsConfigured, submitToWeb3Forms, WEB3FORMS_ENDPOINT, WEB3FORMS_KEY } from "@/lib/web3forms";
import { trackEvent } from "@/components/layout/Analytics";
import { Button } from "@/components/ui/Button";
import { Field, describedBy, inputClass } from "@/components/ui/Field";
import { cn } from "@/components/ui/cn";
import { INDIAN_PHONE, normalizePhone } from "./EnquiryForm";
import { FormError, FormSuccess } from "./FormStatus";

/** Same options as the donation widget on the current website. */
export const FREQUENCIES = ["One time", "Weekly", "Monthly", "Yearly"] as const;
export const AMOUNTS = ["500", "1000", "5000", "10000", "25000", "50000", "other"] as const;

const inr = (v: string | number) => `₹${Number(v).toLocaleString("en-IN")}`;
const PAN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const schema = z
  .object({
    frequency: z.enum(FREQUENCIES),
    amount: z.enum(AMOUNTS),
    otherAmount: z.string().trim().optional(),
    name: z.string().trim().min(2, "Please enter your full name.").max(100),
    email: z.string().trim().email("Please enter a valid email address."),
    phone: z
      .string()
      .transform(normalizePhone)
      .refine((v) => INDIAN_PHONE.test(v), "Please enter a valid 10-digit Indian mobile number."),
    pan: z
      .string()
      .trim()
      .transform((v) => v.toUpperCase())
      .refine((v) => v === "" || PAN.test(v), "Please enter a valid PAN (e.g. ABCDE1234F), or leave it empty."),
    address: z.string().trim().max(300).optional(),
    message: z.string().trim().max(1000).optional(),
    indian: z.boolean().refine((v) => v, "Please confirm that you hold an Indian passport."),
    botcheck: z.boolean().optional(),
  })
  .superRefine((d, ctx) => {
    if (d.amount === "other") {
      const n = Number(d.otherAmount);
      if (!d.otherAmount || !Number.isFinite(n) || n < 100) ctx.addIssue({ code: "custom", path: ["otherAmount"], message: "Please enter an amount of ₹100 or more." });
    }
  });
type In = z.input<typeof schema>;
type Out = z.output<typeof schema>;

// The radio is visually hidden; the span after it (peer) shows the chip and its keyboard focus ring.
const chip = (checked: boolean) =>
  cn(
    "flex min-h-12 w-full cursor-pointer items-center justify-center rounded-2xl border px-3 text-center text-[15px] font-semibold transition-colors",
    "peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-maroon-700",
    checked ? "border-maroon-700 bg-maroon-700 text-white" : "border-ink-200 bg-white text-ink-900 hover:border-maroon-300 hover:bg-maroon-100",
  );

/**
 * Donation form for Indian donors (§5.7). The frequency and amount options match
 * the current website's donation widget. Until an online payment link is set up,
 * the details are sent to the Trust via Web3Forms and the Trust follows up with payment details.
 */
export function DonationForm() {
  const path = "/support-us/donate/";
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const statusRef = useRef<HTMLDivElement>(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<In, unknown, Out>({
    resolver: zodResolver(schema),
    defaultValues: { frequency: "One time", amount: "500", otherAmount: "", name: "", email: "", phone: "", pan: "", address: "", message: "", indian: false, botcheck: false },
  });
  const [frequency, amount, otherAmount] = useWatch({ control, name: ["frequency", "amount", "otherAmount"] });
  const total = amount === "other" ? (Number(otherAmount) >= 1 ? inr(otherAmount ?? 0) : "") : inr(amount ?? 0);

  useEffect(() => {
    if (status !== "idle") statusRef.current?.focus();
  }, [status]);

  const onSubmit = async (d: Out) => {
    const value = d.amount === "other" ? (d.otherAmount ?? "") : d.amount;
    const res = await submitToWeb3Forms(
      `Donation: ${inr(value)} (${d.frequency}) — ${d.name}`,
      {
        frequency: d.frequency,
        amount: inr(value),
        name: d.name,
        email: d.email,
        phone: d.phone,
        pan: d.pan || "—",
        address: d.address || "—",
        message: d.message || "—",
        indian_passport_holder: "Yes",
        page: path,
      },
      Boolean(d.botcheck),
    );
    if (res.ok) {
      trackEvent("form_submit", { form: "donation", frequency: d.frequency });
      reset();
      setStatus("sent");
    } else setStatus("error");
  };

  if (status === "sent") {
    return (
      <FormSuccess
        ref={statusRef}
        title="Thank you for your generosity!"
        text={`The Trust will email you the payment details and your receipt. For any questions, call ${siteSettings.phoneDisplay}.`}
        onReset={() => setStatus("idle")}
      />
    );
  }

  const hasErrors = Object.keys(errors).length > 0;
  return (
    <form action={WEB3FORMS_ENDPOINT} method="POST" noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-describedby="don-note">
      <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
      <input type="hidden" name="subject" value="Donation" />
      <input type="hidden" name="redirect" value={`${SITE_URL}${path}?sent=1`} />

      {!formsConfigured && <p className="rounded-2xl bg-maroon-50 px-4 py-3 text-sm text-maroon-900">Online donations are being set up. Please call or email us in the meantime.</p>}
      {status === "error" && <FormError ref={statusRef} />}
      {hasErrors && submitCount > 0 && (
        <p role="alert" className="font-medium text-alert-700">
          Please correct the highlighted fields.
        </p>
      )}

      <fieldset>
        <legend className="mb-2 text-[15px] font-semibold text-ink-900">Frequency</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FREQUENCIES.map((f) => (
            <label key={f} className="flex">
              <input type="radio" value={f} className="peer sr-only" {...register("frequency")} />
              <span className={chip(frequency === f)}>{f}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset aria-describedby={errors.otherAmount ? "don-other-error" : undefined}>
        <legend className="mb-2 text-[15px] font-semibold text-ink-900">Amount</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {AMOUNTS.map((a) => (
            <label key={a} className="flex">
              <input type="radio" value={a} className="peer sr-only" {...register("amount")} />
              <span className={chip(amount === a)}>{a === "other" ? "Other" : inr(a)}</span>
            </label>
          ))}
        </div>
        {amount === "other" && (
          <div className="mt-3">
            <Field id="don-other" label="Enter amount (₹)" required error={errors.otherAmount?.message}>
              <input
                id="don-other"
                type="number"
                inputMode="numeric"
                min={100}
                step={1}
                placeholder="e.g. 2000"
                className={inputClass(!!errors.otherAmount)}
                aria-required="true"
                aria-invalid={!!errors.otherAmount}
                aria-describedby={describedBy("don-other", false, !!errors.otherAmount)}
                {...register("otherAmount")}
              />
            </Field>
          </div>
        )}
      </fieldset>

      <div className="border-t border-ink-200/70 pt-6">
        <p className="mb-4 font-heading text-lg font-bold text-ink-900">Your details</p>
        <div className="space-y-5">
          <Field id="don-name" label="Full name" required hint="As it should appear on the receipt" error={errors.name?.message}>
            <input
              id="don-name"
              autoComplete="name"
              className={inputClass(!!errors.name)}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={describedBy("don-name", true, !!errors.name)}
              {...register("name")}
            />
          </Field>
          <div className="grid items-start gap-5 sm:grid-cols-2">
            <Field id="don-email" label="Email" required error={errors.email?.message}>
              <input
                id="don-email"
                type="email"
                autoComplete="email"
                className={inputClass(!!errors.email)}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={describedBy("don-email", false, !!errors.email)}
                {...register("email")}
              />
            </Field>
            <Field id="don-phone" label="Phone number" required error={errors.phone?.message}>
              <input
                id="don-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="98765 43210"
                className={inputClass(!!errors.phone)}
                aria-required="true"
                aria-invalid={!!errors.phone}
                aria-describedby={describedBy("don-phone", false, !!errors.phone)}
                {...register("phone")}
              />
            </Field>
          </div>
          <Field id="don-pan" label="PAN" optional hint="Needed for an 80G tax-exemption receipt" error={errors.pan?.message}>
            <input
              id="don-pan"
              autoComplete="off"
              placeholder="ABCDE1234F"
              maxLength={10}
              className={cn(inputClass(!!errors.pan), "uppercase")}
              aria-invalid={!!errors.pan}
              aria-describedby={describedBy("don-pan", true, !!errors.pan)}
              {...register("pan")}
            />
          </Field>
          <Field id="don-address" label="Address" optional hint="For the donation receipt">
            <textarea id="don-address" rows={2} autoComplete="street-address" className={inputClass(false)} aria-describedby="don-address-hint" {...register("address")} />
          </Field>
          <Field id="don-message" label="Message" optional>
            <textarea id="don-message" rows={3} className={inputClass(false)} {...register("message")} />
          </Field>
        </div>
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-ink-200 bg-white p-4 hover:bg-maroon-50">
          <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0" aria-invalid={!!errors.indian} aria-describedby={errors.indian ? "don-indian-error" : undefined} {...register("indian")} />
          <span className="text-[15px] text-ink-900">
            I confirm that I am an Indian passport holder.{" "}
            <span className="text-alert-700" aria-hidden>
              *
            </span>
          </span>
        </label>
        {errors.indian && (
          <p id="don-indian-error" className="mt-1.5 text-sm font-medium text-alert-700">
            {errors.indian.message}
          </p>
        )}
      </div>

      <input type="checkbox" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("botcheck")} />
      <p id="don-note" className="flex gap-2 rounded-2xl bg-ink-100 px-4 py-3 text-sm text-ink-700">
        <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        You agree to share the information entered here with the Sri Sathya Sai Sujala Sravanthi Trust, which runs the hospital, in line with applicable laws.
      </p>
      <Button type="submit" size="lg" disabled={isSubmitting} icon={<HeartHandshake className="h-5 w-5" aria-hidden />} className="w-full">
        {isSubmitting ? "Sending…" : `Donate ${total}${frequency !== "One time" ? ` ${frequency.toLowerCase()}` : ""}`.trim()}
      </Button>
    </form>
  );
}
