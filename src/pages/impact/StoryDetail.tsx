import { useParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { getStory } from "@/content";
import { usePick } from "@/i18n/LangContext";
import { fitDescription } from "@/lib/describe";
import { SITE_URL } from "@/lib/staticPaths";
import { HOSPITAL_ID } from "@/lib/schema";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate } from "@/components/impact/StoryCard";
import { Component as NotFound } from "@/pages/NotFound";

/** Single story / camp update (§5.6). Patient stories are only published with consent. */
export function Component() {
  const { slug = "" } = useParams();
  const pick = usePick();
  const story = getStory(slug);
  if (!story) return <NotFound />;

  const path = `/impact/stories/${story.slug}/`;
  const title = pick(story.title);
  const isPatient = story.category === "Patient";
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title.en,
    datePublished: story.date,
    image: story.coverImage ? `${SITE_URL}${story.coverImage}` : undefined,
    publisher: { "@id": HOSPITAL_ID },
    mainEntityOfPage: `${SITE_URL}${path}`,
  };

  return (
    <>
      <Seo
        title={story.title.en}
        description={fitDescription([story.body[0]?.en ?? story.title.en])}
        path={path}
        type="article"
        image={story.coverImage ?? undefined}
        imageAlt={story.coverAlt}
        schema={[article]}
      />
      <PageHeader
        title={title}
        crumbs={[{ label: "Our Impact", to: "/impact/" }, isPatient ? { label: "Patient Stories", to: "/impact/stories/" } : { label: "Camps & Updates", to: "/impact/camps/" }, { label: title }]}
        path={path}
        intro={
          <p className="inline-flex items-center gap-2 text-base">
            <CalendarDays className="h-5 w-5" aria-hidden />
            <time dateTime={story.date}>{formatDate(story.date)}</time>
          </p>
        }
      />
      <Section>
        <article className="mx-auto max-w-prose">
          {story.coverImage && (
            <img src={story.coverImage} alt={story.coverAlt} width={1200} height={750} className="mb-8 w-full rounded-card object-cover shadow-card" />
          )}
          <div className="prose-body text-lg text-ink-900">
            {story.body.map((p, i) => (
              <p key={i}>{pick(p)}</p>
            ))}
          </div>
          <div className="mt-10">
            <ButtonLink to={isPatient ? "/impact/stories/" : "/impact/camps/"} variant="secondary">
              {isPatient ? "More patient stories" : "More updates"}
            </ButtonLink>
          </div>
        </article>
      </Section>
    </>
  );
}
