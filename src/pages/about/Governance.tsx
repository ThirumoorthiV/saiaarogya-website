import { about } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { GovernanceGroups } from "@/components/about/AboutParts";

/** Governance (§5.2): Board of Trustees · Advisors · Management Committee. */
export function Component() {
  const path = "/about/governance/";
  const meta = getPageMeta(path);
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHeader title={meta.h1 ?? meta.title} intro={meta.description} crumbs={meta.crumbs} path={path} />
      <div className="bg-cream-100/60 py-section-sm md:py-section">
        <Container>
          <GovernanceGroups groups={about.governance} />
        </Container>
      </div>
    </>
  );
}
