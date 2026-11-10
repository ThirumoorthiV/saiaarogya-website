import { about } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Timeline } from "@/components/about/AboutParts";

/** History & Timeline (§5.2). */
export function Component() {
  const path = "/about/history/";
  const meta = getPageMeta(path);
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHeader title={meta.h1 ?? meta.title} intro="Sai Aarogya Hospital – Bapatla" crumbs={meta.crumbs} path={path} />
      <Section id="timeline" title="Timeline">
        <Timeline />
      </Section>
      <Section id="story" tone="cream" title="The story in full">
        <div className="prose-body max-w-prose text-lg text-ink-900">
          {about.history.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Section>
    </>
  );
}
