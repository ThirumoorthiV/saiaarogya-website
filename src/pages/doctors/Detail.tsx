import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, Clock, GraduationCap, Languages, Phone, Stethoscope } from "lucide-react";
import { doctors, getDepartment, getDoctor, tel } from "@/content";
import { fitDescription } from "@/lib/describe";
import { physicianSchema } from "@/lib/schema";
import { Seo } from "@/components/seo/Seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";
import { DoctorCard, DoctorPhoto, VisitingBadge } from "@/components/doctors/DoctorCard";
import { Component as NotFound } from "@/pages/NotFound";

function Fact({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="relative min-h-[76px] border-t border-ink-200/70 py-4 pl-[60px]">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">
        <span className="absolute left-0 top-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 text-ink-900">{children}</dd>
    </div>
  );
}

/** Doctor profile (§5.4): photo, qualifications, speciality, languages, visiting schedule, department link. */
export function Component() {
  const { slug = "" } = useParams();
  const doctor = getDoctor(slug);
  if (!doctor) return <NotFound />;

  const dept = getDepartment(doctor.department);
  const path = `/doctors/${doctor.slug}/`;
  const colleagues = doctors.filter((d) => d.department === doctor.department && d.slug !== doctor.slug);
  const description = fitDescription([
    `${doctor.name}, ${doctor.qualification} — ${doctor.type.toLowerCase()} doctor${dept ? ` in ${dept.name}` : ""} at Sai Aarogya Hospital, Bapatla.`,
    "See visiting days and plan a free consultation.",
  ]);
  const ic = "h-5 w-5";

  return (
    <>
      <Seo title={`${doctor.name}${dept ? ` – ${dept.name}` : ""}`} description={description} path={path} type="profile" image={doctor.photo ?? undefined} schema={[physicianSchema(doctor, path)]} />
      <div className="relative overflow-hidden border-b border-ink-200/70 bg-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_0%,#F6E4E4_0%,transparent_60%)]" />
        <Container className="relative py-10 md:py-16">
          <Breadcrumbs items={[{ label: "Doctors", to: "/doctors/" }, { label: doctor.name }]} currentPath={path} />
          <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,340px)_1fr] md:gap-14">
            <div className="w-full max-w-[340px]">
              <DoctorPhoto doctor={doctor} size="profile" className="shadow-lift" />
              {!doctor.photo && (
                <div className="mt-3">
                  <Todo id="doctor-photo" inline>
                    doctor photo
                  </Todo>
                </div>
              )}
            </div>
            <div>
              <p className="eyebrow">{doctor.type} doctor</p>
              <h1 className="text-h1 mt-4">{doctor.name}</h1>
              <p className="mt-2 text-xl text-ink-600">{doctor.qualification}</p>
              <div className="mt-5">
                <VisitingBadge doctor={doctor} />
              </div>
              <dl className="mt-8 max-w-xl">
                <Fact icon={<Stethoscope className={ic} aria-hidden />} label="Speciality">
                  {dept ? <Link to={`/departments/${dept.slug}/`}>{dept.name}</Link> : null}
                </Fact>
                <Fact icon={<GraduationCap className={ic} aria-hidden />} label="Qualifications">
                  {doctor.qualification}
                </Fact>
                <Fact icon={<CalendarDays className={ic} aria-hidden />} label="Visiting days">
                  {doctor.visitingDays.length ? (
                    doctor.visitingDays.includes("Daily") ? "Daily" : doctor.visitingDays.join(", ")
                  ) : (
                    <Todo id="doctor-visiting-days" inline>
                      visiting days
                    </Todo>
                  )}
                </Fact>
                <Fact icon={<Clock className={ic} aria-hidden />} label="Consultation time">
                  {doctor.timing ?? (
                    <Todo id="doctor-timing" inline>
                      consultation time
                    </Todo>
                  )}
                </Fact>
                <Fact icon={<Languages className={ic} aria-hidden />} label="Languages spoken">
                  {doctor.languages.length ? (
                    doctor.languages.join(", ")
                  ) : (
                    <Todo id="doctor-languages" inline>
                      languages
                    </Todo>
                  )}
                </Fact>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink to={tel} size="lg" icon={<Phone className="h-5 w-5" aria-hidden />} track="call-doctor-profile">
                  Call to confirm availability
                </ButtonLink>
                <ButtonLink to="/patient-guide/opd-timings/" variant="outline" size="lg">
                  OPD timings
                </ButtonLink>
              </div>
              <p className="mt-4 text-sm text-ink-600">Consultations are free of charge. Online appointment booking is not available on this website.</p>
            </div>
          </div>
        </Container>
      </div>

      {colleagues.length > 0 && (
        <Section title={`Other doctors in ${dept?.name ?? "this department"}`}>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
