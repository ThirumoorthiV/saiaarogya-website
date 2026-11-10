import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Todo } from "@/components/ui/Todo";
import { Gallery } from "@/components/impact/Gallery";

/** Gallery (§5.6): filterable Hospital · Camps · Events, with lightbox. */
export function Component() {
  const path = "/impact/gallery/";
  const meta = getPageMeta(path);
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHeader title={meta.h1 ?? meta.title} intro={meta.description} crumbs={meta.crumbs} path={path} />
      <Section>
        <Gallery />
        <div className="mt-8">
          <Todo id="gallery-photos">More photos: exterior, entrance, OPD, staff, medical camps and events.</Todo>
        </div>
      </Section>
    </>
  );
}
