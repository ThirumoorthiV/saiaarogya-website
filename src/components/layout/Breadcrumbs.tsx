import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import { Head } from "vite-react-ssg";
import { localizePath, useLang, useT } from "@/i18n/LangContext";
import { breadcrumbSchema } from "@/lib/schema";
import { LLink } from "@/components/ui/LLink";

export interface Crumb {
  label: string;
  /** English path; omit for the current page */
  to?: string;
}

/** Breadcrumb trail for inner pages (§5.9) + BreadcrumbList JSON-LD (§8). */
export function Breadcrumbs({ items, currentPath }: { items: Crumb[]; currentPath: string }) {
  const t = useT();
  const lang = useLang();
  const all: Crumb[] = [{ label: t("nav.home"), to: "/" }, ...items];
  const schema = breadcrumbSchema(
    all.map((c) => ({ name: c.label, path: localizePath(c.to ?? currentPath, lang) })),
  );

  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Head>
      <nav aria-label={t("a11y.breadcrumb")} className="text-sm">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-ink-600">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <Fragment key={`${c.label}-${i}`}>
                <li>
                  {last || !c.to ? (
                    <span aria-current={last ? "page" : undefined} className="font-medium text-ink-900">
                      {c.label}
                    </span>
                  ) : (
                    <LLink to={c.to} className="text-maroon-700 underline">
                      {c.label}
                    </LLink>
                  )}
                </li>
                {!last && (
                  <li aria-hidden className="text-ink-600">
                    <ChevronRight className="h-4 w-4" />
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
