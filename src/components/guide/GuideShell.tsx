import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Phone } from "lucide-react";
import { siteSettings, tel } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { GUIDE_LINKS } from "@/lib/navigation";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

/** Section tabs for the Patient Guide (scrollable pills on mobile). Hover uses a light maroon tint. */
function GuideTabs() {
  const { pathname } = useLocation();
  const tabs = [{ label: "Overview", to: "/patient-guide/", icon: BookOpen }, ...GUIDE_LINKS];
  return (
    <nav aria-label="Patient Guide sections" className="sticky top-[72px] z-30 border-b border-ink-200/70 bg-white/90 backdrop-blur-xl">
      <Container>
        <ul className="-mx-4 flex gap-1.5 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:mx-0 sm:px-0">
          {tabs.map((t) => {
            const current = pathname === t.to;
            const Icon = t.icon;
            return (
              <li key={t.to} className="shrink-0">
                <Link
                  to={t.to}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[15px] font-semibold no-underline transition-colors",
                    current ? "bg-maroon-700 text-white [&_svg]:text-yellow-400" : "text-ink-700 hover:bg-maroon-100 hover:text-maroon-900",
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" aria-hidden />}
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
}

/** "Still have a question? Call us" band at the end of guide pages. */
export function CallStrip() {
  return (
    <div className="flex flex-col items-start gap-5 rounded-4xl border border-maroon-100 bg-gradient-to-br from-maroon-50 via-white to-maroon-50 shadow-soft p-7 md:flex-row md:items-center md:justify-between md:p-10">
      <div>
        <h2 className="font-heading text-2xl font-bold text-ink-900">Still have a question?</h2>
        <p className="mt-1 text-ink-600">Call us — our team is happy to help.</p>
      </div>
      <ButtonLink to={tel} size="lg" icon={<Phone className="h-5 w-5" aria-hidden />} track="call-guide-strip">
        {`Call ${siteSettings.phoneDisplay}`}
      </ButtonLink>
    </div>
  );
}

/** Shared shell for Patient Guide pages: SEO, hero, section tabs, content, call band. */
export function GuideShell({ path, intro, schema, children }: { path: string; intro?: ReactNode; schema?: (Record<string, unknown> | null)[]; children: ReactNode }) {
  const meta = getPageMeta(path);
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} schema={schema} />
      <PageHero title={meta.h1 ?? meta.title} eyebrow={<p className="eyebrow">Patient Guide</p>} intro={intro ?? meta.description} crumbs={meta.crumbs} path={path} />
      <GuideTabs />
      <div className="py-14 md:py-20">
        <Container className="space-y-14 md:space-y-20">
          {children}
          <CallStrip />
        </Container>
      </div>
    </>
  );
}
