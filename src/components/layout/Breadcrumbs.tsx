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
        <ol className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-soft ring-1 ring-ink-200/70">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <Fragment key={`${c.label}-${i}`}>
                <li>
                  {last || !c.to ? (
                    <span aria-current={last ? "page" : undefined} className="font-semibold text-maroon-800">
                      {c.label}
                    </span>
                  ) : (
                    <Link to={c.to} className="inline-flex items-center gap-1.5 rounded-full text-ink-700 no-underline hover:text-maroon-700 hover:underline">
                      {i === 0 && <Home className="h-4 w-4 text-maroon-700" aria-hidden />}
                      {c.label}
                    </Link>
                  )}
                </li>
                {!last && (
                  <li aria-hidden className="text-ink-500">
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
