import { stories } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Todo } from "@/components/ui/Todo";
import { StoryCard } from "@/components/impact/StoryCard";

/** Listing used for /impact/stories/ (patient stories) and /impact/camps/ (camps & updates). */
function StoryListing({ path, kind }: { path: string; kind: "patient" | "updates" }) {
  const meta = getPageMeta(path);
  const items = stories.filter((s) => (kind === "patient" ? s.category === "Patient" : s.category !== "Patient"));
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHeader title={meta.h1 ?? meta.title} intro={meta.description} crumbs={meta.crumbs} path={path} />
      <Section>
        {items.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {items.map((s) => (
              <li key={s.slug}>
                <StoryCard story={s} />
              </li>
            ))}
          </ul>
        ) : kind === "patient" ? (
          <Todo id="patient-stories">
            3–5 patient stories with written consent. Add them in the CMS under “Stories &amp; camp updates” with category “Patient” and tick
            “Written consent received” — stories without consent are never shown.
          </Todo>
        ) : (
          <Todo id="camp-updates">Medical camp and hospital update posts (category “Camp” or “Update”) with dates and photos.</Todo>
        )}
      </Section>
    </>
  );
}

export function Component() {
  return <StoryListing path="/impact/stories/" kind="patient" />;
}

export function CampsComponent() {
  return <StoryListing path="/impact/camps/" kind="updates" />;
}
