import { Stethoscope, Users } from "lucide-react";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Todo } from "@/components/ui/Todo";
import { VolunteerForm } from "@/components/forms/VolunteerForm";

/** Volunteer (§5.7): roles (medical / non-medical) + form with Area of interest. */
export function Component() {
  const path = "/support-us/volunteer/";
  const meta = getPageMeta(path);
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHeader title={meta.h1 ?? meta.title} intro={meta.description} crumbs={meta.crumbs} path={path} />
      <Section tone="cream">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
          <div className="space-y-6">
            <h2 className="h3">Ways to volunteer</h2>
            {[
              { icon: Stethoscope, title: "Medical volunteers", text: "Doctors, nurses, pharmacists and other health professionals." },
              { icon: Users, title: "Non-medical volunteers", text: "Help with patients, registration, medical camps and events." },
            ].map((r) => (
              <div key={r.title} className="flex gap-4 rounded-card bg-white p-5 shadow-card">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">
                  <r.icon className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h3 className="font-heading text-xl font-medium text-maroon-700">{r.title}</h3>
                  <p className="text-ink-600">{r.text}</p>
                </div>
              </div>
            ))}
            <Todo id="volunteer-roles">Confirmed list of volunteer roles, time commitment and any requirements (e.g. registration for doctors).</Todo>
          </div>
          <Card className="md:p-8">
            <h2 className="h3 mb-6">Sign up to volunteer</h2>
            <VolunteerForm />
          </Card>
        </div>
      </Section>
    </>
  );
}
