import { BedDouble, CalendarCheck, HeartHandshake, Hospital } from "lucide-react";
import { about } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Timeline } from "@/components/about/AboutParts";

const FACTS = [
  { icon: Hospital, label: "Began as", value: "Aravinda Ashramam" },
  { icon: BedDouble, label: "From 20 beds to", value: "30–50 beds" },
  { icon: CalendarCheck, label: "Inaugurated", value: "13 Dec 2024" },
  { icon: HeartHandshake, label: "Cost to patients", value: "Free" },
];

/** History & Timeline (§5.2). */
export function Component() {
  const path = "/about/history/";
  const meta = getPageMeta(path);
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHero title={meta.h1 ?? meta.title} eyebrow={<p className="eyebrow">Sai Aarogya Hospital – Bapatla</p>} intro={meta.description} crumbs={meta.crumbs} path={path} />
      <Section id="timeline" title="Timeline">
        <Timeline />
      </Section>
      <Section id="story" tone="white" title="The story in full">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <div className="prose-body max-w-prose text-lg text-ink-700">
            {about.history.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <aside aria-label="Key facts" className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <img
              src="/images/hospital-ward.webp"
              alt="Inpatient ward at Sai Aarogya Hospital, Bapatla"
              width={1600}
              height={1200}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
            />
            <dl className="surface grid grid-cols-2 gap-px overflow-hidden bg-ink-200/60 p-0">
              {FACTS.map((f) => (
                <div key={f.label} className="flex flex-col-reverse gap-1 bg-white p-5">
                  <dt className="text-sm text-ink-600">{f.label}</dt>
                  <dd className="flex items-center gap-2 font-heading text-lg font-bold text-ink-900">
                    <f.icon className="h-5 w-5 shrink-0 text-maroon-700" aria-hidden />
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </Section>
    </>
  );
}
