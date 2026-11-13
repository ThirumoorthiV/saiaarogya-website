import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { SITE_URL } from "@/lib/staticPaths";
import { formsConfigured, submitToWeb3Forms, WEB3FORMS_ENDPOINT, WEB3FORMS_KEY } from "@/lib/web3forms";
import { trackEvent } from "@/components/layout/Analytics";
import { Button } from "@/components/ui/Button";
import { Field, describedBy, inputClass } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { filtered } from "./filter";
import { clean, LIMITS, rules } from "@/lib/fieldRules";
import { FormError, FormSuccess } from "./FormStatus";

const AREAS = {
  medical: { title: "Medical", text: "Doctor, nurse, pharmacist, technician…" },
  "non-medical": {
    title: "Non-medical",
    text: "Registration desk, patient guidance, camps, admin…",
  },
  either: { title: "Either", text: "Wherever I am needed" },
} as const;
type Area = keyof typeof AREAS;

const schema = z.object({
  name: rules.name("name", LIMITS.fullName),
  phone: rules.mobile(),
  email: rules.optionalEmail(),
  area: z.enum(Object.keys(AREAS) as [Area, ...Area[]], {
    message: "Please choose an area of interest.",
  }),
  profession: rules.optionalText("profession", LIMITS.short),
  availability: rules.optionalText("availability", LIMITS.medium),
  message: rules.optionalText("message", LIMITS.message),
  botcheck: z.boolean().optional(),
});
type In = z.input<typeof schema>;
type Out = z.output<typeof schema>;

/** Volunteer sign-up (§5.7) with "Area of interest". Sent via Web3Forms. */
export function VolunteerForm() {
  const path = "/support-us/volunteer/";
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const statusRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<In, unknown, Out>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      area: "" as Area,
      profession: "",
      availability: "",
      message: "",
      botcheck: false,
    },
  });

  useEffect(() => {
    if (status !== "idle") statusRef.current?.focus();
  }, [status]);

  const onSubmit = async (d: Out) => {
    const { botcheck, area: a, ...rest } = d;
    const res = await submitToWeb3Forms(`Volunteer sign-up — ${d.name}`, { ...rest, area_of_interest: AREAS[a].title, page: path } as Record<string, string>, Boolean(botcheck));
    if (res.ok) {
      trackEvent("form_submit", { form: "volunteer", area: a });
      reset();
      setStatus("sent");
    } else setStatus("error");
  };

  if (status === "sent") {
    return <FormSuccess ref={statusRef} title="Thank you for offering to volunteer!" text="Our team will contact you soon." />;
  }

  return (
    <form action={WEB3FORMS_ENDPOINT} method="POST" noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
      <input type="hidden" name="subject" value="Volunteer sign-up" />
      <input type="hidden" name="redirect" value={`${SITE_URL}${path}?sent=1`} />
      {!formsConfigured && <p className="rounded-2xl bg-maroon-50 px-4 py-3 text-sm text-maroon-900">Online messages are being set up. Please call or email us in the meantime.</p>}
      {status === "error" && <FormError ref={statusRef} />}

      <Field id="vol-name" label="Your name" required error={errors.name?.message}>
        <input
          id="vol-name"
          autoComplete="name"
          maxLength={LIMITS.fullName}
          className={inputClass(!!errors.name)}
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={describedBy("vol-name", false, !!errors.name)}
          {...filtered(register("name"), (v) => clean.name(v, LIMITS.fullName))}
        />
      </Field>
      <div className="grid items-start gap-5 sm:grid-cols-2">
        <Field id="vol-phone" label="Phone number" required error={errors.phone?.message}>
          <input
            id="vol-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="9876543210"
            className={inputClass(!!errors.phone)}
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("vol-phone", false, !!errors.phone)}
            {...filtered(register("phone"), clean.mobile)}
          />
        </Field>
        <Field id="vol-email" label="Email" optional error={errors.email?.message}>
          <input
            id="vol-email"
            type="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            className={inputClass(!!errors.email)}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("vol-email", false, !!errors.email)}
            {...filtered(register("email"), clean.email)}
          />
        </Field>
      </div>

      <Field id="vol-area" label="Area of interest" required error={errors.area?.message}>
        <Controller
          control={control}
          name="area"
          render={({ field }) => (
            <Select
              id="vol-area"
              labelId="vol-area-label"
              name="area"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={(Object.keys(AREAS) as Area[]).map((a) => ({ value: a, label: AREAS[a].title, description: AREAS[a].text }))}
              placeholder="Choose an area"
              required
              invalid={!!errors.area}
              describedBy={describedBy("vol-area", false, !!errors.area)}
            />
          )}
        />
      </Field>

      <div className="grid items-start gap-5 sm:grid-cols-2">
        <Field id="vol-profession" label="Profession / skills" optional error={errors.profession?.message}>
          <input
            id="vol-profession"
            maxLength={LIMITS.short}
            className={inputClass(!!errors.profession)}
            aria-invalid={!!errors.profession}
            {...filtered(register("profession"), clean.text(LIMITS.short))}
          />
        </Field>
        <Field id="vol-availability" label="Availability" optional error={errors.availability?.message}>
          <input
            id="vol-availability"
            placeholder="e.g. weekends, during camps"
            maxLength={LIMITS.medium}
            className={inputClass(!!errors.availability)}
            aria-invalid={!!errors.availability}
            {...filtered(register("availability"), clean.text(LIMITS.medium))}
          />
        </Field>
      </div>
      <Field id="vol-message" label="Anything else you’d like to tell us?" optional error={errors.message?.message}>
        <textarea
          id="vol-message"
          rows={4}
          maxLength={LIMITS.message}
          className={inputClass(!!errors.message)}
          aria-invalid={!!errors.message}
          {...filtered(register("message"), clean.text(LIMITS.message))}
        />
      </Field>
      <input type="checkbox" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("botcheck")} />
      <Button type="submit" size="lg" disabled={isSubmitting} icon={<Send className="h-5 w-5" aria-hidden />} className="w-full">
        {isSubmitting ? "Sending…" : "Send volunteer request"}
      </Button>
    </form>
  );
}
