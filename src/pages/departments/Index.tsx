import { useMemo, useState } from "react";
import { Phone, Search, X } from "lucide-react";
import { departments, siteSettings, tel } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { SITE_URL } from "@/lib/staticPaths";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { DepartmentCard } from "@/components/departments/DepartmentCard";
import { ButtonLink } from "@/components/ui/Button";

/** Departments listing (§5.3): hero → search → card grid with doctor counts. */
export function Component() {
  const path = "/departments/";
  const meta = getPageMeta(path);
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter((d) => [d.name, d.summary ?? "", ...d.services].join(" ").toLowerCase().includes(q));
  }, [query]);
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Departments at Sai Aarogya Hospital, Bapatla",
    itemListElement: departments.map((d, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/departments/${d.slug}/`, name: d.name })),
  };

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} schema={[itemList]} />
      <PageHero title={meta.h1 ?? meta.title} eyebrow={<p className="eyebrow">10 specialities · all free</p>} intro={meta.description} crumbs={meta.crumbs} path={path}>
        <div className="mt-8 max-w-xl">
          <label htmlFor="dept-search" className="sr-only">
            Search departments, treatments or conditions
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-maroon-700" aria-hidden />
            <input
              id="dept-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. cataract, fracture, pregnancy"
              aria-controls="dept-results"
              className="block min-h-14 w-full rounded-full border border-ink-200 bg-white py-3 pl-14 pr-14 text-base shadow-soft transition hover:border-maroon-300 focus:border-maroon-700 focus:outline-none focus:ring-4 focus:ring-maroon-100"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-ink-600 hover:bg-maroon-100 hover:text-maroon-900"
              >
                <X className="h-5 w-5" aria-hidden />
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </div>
        </div>
      </PageHero>

      <div className="py-14 md:py-20">
        <Container>
          <p role="status" className="mb-6 text-ink-600">
            {results.length === departments.length
              ? `${departments.length} specialities — all treatment is free of charge.`
              : `${results.length} of ${departments.length} departments match “${query}”.`}
          </p>
          {results.length ? (
            <ul id="dept-results" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
              {results.map((d) => (
                <li key={d.slug}>
                  <DepartmentCard department={d} showCount />
                </li>
              ))}
            </ul>
          ) : (
            <div id="dept-results" className="surface p-10 text-center">
              <p className="font-heading text-xl font-bold text-ink-900">No department matches “{query}”.</p>
              <p className="mt-2 text-ink-600">Call us and our team will guide you to the right doctor.</p>
              <ButtonLink to={tel} className="mt-6" icon={<Phone className="h-[18px] w-[18px]" aria-hidden />} track="call-dept-empty">
                {`Call ${siteSettings.phoneDisplay}`}
              </ButtonLink>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
