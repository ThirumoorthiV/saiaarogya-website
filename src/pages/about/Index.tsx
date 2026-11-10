import { CheckCircle2, Users, History } from "lucide-react";
import { about } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { HOSPITAL_ID } from "@/lib/schema";
import { SITE_URL } from "@/lib/staticPaths";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";
import { MissionTrust, PortraitCard, Timeline } from "@/components/about/AboutParts";
import { NetworkCards } from "@/components/sections/NetworkCards";

/** About — Our Story (§5.2): hero, inspiration & founder, mission & trust, timeline teaser, governance, network. */
export function Component() {
  const path = "/about/";
  const meta = getPageMeta(path);
  const ms = about.multiSpeciality;
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE_URL}${path}`,
    name: meta.title,
    about: { "@id": HOSPITAL_ID },
  };

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} schema={[aboutSchema]} />
      <PageHeader
        title={meta.h1 ?? meta.title}
        crumbs={meta.crumbs}
        path={path}
        intro={<p>{about.intro[0]}</p>}
        image={{ src: "/images/hospital-ward-sm.webp", alt: "Inpatient ward at Sai Aarogya Hospital, Bapatla", width: 800, height: 600 }}
      />

      <Section id="free-for-all">
        <div className="flex max-w-prose gap-4 rounded-card bg-[#E7F3EA] p-6">
          <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-success-700" aria-hidden />
          <p className="text-ink-900">{about.intro[1]}</p>
        </div>
      </Section>

      <Section id="inspiration" tone="cream" title="The inspiration and the founder">
        <div className="grid gap-6 lg:grid-cols-2">
          <PortraitCard eyebrow="The Inspiration" person={about.inspiration} />
          <PortraitCard eyebrow="The Founder" person={about.founder} />
        </div>
      </Section>

      <Section id="mission" title="The mission and the trust">
        <MissionTrust />
      </Section>

      <Section
        id="history"
        tone="cream"
        title="Our journey"
        action={
          <ButtonLink to="/about/history/" variant="ghost" icon={<History className="h-5 w-5" aria-hidden />}>
            Read our full history
          </ButtonLink>
        }
      >
        <Timeline />
      </Section>

      {ms.published && (
        <Section id="multi-speciality" title={ms.heading}>
          <ul className="grid gap-4 md:grid-cols-2">
            {ms.points.map((p) => (
              <li key={p.title} className="rounded-card bg-white p-6 shadow-card">
                <h3 className="font-heading text-xl font-medium text-maroon-700">{p.title}</h3>
                <p className="mt-2 text-ink-600">{p.text}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="governance" title="Governance">
        <div className="flex flex-col items-start gap-4 rounded-card bg-maroon-50 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <Users className="mt-1 h-8 w-8 shrink-0 text-maroon-700" aria-hidden />
            <p className="max-w-prose text-ink-900">
              The hospital is guided by the Board of Trustees, Advisors and the Management Committee of the Sri Sathya Sai Sujala Sravanthi Trust.
            </p>
          </div>
          <ButtonLink to="/about/governance/" variant="secondary">
            Meet the trustees
          </ButtonLink>
        </div>
        {!ms.published && (
          <div className="mt-6">
            <Todo id="multi-speciality">
              “Building a World-Class Multi-Speciality Centre” content exists on the current site but is hidden — publish or remove?
            </Todo>
          </div>
        )}
      </Section>

      <Section id="network" tone="cream" title="Our network" intro="Sai Aarogya Hospital operates in collaboration with other healthcare initiatives of the Mission.">
        <NetworkCards />
      </Section>
    </>
  );
}
