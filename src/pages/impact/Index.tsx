import { impactStats, stories } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
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
            <div key={s.label} className="surface flex flex-col-reverse p-6">
              <dt className="mt-2 font-medium text-ink-700">
                {s.label}
                {s.asOfDate && <span className="block text-sm font-normal text-ink-600">as of {formatDate(s.asOfDate)}</span>}
              </dt>
              <dd className="font-heading text-4xl font-bold tracking-tight text-maroon-700">{s.value ?? "—"}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        id="stories"
        tone="white"
        eyebrow="Stories"
        title="Patient stories"
        action={
          <ButtonLink to="/impact/stories/" variant="ghost">
            All stories
          </ButtonLink>
        }
      >
        {patient.length ? (
          <ul className="grid gap-5 md:grid-cols-3">
            {patient.map((s) => (
              <li key={s.slug}>
                <StoryCard story={s} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-700">Stories from our patients will be shared here soon.</p>
        )}
      </Section>

      <Section
        id="camps"
        eyebrow="News"
        title="Medical camps & updates"
        action={
          <ButtonLink to="/impact/camps/" variant="ghost">
            All updates
          </ButtonLink>
        }
      >
        {updates.length ? (
          <ul className="grid gap-5 md:grid-cols-3">
            {updates.map((s) => (
              <li key={s.slug}>
                <StoryCard story={s} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="surface p-6 text-ink-700">Medical camp reports and hospital updates will be posted here soon.</p>
        )}
      </Section>

      <Section
        id="gallery"
        tone="white"
        eyebrow="Gallery"
        title="Inside Sai Aarogya"
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
