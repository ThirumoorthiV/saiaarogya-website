import { Stethoscope, Users } from "lucide-react";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Todo } from "@/components/ui/Todo";
import { VolunteerForm } from "@/components/forms/VolunteerForm";

/** Volunteer (§5.7): roles (medical / non-medical) + form with Area of interest. */
export function Component() {
  const path = "/support-us/volunteer/";
  const meta = getPageMeta(path);
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHero title={meta.h1 ?? meta.title} eyebrow={<p className="eyebrow">Support us</p>} intro={meta.description} crumbs={meta.crumbs} path={path} />
      <div className="py-14 md:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr] lg:gap-8">
            <div className="space-y-4">
              <h2 className="text-h3 md:text-2xl">Ways to volunteer</h2>
              {[
                { icon: Stethoscope, title: "Medical volunteers", text: "Doctors, nurses, pharmacists and other health professionals." },
                { icon: Users, title: "Non-medical volunteers", text: "Help with patients, registration, medical camps and events." },
              ].map((r) => (
                <div key={r.title} className="surface flex gap-4 p-5 md:p-6">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700">
                    <r.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-ink-900">{r.title}</h3>
                    <p className="text-ink-600">{r.text}</p>
                  </div>
                </div>
              ))}
              <Todo id="volunteer-roles">Confirmed list of volunteer roles, time commitment and any requirements (e.g. registration for doctors).</Todo>
            </div>
            <div className="surface p-6 md:p-10">
              <h2 className="text-h3 mb-2 md:text-2xl">Sign up to volunteer</h2>
              <p className="mb-7 text-ink-600">Fields marked * are required.</p>
              <VolunteerForm />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
