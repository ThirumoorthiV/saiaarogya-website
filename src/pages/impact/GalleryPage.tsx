import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Gallery } from "@/components/impact/Gallery";

/** Gallery (§5.6): filterable Hospital · Camps · Events, with lightbox. */
export function Component() {
  const path = "/impact/gallery/";
  const meta = getPageMeta(path);
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHero title={meta.h1 ?? meta.title} eyebrow={<p className="eyebrow">Our impact</p>} intro={meta.description} crumbs={meta.crumbs} path={path} />
      <div className="py-14 md:py-20">
        <Container>
          <Gallery />
        </Container>
      </div>
    </>
  );
}
