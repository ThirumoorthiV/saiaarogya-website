import { useParams } from "react-router-dom";
import { CalendarDays, Clock, GraduationCap, Languages, Phone, Stethoscope } from "lucide-react";
import type { ReactNode } from "react";
import { doctors, getDepartment, getDoctor, siteSettings } from "@/content";
import { usePick, useT } from "@/i18n/LangContext";
import { fitDescription } from "@/lib/describe";
import { physicianSchema } from "@/lib/schema";
import { Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { LLink } from "@/components/ui/LLink";
import { Todo } from "@/components/ui/Todo";
import { DoctorCard, DoctorPhoto, VisitingBadge } from "@/components/doctors/DoctorCard";
import { Component as NotFound } from "@/pages/NotFound";

function Fact({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="relative min-h-[76px] border-t border-maroon-700/10 py-4 pl-[60px]">
      <dt className="text-sm font-semibold uppercase tracking-wide text-ink-600">
        <span className="absolute left-0 top-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">{icon}</span>
        {label}
      </dt>
      <dd className="mt-0.5 text-ink-900">{children}</dd>
    </div>
  );
}

/** Doctor profile (§5.4): photo, qualifications, speciality, languages, visiting schedule, department link. */
export function Component() {
  const { slug = "" } = useParams();
  const pick = usePick();
  const t = useT();
  const doctor = getDoctor(slug);
  if (!doctor) return <NotFound />;

  const dept = getDepartment(doctor.department);
  const deptName = dept ? pick(dept.name) : "";
  const path = `/doctors/${doctor.slug}/`;
  const typeLabel = doctor.type === "Resident" ? t("doctor.resident") : t("doctor.consultant");
  const colleagues = doctors.filter((d) => d.department === doctor.department && d.slug !== doctor.slug);
  const description = fitDescription([
    `${doctor.name}, ${doctor.qualification} — ${doctor.type.toLowerCase()} doctor${dept ? ` in ${dept.name.en}` : ""} at Sai Aarogya Hospital, Bapatla.`,
    "See visiting days and plan a free consultation.",
  ]);
  const ic = "h-5 w-5";

  return (
    <>
      <Seo
        title={`${doctor.name}${dept ? ` – ${dept.name.en}` : ""}`}
        description={description}
        path={path}
        type="profile"
        image={doctor.photo ?? undefined}
        schema={[physicianSchema(doctor, path)]}
      />
      <div className="bg-cream-100">
        <Container className="py-8 md:py-14">
          <Breadcrumbs items={[{ label: t("nav.doctors"), to: "/doctors/" }, { label: doctor.name }]} currentPath={path} />
          <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,320px)_1fr] md:gap-12">
            <div className="max-w-[320px]">
              <DoctorPhoto doctor={doctor} className="shadow-card" />
              {!doctor.photo && (
                <div className="mt-3">
                  <Todo id="doctor-photo" inline>
                    doctor photo
                  </Todo>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-ink-600">{typeLabel}</p>
              <h1 className="h1 mt-2">{doctor.name}</h1>
              <p className="mt-2 text-xl text-ink-600">{doctor.qualification}</p>
              <div className="mt-4">
                <VisitingBadge doctor={doctor} />
              </div>
              <dl className="mt-6 max-w-xl">
                <Fact icon={<Stethoscope className={ic} aria-hidden />} label={t("doctorsPage.speciality")}>
                  {dept ? <LLink to={`/departments/${dept.slug}/`}>{deptName}</LLink> : null}
                </Fact>
                <Fact icon={<GraduationCap className={ic} aria-hidden />} label={t("doctorsPage.qualifications")}>
                  {doctor.qualification}
                </Fact>
                <Fact icon={<CalendarDays className={ic} aria-hidden />} label={t("doctorsPage.visitingDays")}>
                  {doctor.visitingDays.length ? (
                    doctor.visitingDays.includes("Daily") ? t("doctor.daily") : doctor.visitingDays.join(", ")
                  ) : (
                    <Todo id="doctor-visiting-days" inline>
                      visiting days
                    </Todo>
                  )}
                </Fact>
                <Fact icon={<Clock className={ic} aria-hidden />} label={t("doctorsPage.consultationTime")}>
                  {doctor.timing ?? (
                    <Todo id="doctor-timing" inline>
                      consultation time
                    </Todo>
                  )}
                </Fact>
                <Fact icon={<Languages className={ic} aria-hidden />} label={t("doctorsPage.languages")}>
                  {doctor.languages.length ? (
                    doctor.languages.join(", ")
                  ) : (
                    <Todo id="doctor-languages" inline>
                      languages
                    </Todo>
                  )}
                </Fact>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink to={`tel:${siteSettings.phone}`} icon={<Phone className="h-5 w-5" aria-hidden />} track="call-doctor-profile">
                  {t("doctorsPage.callConfirm")}
                </ButtonLink>
                <ButtonLink to="/patient-guide/opd-timings/" variant="secondary">
                  {t("actions.opdTimings")}
                </ButtonLink>
              </div>
              <p className="mt-4 text-sm text-ink-600">{t("doctorsPage.freeNote")}</p>
            </div>
          </div>
        </Container>
      </div>

      {colleagues.length > 0 && (
        <Section title={t("doctorsPage.otherDoctors", { name: deptName })}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {colleagues.map((d) => (
              <li key={d.slug}>
                <DoctorCard doctor={d} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
