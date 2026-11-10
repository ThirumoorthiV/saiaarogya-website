import { about } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Timeline } from "@/components/about/AboutParts";

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
        <div className="prose-body max-w-prose text-lg text-ink-700">
          {about.history.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Section>
    </>
  );
}
