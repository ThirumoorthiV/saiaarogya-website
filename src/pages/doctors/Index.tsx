import { useMemo, useState } from "react";
import { Phone, RotateCcw } from "lucide-react";
import { departments, doctors, siteSettings, tel } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { SITE_URL } from "@/lib/staticPaths";
import { DAYS, DAY_NAMES, visitsOn, type DayOfWeek, type DoctorType } from "@/types";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";
import { Select } from "@/components/ui/Select";
import { cn } from "@/components/ui/cn";

/** Doctors directory (§5.4): filter by department, visiting day and Resident / Consultant. */
export function Component() {
  const path = "/doctors/";
  const meta = getPageMeta(path);
  const [dept, setDept] = useState("");
  const [day, setDay] = useState<DayOfWeek | "">("");
  const [type, setType] = useState<DoctorType | "">("");

  const results = useMemo(
    () => doctors.filter((d) => (!dept || d.department === dept) && (!day || visitsOn(d.visitingDays, day)) && (!type || d.type === type)),
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

  const chip = (value: DoctorType | "", label: string) => (
    <button
      type="button"
      onClick={() => setType(value)}
      aria-pressed={type === value}
      className={cn(
        "inline-flex min-h-12 items-center rounded-full px-5 text-[15px] font-semibold transition-colors",
        type === value ? "bg-maroon-700 text-white" : "border border-ink-200 bg-white text-ink-700 hover:border-maroon-200 hover:bg-maroon-100 hover:text-maroon-900",
      )}
    >
      {label}
    </button>
  );

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} schema={[itemList]} />
      <PageHero title={meta.h1 ?? meta.title} eyebrow={<p className="eyebrow">{doctors.length} doctors</p>} intro={meta.description} crumbs={meta.crumbs} path={path} />

      <div className="py-12 md:py-16">
        <Container>
          <form role="search" aria-label="Filter doctors" onSubmit={(e) => e.preventDefault()} className="surface p-4 md:p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <div>
                <span id="f-dept-label" className="mb-1.5 block text-[15px] font-semibold">
                  Department
                </span>
                <Select
                  id="f-dept"
                  labelId="f-dept-label"
                  value={dept}
                  onChange={setDept}
                  options={[{ value: "", label: "All departments" }, ...departments.map((d) => ({ value: d.slug, label: d.name }))]}
                />
              </div>
              <div>
                <span id="f-day-label" className="mb-1.5 block text-[15px] font-semibold">
                  Visiting day
                </span>
                <Select
                  id="f-day"
                  labelId="f-day-label"
                  value={day}
                  onChange={(v) => setDay(v as DayOfWeek | "")}
                  options={[{ value: "", label: "Any day" }, ...DAYS.map((d) => ({ value: d, label: DAY_NAMES[d] }))]}
                />
              </div>
              <fieldset>
                <legend className="mb-1.5 block text-[15px] font-semibold">Doctor type</legend>
                <div className="flex flex-wrap gap-2">
                  {chip("", "All")}
                  {chip("Resident", "Resident")}
                  {chip("Consultant", "Consultant")}
                </div>
              </fieldset>
            </div>
            {!schedulesKnown && (
              <div className="mt-4">
                <Todo id="doctor-visiting-days">Visiting days are not yet confirmed for any doctor, so the “Visiting day” filter cannot find matches yet.</Todo>
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
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((d) => (
                <li key={d.slug}>
                  <DoctorCard doctor={d} headingLevel="h2" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="surface p-10 text-center">
              <p className="font-heading text-xl font-bold text-ink-900">{day ? "No doctor visiting on this day — call us for help" : "No doctor matches these filters — call us for help"}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <ButtonLink to={tel} icon={<Phone className="h-[18px] w-[18px]" aria-hidden />} track="call-doctors-empty">
                  {`Call ${siteSettings.phoneDisplay}`}
                </ButtonLink>
                <Button variant="outline" onClick={reset}>
                  Clear filters
                </Button>
              </div>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
