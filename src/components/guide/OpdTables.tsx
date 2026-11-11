import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { departments, doctors, getDepartment, opdTimings, siteSettings } from "@/content";
import { formatTime } from "@/lib/opdStatus";
import { DAYS, type DayOfWeek, type OpdTiming } from "@/types";
import { OpenNowBadge } from "@/components/ui/OpenNowBadge";
import { VisitingBadge } from "@/components/doctors/DoctorCard";

function Table({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    // Focusable so keyboard users can scroll the table sideways on small screens
    <div className="surface overflow-x-auto" role="region" aria-label={caption} tabIndex={0}>
      <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}
const th = "border-b border-ink-200 bg-ink-50 px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-600 md:px-6";
const td = "border-b border-ink-200/70 px-5 py-4 align-top md:px-6";
const tr = "transition-colors hover:bg-maroon-50 [&:last-child>*]:border-b-0";

const dayRange = (days: DayOfWeek[]) => {
  const idx = days.map((d) => DAYS.indexOf(d)).sort((a, b) => a - b);
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1]! + 1);
  return contiguous && idx.length > 2 ? `${DAYS[idx[0]!]}–${DAYS[idx[idx.length - 1]!]}` : days.join(", ");
};

/** Merge a department's per-day rows that share the same time and notes into one row ("Mon–Sat"). */
const groupByTime = (rows: OpdTiming[]) => {
  const groups = new Map<string, Omit<OpdTiming, "day"> & { days: DayOfWeek[] }>();
  for (const r of [...rows].sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day))) {
    const key = `${r.startTime}|${r.endTime}|${r.notes ?? ""}`;
    const g = groups.get(key);
    if (g) g.days.push(r.day);
    else groups.set(key, { department: r.department, startTime: r.startTime, endTime: r.endTime, notes: r.notes, days: [r.day] });
  }
  return [...groups.values()];
};

function Heading({ children, extra }: { children: ReactNode; extra?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <h2 className="text-h3 md:text-2xl">{children}</h2>
      {extra}
    </div>
  );
}

/** General OPD hours from SiteSettings, with the live "Open now" badge. */
export function GeneralHours() {
  const s = siteSettings;
  return (
    <section>
      <Heading extra={<OpenNowBadge />}>General OPD hours</Heading>
      {s.opdHours.length ? (
        <Table caption="General OPD hours">
          <thead>
            <tr>
              <th scope="col" className={th}>
                Days
              </th>
              <th scope="col" className={th}>
                Hours
              </th>
            </tr>
          </thead>
          <tbody>
            {s.opdHours.map((r) => (
              <tr key={r.days.join()} className={tr}>
                <td className={`${td} font-semibold`}>{dayRange(r.days)}</td>
                <td className={td}>
                  {formatTime(r.open)} – {formatTime(r.close)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-ink-700">Please call the hospital desk for OPD timings.</p>
      )}
      {s.holidayNotice && (
        <p role="note" className="mt-4 flex items-start gap-2.5 rounded-2xl bg-maroon-50 p-4 text-ink-900">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-maroon-700" aria-hidden />
          <span>
            <strong>Holiday notice:</strong> {s.holidayNotice}
          </span>
        </p>
      )}
    </section>
  );
}

/** Department × day schedule from the OPDTimings collection. */
export function DepartmentSchedule({ departmentSlug }: { departmentSlug?: string }) {
  const rows = departmentSlug ? opdTimings.filter((o) => o.department === departmentSlug) : opdTimings;
  const depts = departmentSlug ? departments.filter((d) => d.slug === departmentSlug) : departments;
  return (
    <section>
      <Heading>{departmentSlug ? "OPD days & timings" : "Department schedule"}</Heading>
      {rows.length ? (
        <Table caption="Department schedule">
          <thead>
            <tr>
              <th scope="col" className={th}>
                Department
              </th>
              <th scope="col" className={th}>
                Days
              </th>
              <th scope="col" className={th}>
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {depts.flatMap((d) =>
              groupByTime(rows.filter((r) => r.department === d.slug)).map((r) => (
                <tr key={`${d.slug}-${r.days.join()}-${r.startTime}`} className={tr}>
                  <th scope="row" className={`${td} font-semibold`}>
                    <Link to={`/departments/${d.slug}/`}>{d.name}</Link>
                  </th>
                  <td className={td}>{dayRange(r.days)}</td>
                  <td className={td}>
                    {formatTime(r.startTime)} – {formatTime(r.endTime)}
                    {r.notes && <span className="block text-sm text-ink-600">{r.notes}</span>}
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </Table>
      ) : (
        <p className="text-ink-700">Please call the hospital desk for department timings.</p>
      )}
    </section>
  );
}

/** Doctor visiting schedule — who visits on which day. */
export function DoctorSchedule() {
  return (
    <section>
      <Heading>Doctor visiting schedule</Heading>
      <Table caption="Doctor visiting schedule">
        <thead>
          <tr>
            <th scope="col" className={th}>
              Doctor
            </th>
            <th scope="col" className={th}>
              Department
            </th>
            <th scope="col" className={th}>
              Visiting days
            </th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d.slug} className={tr}>
              <th scope="row" className={`${td} font-semibold`}>
                <Link to={`/doctors/${d.slug}/`}>{d.name}</Link>
                <span className="block text-sm font-normal text-ink-600">{d.qualification}</span>
              </th>
              <td className={td}>{getDepartment(d.department)?.name}</td>
              <td className={td}>
                <VisitingBadge doctor={d} />
                {d.timing && <span className="mt-1.5 block text-sm text-ink-600">{d.timing}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
