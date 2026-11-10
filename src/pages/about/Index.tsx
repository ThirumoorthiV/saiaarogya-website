import { CheckCircle2, History, Users } from "lucide-react";
import { about } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { HOSPITAL_ID } from "@/lib/schema";
import { SITE_URL } from "@/lib/staticPaths";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { MissionTrust, PortraitFeature, Timeline } from "@/components/about/AboutParts";
import { NetworkCards } from "@/components/sections/NetworkCards";

/** About — Our Story (§5.2). */
export function Component() {
  const path = "/about/";
  const meta = getPageMeta(path);
  const ms = about.multiSpeciality;
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE_URL}${path}`,
    name: meta.title,
    about: { "@id": HOSPITAL_ID },
  };

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} schema={[schema]} />
      <PageHero title={meta.h1 ?? meta.title} eyebrow={<p className="eyebrow">About us</p>} crumbs={meta.crumbs} path={path} intro={<p>{about.intro[0]}</p>} />

      <Section id="free-for-all" tone="white" className="!py-12 md:!py-16">
        <div className="flex gap-4 rounded-3xl bg-success-50 p-6 md:p-8">
          <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-success-700" aria-hidden />
          <p className="text-lg text-ink-900">{about.intro[1]}</p>
        </div>
      </Section>

      <Section id="inspiration" eyebrow="Inspiration & founder" title="Guided by selfless service">
        <div className="space-y-16 md:space-y-24">
          <PortraitFeature eyebrow="The Inspiration" person={about.inspiration} />
          <PortraitFeature eyebrow="The Founder" person={about.founder} reverse />
        </div>
      </Section>

      <Section id="mission" tone="white" eyebrow="Mission & trust" title="The mission and the trust">
        <MissionTrust />
      </Section>

      <Section
        id="history"
        eyebrow="Our journey"
        title="From 20 beds to a free hospital"
        action={
          <ButtonLink to="/about/history/" variant="ghost" icon={<History className="h-[18px] w-[18px]" aria-hidden />}>
            Full history
          </ButtonLink>
        }
      >
        <Timeline />
      </Section>

      {ms.published && (
        <Section id="multi-speciality" tone="white" title={ms.heading}>
          <ul className="grid gap-4 md:grid-cols-2">
            {ms.points.map((p) => (
              <li key={p.title} className="surface p-6">
                <h3 className="font-heading text-lg font-bold text-ink-900">{p.title}</h3>
                <p className="mt-2 text-ink-600">{p.text}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="governance" tone="white" eyebrow="Governance" title="Who guides the hospital">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-maroon-50 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-maroon-700">
              <Users className="h-6 w-6" aria-hidden />
            </span>
            <p className="max-w-prose text-ink-900">The hospital is guided by the Board of Trustees, Advisors and the Management Committee of the Sri Sathya Sai Sujala Sravanthi Trust.</p>
          </div>
          <ButtonLink to="/about/governance/" variant="primary">
            Meet the trustees
          </ButtonLink>
        </div>
      </Section>

      <Section id="network" eyebrow="Our network" title="Part of a larger mission" intro="Sai Aarogya Hospital operates in collaboration with other healthcare initiatives of the Mission.">
        <NetworkCards />
      </Section>
    </>
  );
}
