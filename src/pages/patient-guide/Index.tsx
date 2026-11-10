import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { faqsFor } from "@/content";
import { GUIDE_LINKS } from "@/lib/navigation";
import { GuideShell } from "@/components/guide/GuideShell";
import { RegistrationSteps } from "@/components/guide/Registration";
import { FaqList } from "@/components/sections/FaqList";
import { ButtonLink } from "@/components/ui/Button";

/** Patient Guide overview (§5.5). */
export function Component() {
  return (
    <GuideShell path="/patient-guide/">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {GUIDE_LINKS.map((s) => {
          const Icon = s.icon!;
          return (
            <li key={s.to}>
              <Link to={s.to} className="group surface surface-hover flex h-full flex-col p-6 no-underline md:p-7">
                <span className="flex items-start justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700 transition-colors group-hover:bg-maroon-700 group-hover:text-white">
                    <Icon className="h-6 w-6" aria-hidden strokeWidth={1.75} />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-ink-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-maroon-700" aria-hidden />
                </span>
                <h2 className="mt-5 font-heading text-xl font-bold text-ink-900">{s.label}</h2>
                <p className="mt-1 text-ink-600">{s.description}</p>
              </Link>
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="pg-steps">
        <p className="eyebrow">Your visit</p>
        <h2 id="pg-steps" className="text-h2 mb-8 mt-4">
          Three simple steps
        </h2>
        <RegistrationSteps />
      </section>

      <section aria-labelledby="pg-faqs">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">FAQs</p>
            <h2 id="pg-faqs" className="text-h2 mt-4">
              Common questions
            </h2>
          </div>
          <ButtonLink to="/patient-guide/faqs/" variant="ghost">
            All FAQs
          </ButtonLink>
        </div>
        <FaqList items={faqsFor("PatientGuide").slice(0, 3)} idPrefix="overview-faq" />
      </section>
    </GuideShell>
  );
}
