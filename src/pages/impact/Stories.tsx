import { stories } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { StoryCard } from "@/components/impact/StoryCard";

/** Listing used for /impact/stories/ (patient stories) and /impact/camps/ (camps & updates). */
export function StoryListing({ path, kind }: { path: string; kind: "patient" | "updates" }) {
  const meta = getPageMeta(path);
  const items = stories.filter((s) => (kind === "patient" ? s.category === "Patient" : s.category !== "Patient"));
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHero title={meta.h1 ?? meta.title} eyebrow={<p className="eyebrow">Our impact</p>} intro={meta.description} crumbs={meta.crumbs} path={path} />
      <div className="py-14 md:py-20">
        <Container>
          {items.length ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (
                <li key={s.slug}>
                  <StoryCard story={s} />
                </li>
              ))}
            </ul>
          ) : kind === "patient" ? (
            <p className="text-ink-700">Stories from our patients will be shared here soon.</p>
          ) : (
            <p className="surface p-6 text-ink-700">Medical camp reports and hospital updates will be posted here soon.</p>
          )}
        </Container>
      </div>
    </>
  );
}

export function Component() {
  return <StoryListing path="/impact/stories/" kind="patient" />;
}
