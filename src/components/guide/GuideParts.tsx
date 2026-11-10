import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { BookOpen, Building2, CircleHelp, ClipboardList, Clock, IdCard, MapPin, Phone, Pill, FileText } from "lucide-react";
import { siteSettings } from "@/content";
import { useT } from "@/i18n/LangContext";
import { Container } from "@/components/ui/Container";
import { LLink } from "@/components/ui/LLink";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

export const GUIDE_SECTIONS = [
  { to: "/patient-guide/opd-timings/", title: "guide.opdTitle", text: "guide.opdText", icon: Clock },
  { to: "/patient-guide/how-to-reach/", title: "guide.reachTitle", text: "guide.reachText", icon: MapPin },
  { to: "/patient-guide/registration/", title: "guide.registrationTitle", text: "guide.registrationText", icon: ClipboardList },
  { to: "/patient-guide/facilities/", title: "guide.facilitiesTitle", text: "guide.facilitiesText", icon: Building2 },
  { to: "/patient-guide/faqs/", title: "guide.faqsTitle", text: "guide.faqsText", icon: CircleHelp },
] as const;

/** In-page navigation between Patient Guide sections (scrollable chips on mobile). */
export function GuideSubnav() {
  const t = useT();
  const { pathname } = useLocation();
  const current = pathname.replace(/^\/te(?=\/)/, "");
  return (
    <nav aria-label="Patient Guide sections" className="border-b border-maroon-700/10 bg-white">
      <Container>
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 py-3 md:mx-0 md:flex-wrap md:px-0">
          <li>
            <LLink
              to="/patient-guide/"
              aria-current={current === "/patient-guide/" ? "page" : undefined}
              className={chip(current === "/patient-guide/")}
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              Overview
            </LLink>
          </li>
          {GUIDE_SECTIONS.map((s) => (
            <li key={s.to}>
              <LLink to={s.to} aria-current={current === s.to ? "page" : undefined} className={chip(current === s.to)}>
                <s.icon className="h-4 w-4" aria-hidden />
                {t(s.title)}
              </LLink>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}

const chip = (active: boolean) =>
  cn(
    "inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-semibold no-underline",
    active ? "border-maroon-700 bg-maroon-700 text-white" : "border-maroon-700/25 bg-white text-maroon-700 hover:bg-maroon-50",
  );

/** "Still have a question? Call us" strip at the end of guide pages. */
export function CallStrip() {
  const t = useT();
  return (
    <div className="flex flex-col items-start gap-4 rounded-card bg-maroon-50 p-6 md:flex-row md:items-center md:justify-between md:p-8">
      <div>
        <h2 className="font-heading text-2xl font-medium text-maroon-700">{t("guide.stillQuestions")}</h2>
        <p className="mt-1 text-ink-600">{t("guide.stillQuestionsText")}</p>
      </div>
      <ButtonLink to={`tel:${siteSettings.phone}`} icon={<Phone className="h-5 w-5" aria-hidden />} track="call-guide-strip">
        {`${t("actions.call")} ${siteSettings.phoneDisplay}`}
      </ButtonLink>
    </div>
  );
}

/** §5.5 Registration: 3-step visual Arrive → Register at desk → Consult. */
export function RegistrationSteps() {
  const t = useT();
  const steps = [
    { title: t("guide.stepArrive"), text: t("guide.stepArriveText") },
    { title: t("guide.stepRegister"), text: t("guide.stepRegisterText") },
    { title: t("guide.stepConsult"), text: t("guide.stepConsultText") },
  ];
  return (
    <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
      {steps.map((s, i) => (
        <li key={s.title} className="relative rounded-card bg-white p-6 shadow-card">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-saffron-700 font-heading text-xl font-semibold text-white" aria-hidden>
            {i + 1}
          </span>
          <h3 className="mt-4 font-heading text-xl font-medium text-maroon-700">
            <span className="sr-only">Step {i + 1}: </span>
            {s.title}
          </h3>
          <p className="mt-1 text-ink-600">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

/** §5.5 What to bring: ID, previous reports, medicine list. */
export function WhatToBring() {
  const t = useT();
  const items: { icon: ReactNode; text: string }[] = [
    { icon: <IdCard className="h-6 w-6" aria-hidden />, text: t("guide.bringId") },
    { icon: <FileText className="h-6 w-6" aria-hidden />, text: t("guide.bringReports") },
    { icon: <Pill className="h-6 w-6" aria-hidden />, text: t("guide.bringMedicines") },
  ];
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {items.map((i) => (
        <li key={i.text} className="flex items-center gap-3 rounded-card bg-white p-4 shadow-card">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">{i.icon}</span>
          <span className="text-ink-900">{i.text}</span>
        </li>
      ))}
    </ul>
  );
}
