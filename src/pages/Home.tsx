import { Quote } from "lucide-react";
import { about, departments } from "@/content";
import { useT } from "@/i18n/LangContext";
import { getPageMeta } from "@/lib/pageMeta";
import { hospitalSchema } from "@/lib/schema";
import { Seo } from "@/components/seo/Seo";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";
import { Hero } from "@/components/sections/Hero";
import { QuickActions } from "@/components/sections/QuickActions";
import { ImpactCounters } from "@/components/sections/ImpactCounters";
import { DepartmentCard } from "@/components/departments/DepartmentCard";
import { DoctorCarousel } from "@/components/sections/DoctorCarousel";
import { NetworkCards } from "@/components/sections/NetworkCards";
import { VisitUs } from "@/components/sections/VisitUs";
import { SupportCta } from "@/components/sections/SupportCta";

/** Homepage — requirements §5.1 (sections 1–10; utility strip and footer are in the layout). */
export function Component() {
  const t = useT();
  const meta = getPageMeta("/");

  return (
    <>
      <Seo
        title={meta.title}
        fullTitle
        description={meta.description}
        path="/"
        imageAlt="Inpatient ward at Sai Aarogya Hospital, Bapatla"
        schema={[hospitalSchema()]}
      />

      {/* 1. Hero */}
      <Hero />

      {/* 2. Quick action tiles */}
      <div className="bg-gradient-to-b from-cream-100 to-white pb-12 md:pb-16">
        <QuickActions />
      </div>

      {/* 3. Impact counters */}
      <ImpactCounters />

      {/* 4. Departments */}
      <Section
        id="departments"
        tone="cream"
        title={t("home.departmentsTitle")}
        intro={t("home.departmentsIntro")}
        action={
          <ButtonLink to="/departments/" variant="ghost">
            {t("actions.viewAllDepartments")}
          </ButtonLink>
        }
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-5">
          {departments.map((d) => (
            <li key={d.slug}>
              <DepartmentCard department={d} />
            </li>
          ))}
        </ul>
      </Section>

      {/* 5. Meet our doctors */}
      <Section
        id="doctors"
        title={t("home.doctorsTitle")}
        intro={t("home.doctorsIntro")}
        action={
          <ButtonLink to="/doctors/" variant="ghost">
            {t("actions.viewAllDoctors")}
          </ButtonLink>
        }
      >
        <DoctorCarousel />
      </Section>

      {/* 6. About snippet */}
      <Section id="about" tone="cream">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
          <img
            src="/images/hospital-ward-sm.webp"
            srcSet="/images/hospital-ward-sm.webp 800w, /images/hospital-ward.webp 1600w"
            sizes="(min-width: 768px) 50vw, 100vw"
            alt="Inpatient ward at Sai Aarogya Hospital with rows of clean hospital beds"
            width={800}
            height={600}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-card object-cover shadow-card"
          />
          <div>
            <h2 id="about-title" className="h2">
              {t("home.aboutTitle")}
            </h2>
            <div className="prose-body mt-4 text-ink-900">
              <p>{about.intro[1]}</p>
            </div>
            <div className="mt-6">
              <ButtonLink to="/about/" variant="secondary">
                {t("actions.aboutUs")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* 7. Part of a larger mission */}
      <Section id="network" title={t("home.networkTitle")} intro={t("home.networkIntro")}>
        <NetworkCards />
      </Section>

      {/* 8. Patient stories */}
      <Section id="stories" tone="cream" title={t("home.storiesTitle")}>
        <div className="flex flex-col gap-4 rounded-card bg-white p-6 shadow-card md:flex-row md:items-center md:p-8">
          <Quote className="h-10 w-10 shrink-0 text-saffron-500" aria-hidden />
          <div className="flex-1">
            <Todo id="patient-stories">3 patient stories (with written consent) or one short video.</Todo>
          </div>
          <ButtonLink to="/impact/stories/" variant="ghost">
            {t("actions.viewAll")}
          </ButtonLink>
        </div>
      </Section>

      {/* 9. Visit us */}
      <Section id="visit" title={t("home.visitTitle")}>
        <VisitUs />
        <p className="mt-6">
          <ButtonLink to="/patient-guide/" variant="ghost">
            {t("actions.patientGuide")}
          </ButtonLink>
        </p>
      </Section>

      {/* 10. Support CTA */}
      <SupportCta />
    </>
  );
}
