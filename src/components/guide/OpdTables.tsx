import type { ReactNode } from "react";
import { CalendarDays, Info } from "lucide-react";
import { departments, doctors, opdTimings, siteSettings, getDepartment } from "@/content";
import { usePick, useT } from "@/i18n/LangContext";
import { formatTime } from "@/lib/opdStatus";
import { DAYS, type DayOfWeek } from "@/types";
import { Todo } from "@/components/ui/Todo";
import { OpenNowBadge } from "@/components/ui/OpenNowBadge";
import { LLink } from "@/components/ui/LLink";
import { VisitingBadge } from "@/components/doctors/DoctorCard";

function TableShell({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-card bg-white shadow-card">
      <table className="w-full min-w-[480px] border-collapse text-left text-base">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}
const th = "bg-maroon-700 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white md:px-6";
const td = "border-t border-maroon-700/10 px-4 py-3 align-top md:px-6";

const dayRange = (days: DayOfWeek[]) => {
  const idx = days.map((d) => DAYS.indexOf(d)).sort((a, b) => a - b);
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1]! + 1);
  return contiguous && idx.length > 2 ? `${DAYS[idx[0]!]}–${DAYS[idx[idx.length - 1]!]}` : days.join(", ");
};

/** General OPD hours from SiteSettings, with live "Open now" badge. */
export function GeneralHours() {
  const t = useT();
  const pick = usePick();
  const s = siteSettings;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="h3">{t("guide.generalHours")}</h2>
        <OpenNowBadge />
      </div>
      {s.opdHours.length ? (
        <TableShell caption={t("guide.generalHours")}>
          <thead>
            <tr>
              <th scope="col" className={th}>{t("guide.days")}</th>
              <th scope="col" className={th}>{t("guide.hours")}</th>
            </tr>
          </thead>
          <tbody>
            {s.opdHours.map((r) => (
              <tr key={r.days.join()}>
                <td className={td}>{dayRange(r.days)}</td>
                <td className={td}>
                  {formatTime(r.open)} – {formatTime(r.close)}
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      ) : (
        <Todo id="opd-hours">General OPD days and opening/closing times (also drives the “Open now” badge).</Todo>
      )}
      {s.holidayNotice && (
        <p role="note" className="flex items-start gap-2 rounded-btn bg-[#FFF7ED] p-4 text-ink-900">
          <Info className="mt-1 h-5 w-5 shrink-0 text-saffron-700" aria-hidden />
          <span>
            <strong>{t("guide.holidayNotice")}:</strong> {pick(s.holidayNotice)}
          </span>
        </p>
      )}
    </div>
  );
}

/** Department × day schedule from the OPDTimings collection. */
export function DepartmentSchedule({ departmentSlug }: { departmentSlug?: string }) {
  const t = useT();
  const pick = usePick();
  const rows = departmentSlug ? opdTimings.filter((o) => o.department === departmentSlug) : opdTimings;
  const depts = departmentSlug ? departments.filter((d) => d.slug === departmentSlug) : departments;

  return (
    <div className="space-y-4">
      <h2 className="h3">{t("guide.departmentSchedule")}</h2>
      {rows.length ? (
        <TableShell caption={t("guide.departmentSchedule")}>
          <thead>
            <tr>
              <th scope="col" className={th}>{t("guide.department")}</th>
              <th scope="col" className={th}>{t("guide.day")}</th>
              <th scope="col" className={th}>{t("guide.time")}</th>
            </tr>
          </thead>
          <tbody>
            {depts.flatMap((d) =>
              rows
                .filter((r) => r.department === d.slug)
                .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day))
                .map((r, i) => (
                  <tr key={`${d.slug}-${r.day}-${r.startTime}`}>
                    <th scope="row" className={`${td} font-semibold text-maroon-700`}>
                      {i === 0 ? <LLink to={`/departments/${d.slug}/`}>{pick(d.name)}</LLink> : <span className="sr-only">{pick(d.name)}</span>}
                    </th>
                    <td className={td}>{r.day}</td>
                    <td className={td}>
                      {formatTime(r.startTime)} – {formatTime(r.endTime)}
                      {r.notes && <span className="block text-sm text-ink-600">{r.notes}</span>}
                    </td>
                  </tr>
                )),
            )}
          </tbody>
        </TableShell>
      ) : (
        <Todo id="opd-timetable">OPD timetable per department and day (department · day · start · end).</Todo>
      )}
    </div>
  );
}

/** Doctor visiting schedule — who visits on which day. */
export function DoctorSchedule() {
  const t = useT();
  const pick = usePick();
  return (
    <div className="space-y-4">
      <h2 className="h3">{t("guide.doctorSchedule")}</h2>
      <TableShell caption={t("guide.doctorSchedule")}>
        <thead>
          <tr>
            <th scope="col" className={th}>{t("guide.doctor")}</th>
            <th scope="col" className={th}>{t("guide.department")}</th>
            <th scope="col" className={th}>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" aria-hidden />
                {t("guide.days")}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => {
            const dept = getDepartment(d.department);
            return (
              <tr key={d.slug}>
                <th scope="row" className={`${td} font-semibold`}>
                  <LLink to={`/doctors/${d.slug}/`}>{d.name}</LLink>
                  <span className="block text-sm font-normal text-ink-600">{d.qualification}</span>
                </th>
                <td className={td}>{dept ? pick(dept.name) : ""}</td>
                <td className={td}>
                  <VisitingBadge doctor={d} />
                  {d.timing ? <span className="mt-1 block text-sm text-ink-600">{d.timing}</span> : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </TableShell>
    </div>
  );
}
