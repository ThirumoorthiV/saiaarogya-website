import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Todo } from "@/components/ui/Todo";
import { ButtonLink } from "@/components/ui/Button";
import { PAGE_META } from "@/lib/pageMeta";

/**
 * Temporary page used for routes whose content is built in a later phase
 * (roadmap §12). Each is replaced by its real page as the phases progress.
 */
export function Component() {
  const { pathname } = useLocation();
  const enPath = pathname.replace(/^\/te(?=\/)/, "") || "/";
  const normalized = enPath.endsWith("/") ? enPath : `${enPath}/`;
  const meta = PAGE_META[normalized] ?? {
    title: "Page in progress",
    description: "This page of the Sai Aarogya Hospital, Bapatla website is being built. Please call us or visit the Patient Guide for timings and directions.",
    crumbs: [{ label: "In progress" }],
  };

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={normalized} noindex />
      <PageHeader title={meta.title} intro={meta.description} crumbs={meta.crumbs} path={normalized} />
      <Section>
        <div className="flex max-w-prose flex-col gap-6">
          <p className="flex items-center gap-3 text-ink-600">
            <Construction className="h-6 w-6 text-maroon-700" aria-hidden />
            This page is being built in a later phase of the website project.
          </p>
          <Todo id="page-in-progress">Page content is scheduled for a later roadmap phase.</Todo>
          <div>
            <ButtonLink to="/" variant="secondary">
              Back to home
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
