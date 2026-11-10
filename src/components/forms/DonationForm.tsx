import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HeartHandshake } from "lucide-react";
import { siteSettings } from "@/content";
import { SITE_URL } from "@/lib/staticPaths";
import { formsConfigured, submitToWeb3Forms, WEB3FORMS_ENDPOINT, WEB3FORMS_KEY } from "@/lib/web3forms";
import { trackEvent } from "@/components/layout/Analytics";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Field, describedBy, inputClass } from "@/components/ui/Field";
import { cn } from "@/components/ui/cn";
import { INDIAN_PHONE, normalizePhone } from "./EnquiryForm";
import { FormError, FormSuccess } from "./FormStatus";

/* Field options copied from the donation form on the current website (/donateus). */
export const PURPOSES = ["Healthcare", "Social Welfare", "Education", "Surgery Gap Funding", "Nutrition"] as const;
export const SALUTATIONS = ["Mr", "Mrs", "Ms", "M/s"] as const;
export const DONATION_TYPES = ["One time donation", "Recurring donations"] as const;
export const FREQUENCIES = ["Weekly", "Monthly", "Quarterly", "Yearly"] as const;

const PAN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const PIN = /^[1-9][0-9]{5}$/;
const inr = (v: string | number) => `₹${Number(v).toLocaleString("en-IN")}`;
const req = (label: string) => z.string().trim().min(1, `Please enter your ${label}.`);

const schema = z
  .object({
    purpose: z.enum(PURPOSES, { message: "Please choose a donation purpose." }),
    salutation: z.union([z.literal(""), z.enum(SALUTATIONS)]),
    firstName: req("first name").max(60),
    lastName: req("last name").max(60),
    email: z.string().trim().email("Please enter a valid email address."),
    mobile: z
      .string()
      .transform(normalizePhone)
      .refine((v) => INDIAN_PHONE.test(v), "Please enter a valid 10-digit Indian mobile number."),
    dob: z.string().optional(),
    pan: z
      .string()
      .trim()
      .transform((v) => v.toUpperCase())
      .refine((v) => PAN.test(v), "Please enter a valid PAN, e.g. ABCDE1234F."),
    address: req("address").max(300),
    city: req("city").max(80),
    state: req("state").max(80),
    zip: z
      .string()
      .trim()
      .refine((v) => PIN.test(v), "Please enter a valid 6-digit PIN code."),
    country: req("country").max(80),
    donationType: z.enum(DONATION_TYPES, { message: "Please choose a donation type." }),
    frequency: z.union([z.literal(""), z.enum(FREQUENCIES)]),
    occurrences: z.string().trim().optional(),
    amount: z
      .string()
      .trim()
      .refine((v) => /^\d+$/.test(v) && Number(v) >= 1, "Please enter the amount in rupees."),
    terms: z.boolean().refine((v) => v, "Please agree to the terms & conditions."),
    botcheck: z.boolean().optional(),
  })
  .superRefine((d, ctx) => {
    if (d.donationType !== "Recurring donations") return;
    if (!d.frequency) ctx.addIssue({ code: "custom", path: ["frequency"], message: "Please choose how often." });
    const n = Number(d.occurrences);
    if (!Number.isInteger(n) || n < 1 || n > 120) ctx.addIssue({ code: "custom", path: ["occurrences"], message: "Please enter the number of occurrences (1–120)." });
  });
type In = z.input<typeof schema>;
type Out = z.output<typeof schema>;

