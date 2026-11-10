import { useParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { getStory } from "@/content";
import { fitDescription } from "@/lib/describe";
import { SITE_URL } from "@/lib/staticPaths";
import { HOSPITAL_ID } from "@/lib/schema";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate } from "@/components/impact/StoryCard";
import { Component as NotFound } from "@/pages/NotFound";

/** Single story / camp update (§5.6). Patient stories are only published with consent. */
export function Component() {
  const { slug = "" } = useParams();
  const story = getStory(slug);
  if (!story) return <NotFound />;
  const path = `/impact/stories/${story.slug}/`;
  const isPatient = story.category === "Patient";
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    datePublished: story.date,
    image: story.coverImage ? `${SITE_URL}${story.coverImage}` : undefined,
    publisher: { "@id": HOSPITAL_ID },
    mainEntityOfPage: `${SITE_URL}${path}`,
  };
  return (
    <>
      <Seo title={story.title} description={fitDescription([story.body[0] ?? story.title])} path={path} type="article" image={story.coverImage ?? undefined} imageAlt={story.coverAlt} schema={[article]} />
      <PageHero
        title={story.title}
        crumbs={[{ label: "Our Impact", to: "/impact/" }, isPatient ? { label: "Patient Stories", to: "/impact/stories/" } : { label: "Camps & Updates", to: "/impact/camps/" }, { label: story.title }]}
        path={path}
        intro={
          <p className="inline-flex items-center gap-2 text-base">
            <CalendarDays className="h-5 w-5" aria-hidden />
            <time dateTime={story.date}>{formatDate(story.date)}</time>
          </p>
        }
      />
      <div className="py-14 md:py-20">
        <Container>
          <article className="mx-auto max-w-prose">
            {story.coverImage && <img src={story.coverImage} alt={story.coverAlt} width={1200} height={750} className="mb-10 w-full rounded-4xl object-cover shadow-lift" />}
            <div className="prose-body text-lg text-ink-700">
              {story.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-12">
              <ButtonLink to={isPatient ? "/impact/stories/" : "/impact/camps/"} variant="soft">
                {isPatient ? "More patient stories" : "More updates"}
              </ButtonLink>
            </div>
          </article>
        </Container>
      </div>
    </>
  );
}
