import { useParams } from "react-router-dom";
import { Check, Phone, Stethoscope } from "lucide-react";
import { doctorsInDepartment, faqsFor, getDepartment, siteSettings } from "@/content";
import { useLang, usePick, useT } from "@/i18n/LangContext";
import { fitDescription } from "@/lib/describe";
import { faqSchema, HOSPITAL_ID } from "@/lib/schema";
import { SITE_URL } from "@/lib/staticPaths";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { DepartmentSchedule } from "@/components/guide/OpdTables";
import { FaqList } from "@/components/sections/FaqList";
import { Component as NotFound } from "@/pages/NotFound";

/**
 * Department detail (§5.3): breadcrumb · hero · about · services checklist ·
 * doctors · OPD days & timings · FAQs · Call to enquire.
 */
export function Component() {
  const { slug = "" } = useParams();
  const lang = useLang();
  const pick = usePick();
  const t = useT();
  const dept = getDepartment(slug);
  if (!dept) return <NotFound />;

  const name = pick(dept.name);
  const path = `/departments/${dept.slug}/`;
  const docs = doctorsInDepartment(dept.slug);
  const faqs = faqsFor("Department", dept.slug);
  const description = fitDescription([
    `${dept.name.en} at Sai Aarogya Hospital, Bapatla — free of charge.`,
    dept.summary?.en ?? "Specialist consultation and treatment for patients from Bapatla and rural Andhra Pradesh.",
    docs.length ? `${docs.length === 1 ? "1 doctor" : `${docs.length} doctors`}.` : "",
  ].filter(Boolean));

  const deptSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: `${dept.name.en} – Sai Aarogya Hospital, Bapatla`,
    url: `${SITE_URL}${path}`,
    description: dept.summary?.en ?? undefined,
    isAccessibleForFree: true,
    telephone: siteSettings.phone,
    parentOrganization: { "@id": HOSPITAL_ID },
  };

  return (
    <>
      <Seo title={`${dept.name.en} – Free Treatment in Bapatla`} description={description} path={path} schema={[deptSchema, faqSchema(faqs, lang)]} />
      <PageHeader
        title={name}
        crumbs={[{ label: t("nav.departments"), to: "/departments/" }, { label: name }]}
        path={path}
        eyebrow={
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-maroon-700 text-white">
            <DepartmentIcon name={dept.icon} className="h-7 w-7" />
          </span>
        }
        intro={dept.summary ? pick(dept.summary) : <Todo id="department-summary">One-line summary of this department.</Todo>}
        actions={
          <>
            <ButtonLink to={`tel:${siteSettings.phone}`} icon={<Phone className="h-5 w-5" aria-hidden />} track="call-department">
              {t("actions.callToEnquire")}
            </ButtonLink>
            <ButtonLink to="/patient-guide/opd-timings/" variant="secondary">
              {t("actions.opdTimings")}
            </ButtonLink>
          </>
        }
      />

      <Section id="about-dept" title={t("departmentsPage.aboutTitle", { name })}>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="prose-body max-w-prose text-ink-900">
            {dept.description.length ? (
              dept.description.map((p, i) => <p key={i}>{pick(p)}</p>)
            ) : (
              <Todo id="department-description">1–2 paragraphs describing this department.</Todo>
            )}
          </div>
          <div>
            <h3 className="h3 mb-4">{t("departmentsPage.servicesTitle")}</h3>
            {dept.services.length ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {dept.services.map((s) => (
                  <li key={s.en} className="flex items-start gap-3 rounded-btn bg-cream-100 p-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-success-700" aria-hidden />
                    <span>{pick(s)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-4">
              <Todo id="department-services">
                {dept.services.length
                  ? "Confirm and expand this list (items taken from the current website’s one-line summary)."
                  : "List of services and conditions treated."}
              </Todo>
            </div>
          </div>
        </div>
      </Section>

      <Section id="dept-doctors" tone="cream" title={t("departmentsPage.doctorsTitle", { name })}>
        {docs.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {docs.map((d) => (
              <li key={d.slug}>
                <DoctorCard doctor={d} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-start gap-4 rounded-card bg-white p-6 shadow-card">
            <Stethoscope className="h-8 w-8 text-maroon-700" aria-hidden />
            <Todo id="department-no-doctor">The current website lists no doctor for this department — which doctor covers it?</Todo>
            <p className="text-ink-600">{t("departmentsPage.noDoctorText")}</p>
          </div>
        )}
      </Section>

      <Section id="dept-timings">
        <DepartmentSchedule departmentSlug={dept.slug} />
      </Section>

      {faqs.length > 0 && (
        <Section id="dept-faqs" tone="cream" title={t("departmentsPage.faqsTitle")}>
          <FaqList items={faqs} idPrefix={`${dept.slug}-faq`} />
        </Section>
      )}

      <section className="bg-maroon-700 text-white">
        <div className="mx-auto flex max-w-content flex-col items-start gap-4 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-6">
          <p className="font-heading text-2xl">{t("departmentsPage.questionAbout", { name })}</p>
          <ButtonLink to={`tel:${siteSettings.phone}`} icon={<Phone className="h-5 w-5" aria-hidden />} track="call-department-footer">
            {t("departmentsPage.callPhone", { phone: siteSettings.phoneDisplay })}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
