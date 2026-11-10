import { Info } from "lucide-react";
import { useT } from "@/i18n/LangContext";
import { GuidePage } from "@/components/guide/GuidePage";
import { DepartmentSchedule, DoctorSchedule, GeneralHours } from "@/components/guide/OpdTables";

/** OPD Timings & Visiting Schedule (§5.5): table + "Open now" badge + holiday notice. */
export function Component() {
  const t = useT();
  return (
    <GuidePage path="/patient-guide/opd-timings/">
      <GeneralHours />
      <DepartmentSchedule />
      <DoctorSchedule />
      <p className="flex items-start gap-2 text-ink-600">
        <Info className="mt-1 h-5 w-5 shrink-0 text-maroon-700" aria-hidden />
        {t("guide.callBeforeTravel")}
      </p>
    </GuidePage>
  );
}
