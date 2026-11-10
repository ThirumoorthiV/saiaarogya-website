import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Department } from "@/types";
import { doctorsInDepartment } from "@/content";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";

/** Department tile (§5.1-4, §5.3): icon, name, one-line summary, doctor count. Whole card is clickable. */
export function DepartmentCard({ department, showCount = false }: { department: Department; showCount?: boolean }) {
  const count = doctorsInDepartment(department.slug).length;
  return (
    <article className="group surface surface-hover relative flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700 transition-colors duration-200 group-hover:bg-maroon-100 group-hover:text-maroon-800">
          <DepartmentIcon name={department.icon} />
        </span>
        <ArrowUpRight className="h-5 w-5 text-ink-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-maroon-700" aria-hidden />
      </div>
      <h3 className="mt-5 font-heading text-lg font-bold text-ink-900">
        <Link to={`/departments/${department.slug}/`} className="text-ink-900 no-underline after:absolute after:inset-0 after:rounded-3xl group-hover:text-maroon-800">
          {department.name}
        </Link>
      </h3>
      <div className="mt-2 flex-1 text-[15px] text-ink-600">{department.summary && <p className="line-clamp-3">{department.summary}</p>}</div>
      {showCount && <p className="mt-5 border-t border-ink-200/70 pt-4 text-sm font-medium text-ink-600">{count === 1 ? "1 doctor" : `${count} doctors`}</p>}
    </article>
  );
}
