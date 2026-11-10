import { Info } from "lucide-react";
import { GuideShell } from "@/components/guide/GuideShell";
import { DepartmentSchedule, DoctorSchedule, GeneralHours } from "@/components/guide/OpdTables";

/** OPD Timings & Visiting Schedule (§5.5): tables + "Open now" badge + holiday notice. */
export function Component() {
  return (
    <GuideShell path="/patient-guide/opd-timings/">
      <GeneralHours />
      <DepartmentSchedule />
      <DoctorSchedule />
      <p className="flex items-start gap-2.5 rounded-2xl bg-ink-100 p-4 text-ink-700">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-maroon-700" aria-hidden />
        Schedules can change. If you are travelling from far away, please call us before you come.
      </p>
    </GuideShell>
  );
}
