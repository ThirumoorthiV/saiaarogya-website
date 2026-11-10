import { ArrowRight } from "lucide-react";
import type { Department } from "@/types";
import { doctorsInDepartment } from "@/content";
import { usePick, useT } from "@/i18n/LangContext";
import { LLink } from "@/components/ui/LLink";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";
import { Todo } from "@/components/ui/Todo";

/** Department tile (§5.1-4, §5.3): icon, name, one-line summary, doctor count, link. */
export function DepartmentCard({ department, showCount = false }: { department: Department; showCount?: boolean }) {
  const pick = usePick();
  const t = useT();
  const count = doctorsInDepartment(department.slug).length;
  return (
    <article className="group relative grid h-full grid-cols-[auto_1fr] gap-x-4 rounded-card bg-white p-4 shadow-card transition-shadow hover:shadow-lg sm:flex sm:flex-col sm:p-5 md:p-6">
      <span className="row-span-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">
        <DepartmentIcon name={department.icon} />
      </span>
      <h3 className="font-heading text-xl font-medium text-maroon-700 sm:mt-4">
        <LLink to={`/departments/${department.slug}/`} className="no-underline after:absolute after:inset-0 after:rounded-card">
          {pick(department.name)}
        </LLink>
      </h3>
      <div className="mt-1 flex-1 text-base text-ink-600 sm:mt-2">
        {department.summary ? (
          <p>{pick(department.summary)}</p>
        ) : (
          <Todo id="department-summary" inline>
            summary
          </Todo>
        )}
      </div>
      <p className="mt-2 flex items-center justify-between gap-2 text-sm font-semibold text-maroon-700 sm:mt-4">
        {showCount ? <span className="font-medium text-ink-600">{t("departmentsPage.doctorCount", { count })}</span> : <span />}
        <span className="inline-flex items-center gap-1 group-hover:underline">
          {t("departmentsPage.view")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </p>
    </article>
  );
}
