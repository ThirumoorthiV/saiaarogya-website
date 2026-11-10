import { useMemo, useState } from "react";
import { Phone, RotateCcw } from "lucide-react";
import { departments, doctors, siteSettings } from "@/content";
import { usePick } from "@/i18n/LangContext";
import { getPageMeta } from "@/lib/pageMeta";
import { SITE_URL } from "@/lib/staticPaths";
import { DAYS, visitsOn, type DayOfWeek, type DoctorType } from "@/types";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { ButtonLink, Button } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";
import { inputClass } from "@/components/forms/Field";
import { cn } from "@/components/ui/cn";

const DAY_LABELS: Record<DayOfWeek, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

/** Doctors directory (§5.4): filter by department, visiting day and Resident / Consultant. */
export function Component() {
  const pick = usePick();
  const path = "/doctors/";
  const meta = getPageMeta(path);
  const [dept, setDept] = useState("");
  const [day, setDay] = useState<DayOfWeek | "">("");
  const [type, setType] = useState<DoctorType | "">("");

  const results = useMemo(
    () =>
      doctors.filter(
        (d) => (!dept || d.department === dept) && (!day || visitsOn(d.visitingDays, day)) && (!type || d.type === type),
      ),
    [dept, day, type],
  );
  const filtered = Boolean(dept || day || type);
  const schedulesKnown = doctors.some((d) => d.visitingDays.length > 0);
  const reset = () => {
    setDept("");
    setDay("");
    setType("");
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Doctors at Sai Aarogya Hospital, Bapatla",
    itemListElement: doctors.map((d, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/doctors/${d.slug}/`, name: d.name })),
  };

  const typeChip = (value: DoctorType | "", label: string) => (
    <button
      type="button"
      onClick={() => setType(value)}
      aria-pressed={type === value}
      className={cn(
        "inline-flex min-h-12 items-center rounded-full border px-5 text-base font-semibold",
        type === value ? "border-maroon-700 bg-maroon-700 text-white" : "border-maroon-700/30 bg-white text-maroon-700 hover:bg-maroon-50",
      )}
    >
      {label}
    </button>
  );

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} schema={[itemList]} />
      <PageHeader title={meta.h1 ?? meta.title} intro={meta.description} crumbs={meta.crumbs} path={path} />

      <Section tone="white" className="!pt-8 md:!pt-12">
        <form role="search" aria-label="Filter doctors" onSubmit={(e) => e.preventDefault()} className="rounded-card bg-cream-100 p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div>
              <label htmlFor="f-dept" className="mb-1.5 block font-semibold">
                Department
              </label>
              <select id="f-dept" value={dept} onChange={(e) => setDept(e.target.value)} className={inputClass(false)}>
                <option value="">All departments</option>
                {departments.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {pick(d.name)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-day" className="mb-1.5 block font-semibold">
                Visiting day
              </label>
              <select id="f-day" value={day} onChange={(e) => setDay(e.target.value as DayOfWeek | "")} className={inputClass(false)}>
                <option value="">Any day</option>
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {DAY_LABELS[d]}
                  </option>
                ))}
              </select>
            </div>
            <fieldset>
              <legend className="mb-1.5 block font-semibold">Doctor type</legend>
              <div className="flex flex-wrap gap-2">
                {typeChip("", "All")}
                {typeChip("Resident", "Resident")}
                {typeChip("Consultant", "Consultant")}
              </div>
            </fieldset>
          </div>
          {!schedulesKnown && (
            <div className="mt-4">
              <Todo id="doctor-visiting-days">
                Visiting days are not yet confirmed for any doctor, so the “Visiting day” filter cannot find matches yet.
              </Todo>
            </div>
          )}
        </form>

        <div className="mb-6 mt-8 flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="text-ink-600">
            {filtered ? `Showing ${results.length} of ${doctors.length} doctors` : `${doctors.length} doctors`}
          </p>
          {filtered && (
            <Button variant="ghost" onClick={reset} icon={<RotateCcw className="h-4 w-4" aria-hidden />}>
              Clear filters
            </Button>
          )}
        </div>

        {results.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
            {results.map((d) => (
              <li key={d.slug}>
                <DoctorCard doctor={d} headingLevel="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-card bg-cream-100 p-8 text-center">
            <p className="font-heading text-xl text-maroon-700">
              {day ? "No doctor visiting on this day — call us for help" : "No doctor matches these filters — call us for help"}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <ButtonLink to={`tel:${siteSettings.phone}`} icon={<Phone className="h-5 w-5" aria-hidden />} track="call-doctors-empty">
                {`Call ${siteSettings.phoneDisplay}`}
              </ButtonLink>
              <Button variant="secondary" onClick={reset}>
                Clear filters
              </Button>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
