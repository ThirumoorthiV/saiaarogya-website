import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { SITE_URL } from "@/lib/staticPaths";
import { formsConfigured, submitToWeb3Forms, WEB3FORMS_ENDPOINT, WEB3FORMS_KEY } from "@/lib/web3forms";
import { trackEvent } from "@/components/layout/Analytics";
import { Button } from "@/components/ui/Button";
import { Field, describedBy, inputClass } from "@/components/ui/Field";
import { cn } from "@/components/ui/cn";
import { INDIAN_PHONE, normalizePhone } from "./EnquiryForm";
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
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  phone: z
    .string()
    .transform(normalizePhone)
    .refine((v) => INDIAN_PHONE.test(v), "Please enter a valid 10-digit Indian mobile number."),
  email: z.union([z.literal(""), z.string().trim().email("Please enter a valid email address, or leave it empty.")]),
  area: z.enum(Object.keys(AREAS) as [Area, ...Area[]], {
    message: "Please choose an area of interest.",
  }),
  profession: z.string().trim().max(120).optional(),
  availability: z.string().trim().max(200).optional(),
  message: z.string().trim().max(2000).optional(),
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
  const area = useWatch({ control, name: "area" });

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
          className={inputClass(!!errors.name)}
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={describedBy("vol-name", false, !!errors.name)}
          {...register("name")}
        />
      </Field>
      <div className="grid items-start gap-5 sm:grid-cols-2">
        <Field id="vol-phone" label="Phone number" required hint="10-digit Indian mobile number" error={errors.phone?.message}>
          <input
            id="vol-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={inputClass(!!errors.phone)}
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("vol-phone", true, !!errors.phone)}
            {...register("phone")}
          />
        </Field>
        <Field id="vol-email" label="Email" optional hint="So we can reply by email" error={errors.email?.message}>
          <input
            id="vol-email"
            type="email"
            autoComplete="email"
            className={inputClass(!!errors.email)}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("vol-email", true, !!errors.email)}
            {...register("email")}
          />
        </Field>
      </div>

      <fieldset aria-describedby={errors.area ? "vol-area-error" : undefined}>
        <legend className="mb-2 text-[15px] font-semibold text-ink-900">
          Area of interest{" "}
          <span className="text-alert-700" aria-hidden>
            *
          </span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(AREAS) as Area[]).map((a) => (
            <label
              key={a}
              className={cn(
                "flex cursor-pointer flex-col gap-1 rounded-2xl border p-4 transition-colors hover:border-maroon-300 hover:bg-maroon-50",
                area === a ? "border-maroon-700 bg-maroon-50 ring-4 ring-maroon-100" : "border-ink-200 bg-white",
              )}
            >
              <span className="flex items-center gap-2.5 font-semibold text-ink-900">
                <input type="radio" value={a} className="h-5 w-5" {...register("area")} />
                {AREAS[a].title}
              </span>
              <span className="pl-[30px] text-sm text-ink-600">{AREAS[a].text}</span>
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
        <Field id="vol-profession" label="Profession / skills" optional>
          <input id="vol-profession" className={inputClass(false)} {...register("profession")} />
        </Field>
        <Field id="vol-availability" label="Availability" optional>
          <input id="vol-availability" placeholder="e.g. weekends, during camps" className={inputClass(false)} {...register("availability")} />
        </Field>
      </div>
      <Field id="vol-message" label="Anything else you’d like to tell us?" optional>
        <textarea id="vol-message" rows={4} className={inputClass(false)} {...register("message")} />
      </Field>
      <input type="checkbox" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("botcheck")} />
      <Button type="submit" size="lg" disabled={isSubmitting} icon={<Send className="h-5 w-5" aria-hidden />} className="w-full sm:w-auto">
        {isSubmitting ? "Sending…" : "Send volunteer request"}
      </Button>
    </form>
  );
}
