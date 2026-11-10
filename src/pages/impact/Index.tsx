import { impactStats, stories } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";
import { StoryCard, formatDate } from "@/components/impact/StoryCard";
import { Gallery } from "@/components/impact/Gallery";
import { SupportCta } from "@/components/sections/SupportCta";

/** Our Impact (§5.6): impact at a glance, stories, camps & updates, gallery. */
export function Component() {
  const path = "/impact/";
  const meta = getPageMeta(path);
  const patient = stories.filter((s) => s.category === "Patient").slice(0, 3);
  const updates = stories.filter((s) => s.category !== "Patient").slice(0, 3);

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHero title={meta.h1 ?? meta.title} eyebrow={<p className="eyebrow">Our impact</p>} intro={meta.description} crumbs={meta.crumbs} path={path} />

      <Section id="glance" eyebrow="At a glance" title="Impact at a glance">
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {impactStats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse rounded-3xl bg-maroon-950 p-6 text-white">
              <dt className="mt-2 text-maroon-100">
                {s.label}
                {s.asOfDate && <span className="block text-sm text-maroon-200">as of {formatDate(s.asOfDate)}</span>}
              </dt>
              <dd className="font-heading text-4xl font-bold tracking-tight text-white">
                {s.value ?? (
                  <span data-todo="impact-number" className="inline-block rounded-full border border-dashed border-maroon-200/60 px-3 py-1 text-base font-semibold text-maroon-100">
                    TODO
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        {!impactStats.some((s) => s.asOfDate) && (
          <div className="mt-6">
            <Todo id="impact-as-of">Confirmed figures and an “as of” date for each number.</Todo>
          </div>
        )}
      </Section>

      <Section id="stories" tone="white" eyebrow="Stories" title="Patient stories" action={<ButtonLink to="/impact/stories/" variant="ghost">All stories</ButtonLink>}>
        {patient.length ? (
          <ul className="grid gap-5 md:grid-cols-3">
            {patient.map((s) => (
              <li key={s.slug}>
                <StoryCard story={s} />
              </li>
            ))}
          </ul>
        ) : (
          <Todo id="patient-stories">3–5 patient stories with written consent (a short video also works).</Todo>
        )}
      </Section>

      <Section id="camps" eyebrow="News" title="Medical camps & updates" action={<ButtonLink to="/impact/camps/" variant="ghost">All updates</ButtonLink>}>
        {updates.length ? (
          <ul className="grid gap-5 md:grid-cols-3">
            {updates.map((s) => (
              <li key={s.slug}>
                <StoryCard story={s} />
              </li>
            ))}
          </ul>
        ) : (
          <Todo id="camp-updates">Dated posts with photos about medical camps and hospital updates.</Todo>
        )}
      </Section>

      <Section id="gallery" tone="white" eyebrow="Gallery" title="Inside Sai Aarogya" action={<ButtonLink to="/impact/gallery/" variant="ghost">Full gallery</ButtonLink>}>
        <Gallery limit={6} showFilters={false} />
      </Section>

      <SupportCta />
    </>
  );
}
