import type { ReactNode } from "react";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { CallStrip, GuideSubnav } from "./GuideParts";

/** Shared shell for Patient Guide pages: SEO, header, section chips, content, call strip. */
export function GuidePage({
  path,
  intro,
  schema,
  actions,
  children,
}: {
  path: string;
  intro?: ReactNode;
  schema?: (Record<string, unknown> | null)[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  const meta = getPageMeta(path);
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} schema={schema} />
      <PageHeader title={meta.h1 ?? meta.title} intro={intro ?? meta.description} crumbs={meta.crumbs} path={path} actions={actions} />
      <GuideSubnav />
      <div className="bg-cream-100/60 py-section-sm md:py-20">
        <Container className="space-y-12 md:space-y-16">
          {children}
          <CallStrip />
        </Container>
      </div>
    </>
  );
}
