import { about } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { GovernanceGroups } from "@/components/about/AboutParts";

/** Governance (§5.2): Board of Trustees · Advisors · Management Committee. */
export function Component() {
  const path = "/about/governance/";
  const meta = getPageMeta(path);
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHero title={meta.h1 ?? meta.title} eyebrow={<p className="eyebrow">About us</p>} intro={meta.description} crumbs={meta.crumbs} path={path} />
      <div className="py-16 md:py-24">
        <Container>
          <GovernanceGroups groups={about.governance} />
        </Container>
      </div>
    </>
  );
}
