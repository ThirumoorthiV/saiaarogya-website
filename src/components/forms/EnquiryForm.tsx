import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CircleCheck, CircleX, Send } from "lucide-react";
import { siteSettings } from "@/content";
import { useT } from "@/i18n/LangContext";
import { SITE_URL } from "@/lib/staticPaths";
import { formsConfigured, submitToWeb3Forms, WEB3FORMS_ENDPOINT, WEB3FORMS_KEY } from "@/lib/web3forms";
import { trackEvent } from "@/components/layout/Analytics";
import { Button } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";
import { Field, describedBy, inputClass } from "./Field";

const noopSubscribe = () => () => {};

export const REASONS = ["patient", "donation", "volunteer", "partnership", "other"] as const;
export type Reason = (typeof REASONS)[number];

/** Indian mobile: optional +91 / 91 / 0 prefix, then 10 digits starting 6–9. */
export const INDIAN_PHONE = /^(?:\+?91|0)?[6-9]\d{9}$/;
export const normalizePhone = (v: string) => v.replace(/[\s()-]/g, "");

const schema = z.object({
  name: z.string().trim().min(2, "errName").max(100, "errName"),
  phone: z
    .string()
    .transform(normalizePhone)
    .refine((v) => INDIAN_PHONE.test(v), "errPhone"),
  email: z.union([z.literal(""), z.string().trim().email("errEmail")]),
  reason: z.enum(REASONS, { message: "errReason" }),
  message: z.string().trim().min(10, "errMessage").max(2000, "errMessage"),
  botcheck: z.boolean().optional(),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

/**
 * Contact enquiry form (§5.8): required name, phone, reason, message; email
 * optional; Indian phone validation; success message. Submits to Web3Forms,
 * which emails the hospital. Honeypot spam protection (§8).
 */
export function EnquiryForm({ defaultReason, pagePath = "/contact/" }: { defaultReason?: Reason; pagePath?: string }) {
  const t = useT();
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const statusRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", reason: (defaultReason ?? "") as Reason, message: "", botcheck: false },
  });

  // No-JS fallback: Web3Forms redirects back with ?sent=1 (false while pre-rendering / hydrating)
  const sentViaRedirect = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get("sent") === "1",
    () => false,
  );
  const [redirectDismissed, setRedirectDismissed] = useState(false);
  const shownStatus = status === "idle" && sentViaRedirect && !redirectDismissed ? "sent" : status;

  useEffect(() => {
    if (shownStatus !== "idle") statusRef.current?.focus();
  }, [shownStatus]);

  const onSubmit = async (data: FormOutput) => {
    const { botcheck, ...fields } = data;
    const result = await submitToWeb3Forms(
      `Website enquiry: ${t(`form.reasons.${data.reason}`)} — ${data.name}`,
      { ...fields, reason: t(`form.reasons.${data.reason}`), page: pagePath },
      Boolean(botcheck),
    );
    if (result.ok) {
      trackEvent("form_submit", { form: "enquiry", reason: data.reason });
      reset();
      setStatus("sent");
    } else {
      setStatus("error");
    }
  };

  const err = (key?: string) => (key ? t(`form.${key}`) : undefined);
  const hasErrors = Object.keys(errors).length > 0;

  if (shownStatus === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-card bg-[#E7F3EA] p-6 outline-none">
        <p className="flex items-center gap-2 font-heading text-xl font-medium text-success-700">
          <CircleCheck className="h-6 w-6" aria-hidden />
          {t("form.successTitle")}
        </p>
        <p className="mt-2 text-ink-900">{t("form.successText", { phone: siteSettings.phoneDisplay })}</p>
        <Button variant="secondary" className="mt-4" onClick={() => {
            setRedirectDismissed(true);
            setStatus("idle");
          }}>
          {t("actions.sendEnquiry")}
        </Button>
      </div>
    );
  }

  return (
    <form
      action={WEB3FORMS_ENDPOINT}
      method="POST"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      aria-describedby="enquiry-medical-note"
    >
      {/* Used only when JavaScript is unavailable */}
      <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
      <input type="hidden" name="subject" value="Website enquiry" />
      <input type="hidden" name="redirect" value={`${SITE_URL}${pagePath}?sent=1`} />

      {!formsConfigured && (
        <Todo id="form-access-key">
          Form not connected yet — set <code>VITE_WEB3FORMS_ACCESS_KEY</code>. Messages cannot be sent until then.
        </Todo>
      )}

      {status === "error" && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="rounded-btn bg-[#FDECEC] p-4 outline-none">
          <p className="flex items-center gap-2 font-semibold text-alert-700">
            <CircleX className="h-5 w-5" aria-hidden />
            {t("form.errorTitle")}
          </p>
          <p className="mt-1 text-ink-900">
            {t("form.errorText")}{" "}
            <a href={`tel:${siteSettings.phone}`} className="font-semibold" data-track="call-form-error">
              {siteSettings.phoneDisplay}
            </a>
          </p>
        </div>
      )}

      {hasErrors && submitCount > 0 && (
        <p role="alert" className="font-medium text-alert-700">
          {t("form.errorSummary")}
        </p>
      )}

      <Field id="enq-name" label={t("form.name")} required error={err(errors.name?.message)}>
        <input
          id="enq-name"
          type="text"
          autoComplete="name"
          className={inputClass(!!errors.name)}
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={describedBy("enq-name", false, !!errors.name)}
          {...register("name")}
        />
      </Field>

      <div className="grid items-start gap-5 sm:grid-cols-2">
        <Field id="enq-phone" label={t("form.phone")} required hint={t("form.phoneHint")} error={err(errors.phone?.message)}>
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
        <Field id="enq-email" label={t("form.email")} optionalLabel={t("form.optional")} error={err(errors.email?.message)}>
          <input
            id="enq-email"
            type="email"
            autoComplete="email"
            className={inputClass(!!errors.email)}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("enq-email", false, !!errors.email)}
            {...register("email")}
          />
        </Field>
      </div>

      <Field id="enq-reason" label={t("form.reason")} required error={err(errors.reason?.message)}>
        <select
          id="enq-reason"
          className={inputClass(!!errors.reason)}
          aria-required="true"
          aria-invalid={!!errors.reason}
          aria-describedby={describedBy("enq-reason", false, !!errors.reason)}
          {...register("reason")}
        >
          <option value="" disabled>
            {t("form.reasonPlaceholder")}
          </option>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {t(`form.reasons.${r}`)}
            </option>
          ))}
        </select>
      </Field>

      <Field id="enq-message" label={t("form.message")} required error={err(errors.message?.message)}>
        <textarea
          id="enq-message"
          rows={5}
          className={inputClass(!!errors.message)}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("enq-message", false, !!errors.message)}
          {...register("message")}
        />
      </Field>

      {/* Honeypot (spam protection) — hidden from people and screen readers */}
      <input type="checkbox" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("botcheck")} />

      <p id="enquiry-medical-note" className="text-sm text-ink-600">
        {t("form.medicalNote")}
      </p>

      <Button type="submit" disabled={isSubmitting} icon={<Send className="h-5 w-5" aria-hidden />} className="w-full sm:w-auto">
        {isSubmitting ? t("form.sending") : t("form.submit")}
      </Button>
    </form>
  );
}
