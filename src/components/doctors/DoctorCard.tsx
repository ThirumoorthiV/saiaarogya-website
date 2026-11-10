import { CalendarDays, CircleCheck, Stethoscope } from "lucide-react";
import type { Doctor } from "@/types";
import { getDepartment } from "@/content";
import { usePick, useT } from "@/i18n/LangContext";
import { LLink } from "@/components/ui/LLink";
import { Badge } from "@/components/ui/Badge";
import { Todo } from "@/components/ui/Todo";
import { cn } from "@/components/ui/cn";

/** Initials avatar shown until the doctor's photo is supplied (TODO doctor-photo). */
export function DoctorPhoto({ doctor, className }: { doctor: Doctor; className?: string }) {
  if (doctor.photo) {
    return (
      <img
        src={doctor.photo}
        alt={`Portrait of ${doctor.name}`}
        width={400}
        height={400}
        loading="lazy"
        className={cn("aspect-square w-full rounded-xl object-cover", className)}
      />
    );
  }
  const initials = doctor.name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div
      data-todo="doctor-photo"
      role="img"
      aria-label={`${doctor.name} — photo coming soon`}
      className={cn(
        "flex aspect-square w-full items-center justify-center rounded-xl bg-gradient-to-br from-maroon-50 to-cream-100",
        className,
      )}
    >
      <span className="font-heading text-5xl font-medium text-maroon-700" aria-hidden>
        {initials}
      </span>
    </div>
  );
}

/** "Daily" / "Visiting: Mon & Thu" badge, or a TODO while days are unconfirmed. */
export function VisitingBadge({ doctor }: { doctor: Doctor }) {
  const t = useT();
  if (doctor.visitingDays.includes("Daily")) {
    return (
      <Badge tone="success" icon={<CircleCheck className="h-4 w-4" aria-hidden />}>
        {t("doctor.daily")}
      </Badge>
    );
  }
  if (doctor.visitingDays.length) {
    const days = doctor.visitingDays.join(" & ");
    return (
      <Badge tone="neutral" icon={<CalendarDays className="h-4 w-4" aria-hidden />}>
        {t("doctor.visiting", { days })}
      </Badge>
    );
  }
  return (
    <Todo id="doctor-visiting-days" inline>
      visiting days
    </Todo>
  );
}

/** Doctor card (§5.4 / §7.3): photo, name, qualification, speciality, visiting-day badge. */
export function DoctorCard({ doctor, headingLevel = "h3" }: { doctor: Doctor; headingLevel?: "h2" | "h3" }) {
  const t = useT();
  const pick = usePick();
  const dept = getDepartment(doctor.department);
  const H = headingLevel;
  return (
    <article className="group relative flex h-full flex-col rounded-card bg-white p-4 shadow-card transition-shadow hover:shadow-lg md:p-5">
      <DoctorPhoto doctor={doctor} />
      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-sm font-medium uppercase tracking-wide text-ink-600">
          {doctor.type === "Resident" ? t("doctor.resident") : t("doctor.consultant")}
        </p>
        <H className="mt-1 font-heading text-xl font-medium text-maroon-700">
          <LLink to={`/doctors/${doctor.slug}/`} className="no-underline after:absolute after:inset-0 after:rounded-card hover:underline">
            {doctor.name}
          </LLink>
        </H>
        <p className="text-sm text-ink-600">{doctor.qualification}</p>
        {dept && (
          <p className="mt-2 flex items-center gap-2 text-base text-ink-900">
            <Stethoscope className="h-4 w-4 shrink-0 text-maroon-700" aria-hidden />
            {pick(dept.name)}
          </p>
        )}
        <div className="relative z-10 mt-auto pt-3">
          <VisitingBadge doctor={doctor} />
        </div>
      </div>
    </article>
  );
}
