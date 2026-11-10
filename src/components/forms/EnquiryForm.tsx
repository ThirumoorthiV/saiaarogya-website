import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { siteSettings } from "@/content";
import { SITE_URL } from "@/lib/staticPaths";
import { formsConfigured, submitToWeb3Forms, WEB3FORMS_ENDPOINT, WEB3FORMS_KEY } from "@/lib/web3forms";
import { trackEvent } from "@/components/layout/Analytics";
import { Button } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";
import { Select } from "@/components/ui/Select";
import { Field, describedBy, inputClass } from "@/components/ui/Field";
import { FormError, FormSuccess } from "./FormStatus";

export const REASONS = [
  { value: "patient", label: "Patient enquiry" },
  { value: "donation", label: "Donation" },
  { value: "volunteer", label: "Volunteer" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
] as const;
export type Reason = (typeof REASONS)[number]["value"];

/** Indian mobile: optional +91 / 91 / 0 prefix, then 10 digits starting 6–9. */
export const INDIAN_PHONE = /^(?:\+?91|0)?[6-9]\d{9}$/;
export const normalizePhone = (v: string) => v.replace(/[\s()-]/g, "");
const noopSubscribe = () => () => {};

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  phone: z
    .string()
    .transform(normalizePhone)
    .refine((v) => INDIAN_PHONE.test(v), "Please enter a valid 10-digit Indian mobile number."),
  email: z.union([z.literal(""), z.string().trim().email("Please enter a valid email address, or leave it empty.")]),
  reason: z.enum(REASONS.map((r) => r.value) as [Reason, ...Reason[]], { message: "Please choose a reason." }),
  message: z.string().trim().min(10, "Please write a short message (at least 10 characters).").max(2000),
  botcheck: z.boolean().optional(),
});
type In = z.input<typeof schema>;
type Out = z.output<typeof schema>;

/**
 * Contact enquiry form (§5.8): required name, phone, reason, message; email
 * optional; Indian phone validation; success message. Sent via Web3Forms.
 * Honeypot spam protection (§8). Also posts without JavaScript.
 */
export function EnquiryForm({ defaultReason, pagePath = "/contact/" }: { defaultReason?: Reason; pagePath?: string }) {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const statusRef = useRef<HTMLDivElement>(null);
  const sentViaRedirect = useSyncExternalStore(noopSubscribe, () => new URLSearchParams(window.location.search).get("sent") === "1", () => false);
  const [redirectDismissed, setRedirectDismissed] = useState(false);
  const shown = status === "idle" && sentViaRedirect && !redirectDismissed ? "sent" : status;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<In, unknown, Out>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", reason: (defaultReason ?? "") as Reason, message: "", botcheck: false },
  });

  useEffect(() => {
    if (shown !== "idle") statusRef.current?.focus();
  }, [shown]);

  const onSubmit = async (data: Out) => {
    const { botcheck, ...fields } = data;
    const reasonLabel = REASONS.find((r) => r.value === data.reason)?.label ?? data.reason;
    const res = await submitToWeb3Forms(`Website enquiry: ${reasonLabel} — ${data.name}`, { ...fields, reason: reasonLabel, page: pagePath }, Boolean(botcheck));
    if (res.ok) {
      trackEvent("form_submit", { form: "enquiry", reason: data.reason });
      reset();
      setStatus("sent");
    } else setStatus("error");
  };

  if (shown === "sent") {
    return (
      <FormSuccess
        ref={statusRef}
        title="Thank you — your message has been sent."
        text={`Our team will get back to you soon. For anything urgent, please call ${siteSettings.phoneDisplay}.`}
        onReset={() => {
          setRedirectDismissed(true);
          setStatus("idle");
        }}
      />
    );
  }

  const hasErrors = Object.keys(errors).length > 0;
  return (
    <form action={WEB3FORMS_ENDPOINT} method="POST" noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-describedby="enq-note">
      <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
      <input type="hidden" name="subject" value="Website enquiry" />
      <input type="hidden" name="redirect" value={`${SITE_URL}${pagePath}?sent=1`} />

      {!formsConfigured && (
        <Todo id="form-access-key">
          Form not connected yet — set <code>VITE_WEB3FORMS_ACCESS_KEY</code>. Messages cannot be sent until then.
        </Todo>
      )}
      {status === "error" && <FormError ref={statusRef} />}
      {hasErrors && submitCount > 0 && (
        <p role="alert" className="font-medium text-alert-700">
          Please correct the highlighted fields.
        </p>
      )}

      <Field id="enq-name" label="Your name" required error={errors.name?.message}>
        <input id="enq-name" autoComplete="name" className={inputClass(!!errors.name)} aria-required="true" aria-invalid={!!errors.name} aria-describedby={describedBy("enq-name", false, !!errors.name)} {...register("name")} />
      </Field>
      <div className="grid items-start gap-5 sm:grid-cols-2">
        <Field id="enq-phone" label="Phone number" required hint="10-digit Indian mobile number" error={errors.phone?.message}>
          <input
            id="enq-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            className={inputClass(!!errors.phone)}
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("enq-phone", true, !!errors.phone)}
            {...register("phone")}
          />
        </Field>
        <Field id="enq-email" label="Email" optional hint="So we can reply by email" error={errors.email?.message}>
          <input id="enq-email" type="email" autoComplete="email" className={inputClass(!!errors.email)} aria-invalid={!!errors.email} aria-describedby={describedBy("enq-email", true, !!errors.email)} {...register("email")} />
        </Field>
      </div>
      <Field id="enq-reason" label="Reason for contacting us" required error={errors.reason?.message}>
        <Controller
          control={control}
          name="reason"
          render={({ field }) => (
            <Select
              id="enq-reason"
              labelId="enq-reason-label"
              name="reason"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={REASONS.map((r) => ({ value: r.value, label: r.label }))}
              placeholder="Choose a reason"
              required
              invalid={!!errors.reason}
              describedBy={describedBy("enq-reason", false, !!errors.reason)}
            />
          )}
        />
      </Field>
      <Field id="enq-message" label="Message" required error={errors.message?.message}>
        <textarea id="enq-message" rows={5} className={inputClass(!!errors.message)} aria-required="true" aria-invalid={!!errors.message} aria-describedby={describedBy("enq-message", false, !!errors.message)} {...register("message")} />
      </Field>
      {/* Honeypot (spam protection) — hidden from people and screen readers */}
      <input type="checkbox" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("botcheck")} />
      <p id="enq-note" className="rounded-2xl bg-ink-100 px-4 py-3 text-sm text-ink-700">
        Please do not include medical details or reports in this form. For medical questions, call us or visit the OPD.
      </p>
      <Button type="submit" size="lg" disabled={isSubmitting} icon={<Send className="h-5 w-5" aria-hidden />} className="w-full sm:w-auto">
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
