import { useEffect, useRef, useState } from "react";
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
import { INDIAN_PHONE, normalizePhone } from "./EnquiryForm";

const AREAS = {
  medical: "Medical (doctor, nurse, pharmacist, technician…)",
  "non-medical": "Non-medical (registration desk, patient guidance, camps, admin…)",
  either: "Either — wherever I am needed",
} as const;
type Area = keyof typeof AREAS;

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  phone: z
    .string()
    .transform(normalizePhone)
    .refine((v) => INDIAN_PHONE.test(v), "Please enter a valid 10-digit Indian mobile number."),
  email: z.union([z.literal(""), z.string().trim().email("Please enter a valid email address, or leave it empty.")]),
  area: z.enum(Object.keys(AREAS) as [Area, ...Area[]], { message: "Please choose an area of interest." }),
  profession: z.string().trim().max(120).optional(),
  availability: z.string().trim().max(200).optional(),
  message: z.string().trim().max(2000).optional(),
  botcheck: z.boolean().optional(),
});
type In = z.input<typeof schema>;
type Out = z.output<typeof schema>;

/** Volunteer sign-up (§5.7) with "Area of interest". Sent via Web3Forms. */
export function VolunteerForm() {
  const t = useT();
  const path = "/support-us/volunteer/";
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const statusRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<In, unknown, Out>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", area: "" as Area, profession: "", availability: "", message: "", botcheck: false },
  });

  useEffect(() => {
    if (status !== "idle") statusRef.current?.focus();
  }, [status]);

  const onSubmit = async (d: Out) => {
    const { botcheck, area, ...rest } = d;
    const res = await submitToWeb3Forms(`Volunteer sign-up — ${d.name}`, { ...rest, area_of_interest: AREAS[area], page: path } as Record<string, string>, Boolean(botcheck));
    if (res.ok) {
      trackEvent("form_submit", { form: "volunteer", area });
      reset();
      setStatus("sent");
    } else setStatus("error");
  };

  if (status === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-card bg-[#E7F3EA] p-6 outline-none">
        <p className="flex items-center gap-2 font-heading text-xl font-medium text-success-700">
          <CircleCheck className="h-6 w-6" aria-hidden />
          Thank you for offering to volunteer!
        </p>
        <p className="mt-2 text-ink-900">Our team will contact you soon.</p>
      </div>
    );
  }

  return (
    <form action={WEB3FORMS_ENDPOINT} method="POST" noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
      <input type="hidden" name="subject" value="Volunteer sign-up" />
      <input type="hidden" name="redirect" value={`${SITE_URL}${path}?sent=1`} />
      {!formsConfigured && (
        <Todo id="form-access-key">
          Form not connected yet — set <code>VITE_WEB3FORMS_ACCESS_KEY</code>.
        </Todo>
      )}
      {status === "error" && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="rounded-btn bg-[#FDECEC] p-4 outline-none">
          <p className="flex items-center gap-2 font-semibold text-alert-700">
            <CircleX className="h-5 w-5" aria-hidden />
            {t("form.errorTitle")}
          </p>
          <p className="mt-1">
            {t("form.errorText")}{" "}
            <a href={`tel:${siteSettings.phone}`} className="font-semibold">
              {siteSettings.phoneDisplay}
            </a>
          </p>
        </div>
      )}

      <Field id="vol-name" label={t("form.name")} required error={errors.name?.message}>
        <input id="vol-name" autoComplete="name" className={inputClass(!!errors.name)} aria-required="true" aria-invalid={!!errors.name} aria-describedby={describedBy("vol-name", false, !!errors.name)} {...register("name")} />
      </Field>
      <div className="grid items-start gap-5 sm:grid-cols-2">
        <Field id="vol-phone" label={t("form.phone")} required hint={t("form.phoneHint")} error={errors.phone?.message}>
          <input id="vol-phone" type="tel" inputMode="tel" autoComplete="tel" className={inputClass(!!errors.phone)} aria-required="true" aria-invalid={!!errors.phone} aria-describedby={describedBy("vol-phone", true, !!errors.phone)} {...register("phone")} />
        </Field>
        <Field id="vol-email" label={t("form.email")} optionalLabel={t("form.optional")} error={errors.email?.message}>
          <input id="vol-email" type="email" autoComplete="email" className={inputClass(!!errors.email)} aria-invalid={!!errors.email} aria-describedby={describedBy("vol-email", false, !!errors.email)} {...register("email")} />
        </Field>
      </div>
      <fieldset aria-describedby={errors.area ? "vol-area-error" : undefined}>
        <legend className="mb-2 font-semibold text-ink-900">
          Area of interest <span className="text-alert-700" aria-hidden>*</span>
        </legend>
        <div className="space-y-2">
          {(Object.keys(AREAS) as Area[]).map((a) => (
            <label key={a} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-btn border border-ink-600/30 bg-white px-4 py-3 has-[:checked]:border-maroon-700 has-[:checked]:bg-maroon-50">
              <input type="radio" value={a} className="h-5 w-5 accent-maroon-700" {...register("area")} />
              <span>{AREAS[a]}</span>
            </label>
          ))}
        </div>
        {errors.area && (
          <p id="vol-area-error" className="mt-1.5 text-sm font-medium text-alert-700">
            {errors.area.message}
          </p>
        )}
      </fieldset>
      <div className="grid items-start gap-5 sm:grid-cols-2">
        <Field id="vol-profession" label="Profession / skills" optionalLabel={t("form.optional")}>
          <input id="vol-profession" className={inputClass(false)} {...register("profession")} />
        </Field>
        <Field id="vol-availability" label="Availability" optionalLabel={t("form.optional")}>
          <input id="vol-availability" placeholder="e.g. weekends, during camps" className={inputClass(false)} {...register("availability")} />
        </Field>
      </div>
      <Field id="vol-message" label="Anything else you’d like to tell us?" optionalLabel={t("form.optional")}>
        <textarea id="vol-message" rows={4} className={inputClass(false)} {...register("message")} />
      </Field>
      <input type="checkbox" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("botcheck")} />
      <Button type="submit" disabled={isSubmitting} icon={<Send className="h-5 w-5" aria-hidden />} className="w-full sm:w-auto">
        {isSubmitting ? t("form.sending") : "Send volunteer request"}
      </Button>
    </form>
  );
}
