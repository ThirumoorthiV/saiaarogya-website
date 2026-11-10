import { useParams } from "react-router-dom";
import { Check, Phone, Stethoscope } from "lucide-react";
import { doctorsInDepartment, faqsFor, getDepartment, siteSettings, tel } from "@/content";
import { fitDescription } from "@/lib/describe";
import { faqSchema, HOSPITAL_ID } from "@/lib/schema";
import { SITE_URL } from "@/lib/staticPaths";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { DepartmentSchedule } from "@/components/guide/OpdTables";
import { CallStrip } from "@/components/guide/GuideShell";
import { FaqList } from "@/components/sections/FaqList";
import { Container } from "@/components/ui/Container";
import { Component as NotFound } from "@/pages/NotFound";

/** Department detail (§5.3): breadcrumb · hero · about · services · doctors · OPD days & timings · FAQs · Call to enquire. */
export function Component() {
  const { slug = "" } = useParams();
  const dept = getDepartment(slug);
  if (!dept) return <NotFound />;

  const path = `/departments/${dept.slug}/`;
  const docs = doctorsInDepartment(dept.slug);
  const faqs = faqsFor("Department", dept.slug);
  const description = fitDescription(
    [
      `${dept.name} at Sai Aarogya Hospital, Bapatla — free of charge.`,
      dept.summary ?? "Specialist consultation and treatment for patients from Bapatla and rural Andhra Pradesh.",
      docs.length ? `${docs.length === 1 ? "1 doctor" : `${docs.length} doctors`}.` : "",
    ].filter(Boolean),
  );
  const clinic = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: `${dept.name} – Sai Aarogya Hospital, Bapatla`,
    url: `${SITE_URL}${path}`,
    description: dept.summary ?? undefined,
    isAccessibleForFree: true,
    telephone: siteSettings.phone,
    parentOrganization: { "@id": HOSPITAL_ID },
  };

  return (
    <>
      <Seo title={`${dept.name} – Free Treatment in Bapatla`} description={description} path={path} schema={[clinic, faqSchema(faqs)]} />
      <PageHero
        title={dept.name}
        crumbs={[{ label: "Departments", to: "/departments/" }, { label: dept.name }]}
        path={path}
        eyebrow={<p className="eyebrow">Department</p>}
        intro={dept.summary ?? null}
        actions={
          <>
            <ButtonLink to={tel} size="lg" icon={<Phone className="h-5 w-5" aria-hidden />} track="call-department">
              Call to enquire
            </ButtonLink>
            <ButtonLink to="/patient-guide/opd-timings/" variant="outline" size="lg">
              OPD timings
            </ButtonLink>
          </>
        }
        aside={
          <div className="hidden justify-center lg:flex">
            <div className="relative flex h-64 w-64 items-center justify-center rounded-[3rem] bg-gradient-to-br from-maroon-700 to-maroon-950 text-white shadow-lift">
              <div aria-hidden className="absolute inset-4 rounded-[2.25rem] border border-white/10" />
              <DepartmentIcon name={dept.icon} className="h-24 w-24" />
            </div>
          </div>
        }
      />

      <Section id="about-dept" title={`About ${dept.name}`}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="prose-body max-w-prose text-lg text-ink-700">{dept.description.length ? dept.description.map((p, i) => <p key={i}>{p}</p>) : <p>{dept.summary}</p>}</div>
          <div className="surface p-6 md:p-8">
            <h3 className="text-h3">Services &amp; conditions treated</h3>
            {dept.services.length > 0 && (
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {dept.services.map((s) => (
                  <li key={s} className="flex items-start gap-3 rounded-2xl bg-maroon-50 px-4 py-3 text-ink-900">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-maroon-700" aria-hidden />
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>

      <Section id="dept-doctors" tone="white" title={`Doctors in ${dept.name}`}>
        {docs.length ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {docs.map((d) => (
              <li key={d.slug}>
                <DoctorCard doctor={d} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="surface flex flex-col items-start gap-4 p-6 md:p-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700">
              <Stethoscope className="h-6 w-6" aria-hidden />
            </span>
            <p className="text-ink-600">Please call us to check doctor availability.</p>
          </div>
        )}
      </Section>

      <Section id="dept-timings">
        <DepartmentSchedule departmentSlug={dept.slug} />
      </Section>

      {faqs.length > 0 && (
        <Section id="dept-faqs" tone="white" title="Frequently asked questions">
          <FaqList items={faqs} idPrefix={`${dept.slug}-faq`} />
        </Section>
      )}

      <div className="pb-16 md:pb-24">
        <Container>
          <CallStrip />
        </Container>
      </div>
    </>
  );
}