/**
 * Donation form for Indian passport holders (§5.7), with the same fields as the
 * current website's form. Until an online payment gateway is connected, the
 * details are sent to the Trust via Web3Forms and the Trust follows up.
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
      botcheck: false,
    },
  });
  const [donationType, amount] = useWatch({ control, name: ["donationType", "amount"] });
  const recurring = donationType === "Recurring donations";
  const validAmount = /^\d+$/.test(amount ?? "") && Number(amount) >= 1;

  useEffect(() => {
    if (status !== "idle") statusRef.current?.focus();
  }, [status]);

  const onSubmit = async (d: Out) => {
    const name = [d.salutation, d.firstName, d.lastName].filter(Boolean).join(" ");
    const res = await submitToWeb3Forms(
      `Donation: ${inr(d.amount)} — ${d.purpose} — ${name}`,
      {
        donation_purpose: d.purpose,
        salutation: d.salutation || "—",
        first_name: d.firstName,
        last_name: d.lastName,
        email: d.email,
        mobile: d.mobile,
        dob: d.dob || "—",
        pan: d.pan,
        address: d.address,
        city: d.city,
        state: d.state,
        zip: d.zip,
        country: d.country,
        donation_type: d.donationType,
        frequency: recurring ? d.frequency : "—",
        no_of_occurrence: recurring ? (d.occurrences ?? "") : "—",
        amount: inr(d.amount),
        terms_accepted: "Yes",
        page: path,
      },
      Boolean(d.botcheck),
    );
    if (res.ok) {
      trackEvent("form_submit", { form: "donation", purpose: d.purpose, type: d.donationType });
      reset();
      setStatus("sent");
    } else setStatus("error");
  };

  if (status === "sent") {
    return (
      <FormSuccess
        ref={statusRef}
        title="Thank you for your generosity!"
        text={`The Trust will contact you with the payment details and your receipt. For any questions, call ${siteSettings.phoneDisplay}.`}
        onReset={() => setStatus("idle")}
      />
    );
  }

  type TextName = "firstName" | "lastName" | "email" | "mobile" | "dob" | "pan" | "address" | "city" | "state" | "zip" | "country" | "occurrences";
  const input = (
    id: string,
    name: TextName,
    label: string,
    opts: { type?: string; autoComplete?: string; inputMode?: "numeric" | "tel" | "email" | "text"; placeholder?: string; required?: boolean; className?: string; maxLength?: number } = {},
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
          className={cn(inputClass(!!err), opts.className)}
          aria-required={required || undefined}
          aria-invalid={!!err}
          aria-describedby={describedBy(id, false, !!err)}
          {...register(name)}
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
    <form action={WEB3FORMS_ENDPOINT} method="POST" noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

      {select("don-purpose", "purpose", "Donation Purpose", PURPOSES)}
      {select("don-salutation", "salutation", "Salutation", SALUTATIONS, false, "Select")}
      <div className="grid items-start gap-5 sm:grid-cols-2">
        {input("don-first", "firstName", "First name", { autoComplete: "given-name" })}
        {input("don-last", "lastName", "Last name", { autoComplete: "family-name" })}
      </div>
      <div className="grid items-start gap-5 sm:grid-cols-2">
        {input("don-email", "email", "Email", { type: "email", autoComplete: "email" })}
        {input("don-mobile", "mobile", "Mobile", { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "98765 43210" })}
      </div>
      <div className="grid items-start gap-5 sm:grid-cols-2">
        {input("don-dob", "dob", "DOB", { type: "date", autoComplete: "bday", required: false })}
        {input("don-pan", "pan", "PAN", { autoComplete: "off", placeholder: "ABCDE1234F", className: "uppercase", maxLength: 10 })}
      </div>
      {input("don-address", "address", "Address", { autoComplete: "street-address" })}
      <div className="grid items-start gap-5 sm:grid-cols-2">
        {input("don-city", "city", "City", { autoComplete: "address-level2" })}
        {input("don-state", "state", "State", { autoComplete: "address-level1" })}
      </div>
      <div className="grid items-start gap-5 sm:grid-cols-2">
        {input("don-zip", "zip", "Zip/Postal Code", { inputMode: "numeric", autoComplete: "postal-code", placeholder: "522329", maxLength: 6 })}
        {input("don-country", "country", "Country", { autoComplete: "country-name" })}
      </div>
      {select("don-type", "donationType", "Donation Type", DONATION_TYPES)}
      {recurring && (
        <div className="grid items-start gap-5 rounded-2xl bg-maroon-50 p-4 sm:grid-cols-2">
          {select("don-frequency", "frequency", "Frequency", FREQUENCIES, true, "Select")}
          {input("don-occ", "occurrences", "No of occurrence", { type: "number", inputMode: "numeric", placeholder: "e.g. 12" })}
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
            {...register("amount")}
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

      <input type="checkbox" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("botcheck")} />
      <Button type="submit" size="lg" disabled={isSubmitting} icon={<HeartHandshake className="h-5 w-5" aria-hidden />} className="w-full">
        {isSubmitting ? "Sending…" : validAmount ? `Donate ${inr(amount ?? 0)}` : "Donate"}
      </Button>
    </form>
  );
}
