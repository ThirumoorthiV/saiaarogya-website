import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Head } from "vite-react-ssg";
import { breadcrumbSchema } from "@/lib/schema";

export interface Crumb {
  label: string;
  /** Path; omit for the current page */
  to?: string;
}

/** Breadcrumb trail for inner pages (§5.9) + BreadcrumbList JSON-LD (§8). */
export function Breadcrumbs({ items, currentPath }: { items: Crumb[]; currentPath: string }) {
  const all: Crumb[] = [{ label: "Home", to: "/" }, ...items];
  const schema = breadcrumbSchema(all.map((c) => ({ name: c.label, path: c.to ?? currentPath })));
  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Head>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-ink-600">
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
                    <Link to={c.to} className="inline-flex items-center gap-1 rounded-full text-ink-600 no-underline hover:text-maroon-700">
                      {i === 0 && <Home className="h-3.5 w-3.5" aria-hidden />}
                      {c.label}
                    </Link>
                  )}
                </li>
                {!last && (
                  <li aria-hidden className="text-ink-300">
                    <ChevronRight className="h-3.5 w-3.5" />
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
