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
import { Select } from "@/components/ui/Select";
import { Field, describedBy, inputClass } from "@/components/ui/Field";
import { FormError, FormSuccess } from "./FormStatus";
import { filtered } from "./filter";
import { clean, LIMITS, rules } from "@/lib/fieldRules";

export const REASONS = [
  { value: "patient", label: "Patient enquiry" },
  { value: "donation", label: "Donation" },
  { value: "volunteer", label: "Volunteer" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
] as const;
export type Reason = (typeof REASONS)[number]["value"];

const noopSubscribe = () => () => {};

const schema = z.object({
  name: rules.name("name", LIMITS.fullName),
  phone: rules.mobile(),
  email: rules.optionalEmail(),
  reason: z.enum(REASONS.map((r) => r.value) as [Reason, ...Reason[]], {
    message: "Please choose a reason.",
  }),
  message: z
    .string()
    .trim()
    .min(1, "Please write your message.")
    .min(10, "Please write a short message (at least 10 characters).")
    .max(LIMITS.message, `Please keep your message under ${LIMITS.message} characters.`),
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
  const sentViaRedirect = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get("sent") === "1",
    () => false,
  );
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
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      reason: (defaultReason ?? "") as Reason,
      message: "",
      botcheck: false,
    },
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

      {!formsConfigured && <p className="rounded-2xl bg-maroon-50 px-4 py-3 text-sm text-maroon-900">Online messages are being set up. Please call or email us in the meantime.</p>}
      {status === "error" && <FormError ref={statusRef} />}
      {hasErrors && submitCount > 0 && (
        <p role="alert" className="font-medium text-alert-700">
          Please correct the highlighted fields.
        </p>
      )}

      <Field id="enq-name" label="Your name" required error={errors.name?.message}>
        <input
          id="enq-name"
          autoComplete="name"
          maxLength={LIMITS.fullName}
          className={inputClass(!!errors.name)}
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={describedBy("enq-name", false, !!errors.name)}
          {...filtered(register("name"), (v) => clean.name(v, LIMITS.fullName))}
        />
      </Field>
      <div className="grid items-start gap-5 sm:grid-cols-2">
        <Field id="enq-phone" label="Phone number" required error={errors.phone?.message}>
          <input
            id="enq-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="9876543210"
            className={inputClass(!!errors.phone)}
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("enq-phone", false, !!errors.phone)}
            {...filtered(register("phone"), clean.mobile)}
          />
        </Field>
        <Field id="enq-email" label="Email" optional error={errors.email?.message}>
          <input
            id="enq-email"
            type="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            className={inputClass(!!errors.email)}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("enq-email", false, !!errors.email)}
            {...filtered(register("email"), clean.email)}
          />
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
        <textarea
          id="enq-message"
          rows={5}
          maxLength={LIMITS.message}
          className={inputClass(!!errors.message)}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("enq-message", false, !!errors.message)}
          {...filtered(register("message"), clean.text(LIMITS.message))}
        />
      </Field>
      {/* Honeypot (spam protection) — hidden from people and screen readers */}
      <input type="checkbox" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("botcheck")} />
      <p id="enq-note" className="rounded-2xl bg-ink-100 px-4 py-3 text-sm text-ink-700">
        Please do not include medical details or reports in this form. For medical questions, call us or visit the OPD.
      </p>
      <Button type="submit" size="lg" disabled={isSubmitting} icon={<Send className="h-5 w-5" aria-hidden />} className="w-full">
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
