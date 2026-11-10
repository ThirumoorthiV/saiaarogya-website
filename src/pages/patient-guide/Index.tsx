import { ArrowRight } from "lucide-react";
import { faqsFor } from "@/content";
import { useT } from "@/i18n/LangContext";
import { GuidePage } from "@/components/guide/GuidePage";
import { GUIDE_SECTIONS, RegistrationSteps } from "@/components/guide/GuideParts";
import { LLink } from "@/components/ui/LLink";
import { FaqList } from "@/components/sections/FaqList";
import { ButtonLink } from "@/components/ui/Button";

/** Patient Guide overview (§5.5). */
export function Component() {
  const t = useT();
  return (
    <GuidePage path="/patient-guide/">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {GUIDE_SECTIONS.map((s) => (
          <li key={s.to}>
            <LLink
              to={s.to}
              className="group flex h-full flex-col rounded-card bg-white p-6 no-underline shadow-card transition-shadow hover:shadow-lg"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-700 text-white group-hover:bg-saffron-700">
                <s.icon className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="mt-4 font-heading text-xl font-medium text-maroon-700">{t(s.title)}</h2>
              <p className="mt-1 flex-1 text-ink-600">{t(s.text)}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-maroon-700 group-hover:underline">
                {t("actions.readMore")} <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </LLink>
          </li>
        ))}
      </ul>

      <section aria-labelledby="pg-steps">
        <h2 id="pg-steps" className="h2 mb-6">
          {t("guide.registrationTitle")}
        </h2>
        <RegistrationSteps />
      </section>

      <section aria-labelledby="pg-faqs">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 id="pg-faqs" className="h2">
            {t("guide.faqsTitle")}
          </h2>
          <ButtonLink to="/patient-guide/faqs/" variant="ghost">
            {t("actions.viewAll")}
          </ButtonLink>
        </div>
        <FaqList items={faqsFor("PatientGuide").slice(0, 3)} idPrefix="overview-faq" />
      </section>
    </GuidePage>
  );
}
