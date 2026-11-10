import { Link } from "react-router-dom";
import { CalendarDays, CircleCheck } from "lucide-react";
import type { Doctor } from "@/types";
import { getDepartment } from "@/content";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";
import { Badge } from "@/components/ui/Badge";
import { Todo } from "@/components/ui/Todo";
import { cn } from "@/components/ui/cn";

const initials = (name: string) =>
  name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

/** Doctor photo, or an initials tile until the photo is supplied (TODO doctor-photo). */
export function DoctorPhoto({ doctor, className, size = "card" }: { doctor: Doctor; className?: string; size?: "card" | "profile" }) {
  if (doctor.photo) {
    return (
      <img
        src={doctor.photo}
        alt={`Portrait of ${doctor.name}`}
        width={480}
        height={480}
        loading="lazy"
        className={cn("w-full object-cover", size === "card" ? "aspect-[5/4] rounded-2xl" : "aspect-square rounded-4xl", className)}
      />
    );
  }
  return (
    <div
      data-todo="doctor-photo"
      role="img"
      aria-label={`${doctor.name} — photo coming soon`}
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-maroon-50 via-maroon-100 to-maroon-50",
        size === "card" ? "aspect-[5/4] rounded-2xl" : "aspect-square rounded-4xl",
        className,
      )}
    >
      <span aria-hidden className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/50" />
      <span
        aria-hidden
        className={cn(
          "relative flex items-center justify-center rounded-full bg-white font-heading font-bold text-maroon-700 shadow-soft",
          size === "card" ? "h-20 w-20 text-2xl" : "h-36 w-36 text-5xl",
        )}
      >
        {initials(doctor.name)}
      </span>
    </div>
  );
}

/** "Daily" / "Visiting: Mon & Thu" badge, or a TODO while unconfirmed. */
export function VisitingBadge({ doctor }: { doctor: Doctor }) {
  if (doctor.visitingDays.includes("Daily")) {
    return (
      <Badge tone="success" icon={<CircleCheck className="h-4 w-4" aria-hidden />}>
        Daily
      </Badge>
    );
  }
  if (doctor.visitingDays.length) {
    return (
      <Badge tone="maroon" icon={<CalendarDays className="h-4 w-4" aria-hidden />}>
        Visiting: {doctor.visitingDays.join(" & ")}
      </Badge>
    );
  }
  return (
    <Todo id="doctor-visiting-days" inline>
      visiting days
    </Todo>
  );
}

/** Doctor card (§5.4): photo, name, qualification, speciality, visiting-day badge. Whole card is clickable. */
export function DoctorCard({ doctor, headingLevel = "h3" }: { doctor: Doctor; headingLevel?: "h2" | "h3" }) {
  const dept = getDepartment(doctor.department);
  const H = headingLevel;
  return (
    <article className="group surface surface-hover relative flex h-full flex-col p-3">
      <DoctorPhoto doctor={doctor} />
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-maroon-700">{doctor.type}</p>
        <H className="mt-1.5 font-heading text-lg font-bold leading-snug text-ink-900">
          <Link to={`/doctors/${doctor.slug}/`} className="text-ink-900 no-underline after:absolute after:inset-0 after:rounded-3xl group-hover:text-maroon-800">
            {doctor.name}
          </Link>
        </H>
        <p className="mt-0.5 text-sm text-ink-600">{doctor.qualification}</p>
        {dept && (
          <p className="mt-3 inline-flex items-center gap-2 text-[15px] font-medium text-ink-900">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-maroon-50 text-maroon-700">
              <DepartmentIcon name={dept.icon} className="h-4 w-4" />
            </span>
            {dept.name}
          </p>
        )}
        <div className="relative z-10 mt-auto pt-4">
          <VisitingBadge doctor={doctor} />
        </div>
      </div>
    </article>
  );
}
