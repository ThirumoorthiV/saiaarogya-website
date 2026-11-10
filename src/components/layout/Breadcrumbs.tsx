import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Head } from "vite-react-ssg";
import { breadcrumbSchema } from "@/lib/schema";
import { cn } from "@/components/ui/cn";

export interface Crumb {
  label: string;
  /** Path; omit for the current page */
  to?: string;
}

/** Breadcrumb trail for inner pages (§5.9) + BreadcrumbList JSON-LD (§8). */
export function Breadcrumbs({ items, currentPath, onDark = false }: { items: Crumb[]; currentPath: string; onDark?: boolean }) {
  const all: Crumb[] = [{ label: "Home", to: "/" }, ...items];
  const schema = breadcrumbSchema(all.map((c) => ({ name: c.label, path: c.to ?? currentPath })));
  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Head>
      <nav aria-label="Breadcrumb">
        <ol
          className={cn(
            "inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl px-4 py-2 text-sm font-medium",
            onDark ? "bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm" : "bg-white text-ink-700 shadow-soft ring-1 ring-ink-200/70",
          )}
        >
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <Fragment key={`${c.label}-${i}`}>
                <li>
                  {last || !c.to ? (
                    <span aria-current={last ? "page" : undefined} className={cn("font-semibold", onDark ? "text-white" : "text-maroon-800")}>
                      {c.label}
                    </span>
                  ) : (
                    <Link
                      to={c.to}
                      className={cn("inline-flex items-center gap-1.5 rounded-full no-underline hover:underline", onDark ? "text-maroon-100 hover:text-white" : "text-ink-700 hover:text-maroon-700")}
                    >
                      {i === 0 && <Home className={cn("h-4 w-4", onDark ? "text-maroon-100" : "text-maroon-700")} aria-hidden />}
                      {c.label}
                    </Link>
                  )}
                </li>
                {!last && (
                  <li aria-hidden className={onDark ? "text-maroon-200" : "text-ink-500"}>
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
