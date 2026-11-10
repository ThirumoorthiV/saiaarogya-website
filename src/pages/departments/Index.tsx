import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { departments } from "@/content";
import { pick, useLang, useT } from "@/i18n/LangContext";
import { getPageMeta } from "@/lib/pageMeta";
import { SITE_URL } from "@/lib/staticPaths";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { DepartmentCard } from "@/components/departments/DepartmentCard";
import { ButtonLink } from "@/components/ui/Button";
import { siteSettings } from "@/content";

/** Departments listing (§5.3): hero → search → card grid with doctor counts. */
export function Component() {
  const lang = useLang();
  const t = useT();
  const path = "/departments/";
  const meta = getPageMeta(path);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter((d) =>
      [pick(d.name, lang), d.name.en, d.summary?.en ?? "", ...d.services.map((s) => s.en)].join(" ").toLowerCase().includes(q),
    );
  }, [query, lang]);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Departments at Sai Aarogya Hospital, Bapatla",
    itemListElement: departments.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/departments/${d.slug}/`,
      name: d.name.en,
    })),
  };

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} schema={[itemList]} />
      <PageHeader title={meta.h1 ?? meta.title} intro={meta.description} crumbs={meta.crumbs} path={path}>
        <div className="mt-8 max-w-xl">
          <label htmlFor="dept-search" className="mb-2 block font-semibold text-ink-900">
            {t("departmentsPage.searchLabel")}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-600" aria-hidden />
            <input
              id="dept-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("departmentsPage.searchPlaceholder")}
              className="block min-h-12 w-full rounded-btn border border-ink-600/40 bg-white py-3 pl-12 pr-12 text-base focus:border-maroon-700 focus:outline-none focus:ring-2 focus:ring-maroon-700/30"
              aria-controls="dept-results"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-ink-600 hover:bg-cream-100"
              >
                <X className="h-5 w-5" aria-hidden />
                <span className="sr-only">{t("departmentsPage.clearSearch")}</span>
              </button>
            )}
          </div>
        </div>
      </PageHeader>

      <Section tone="white">
        <p id="dept-count" role="status" className="mb-6 text-ink-600">
          {results.length === departments.length
            ? t("departmentsPage.countAll", { count: departments.length })
            : t("departmentsPage.countMatch", { shown: results.length, total: departments.length, query })}
        </p>
        {results.length ? (
          <ul id="dept-results" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {results.map((d) => (
              <li key={d.slug}>
                <DepartmentCard department={d} showCount />
              </li>
            ))}
          </ul>
        ) : (
          <div id="dept-results" className="rounded-card bg-cream-100 p-8 text-center">
            <p className="font-heading text-xl text-maroon-700">{t("departmentsPage.noMatch", { query })}</p>
            <p className="mt-2 text-ink-600">{t("departmentsPage.noMatchText")}</p>
            <ButtonLink to={`tel:${siteSettings.phone}`} className="mt-4" track="call-dept-empty">
              {t("departmentsPage.callPhone", { phone: siteSettings.phoneDisplay })}
            </ButtonLink>
          </div>
        )}
      </Section>
    </>
  );
}
