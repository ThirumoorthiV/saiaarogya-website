import { impactStats, stories } from "@/content";
import { usePick } from "@/i18n/LangContext";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";
import { StoryCard, formatDate } from "@/components/impact/StoryCard";
import { Gallery } from "@/components/impact/Gallery";
import { SupportCta } from "@/components/sections/SupportCta";

/** Our Impact (§5.6): impact at a glance, stories, camps & updates, gallery. */
export function Component() {
  const pick = usePick();
  const path = "/impact/";
  const meta = getPageMeta(path);
  const patientStories = stories.filter((s) => s.category === "Patient").slice(0, 3);
  const updates = stories.filter((s) => s.category !== "Patient").slice(0, 3);

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHeader title={meta.h1 ?? meta.title} intro={meta.description} crumbs={meta.crumbs} path={path} />

      <Section id="glance" tone="maroon" title="Impact at a glance">
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {impactStats.map((s) => (
            <div key={s.label.en} className="flex flex-col-reverse rounded-card bg-maroon-900/60 p-5 text-center">
              <dt className="mt-2 text-white">
                {pick(s.label)}
                {s.asOfDate && <span className="block text-sm text-white/85">as of {formatDate(s.asOfDate)}</span>}
              </dt>
              <dd className="font-heading text-4xl font-semibold text-gold-400">
                {s.value ?? (
                  <span data-todo="impact-number" className="inline-block rounded-md border-2 border-dashed border-gold-400 px-3 py-1 text-base font-medium">
                    TODO
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        {!impactStats.some((s) => s.asOfDate) && (
          <p data-todo="impact-as-of" className="mt-6 text-sm text-white/90">
            TODO: confirmed figures and an “as of” date for each number.
          </p>
        )}
      </Section>

      <Section
        id="stories"
        title="Patient stories"
        action={
          <ButtonLink to="/impact/stories/" variant="ghost">
            All stories
          </ButtonLink>
        }
      >
        {patientStories.length ? (
          <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
            {patientStories.map((s) => (
              <li key={s.slug}>
                <StoryCard story={s} />
              </li>
            ))}
          </ul>
        ) : (
          <Todo id="patient-stories">3–5 patient stories with written consent (a short video also works).</Todo>
        )}
      </Section>

      <Section
        id="camps"
        tone="cream"
        title="Medical camps & updates"
        action={
          <ButtonLink to="/impact/camps/" variant="ghost">
            All updates
          </ButtonLink>
        }
      >
        {updates.length ? (
          <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
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

      <Section
        id="gallery"
        title="Gallery"
        action={
          <ButtonLink to="/impact/gallery/" variant="ghost">
            Full gallery
          </ButtonLink>
        }
      >
        <Gallery limit={6} showFilters={false} />
      </Section>

      <SupportCta />
    </>
  );
}
