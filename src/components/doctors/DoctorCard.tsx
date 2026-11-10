import { Link } from "react-router-dom";
import { CalendarDays, CircleCheck } from "lucide-react";
import type { Doctor } from "@/types";
import { getDepartment } from "@/content";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";
import { Badge } from "@/components/ui/Badge";
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
export function DoctorPhoto({ doctor, className, size = "card" }: { doctor: Doctor; className?: string; size?: "card" | "profile" | "thumb" }) {
  if (doctor.photo) {
    return (
      <img
        src={doctor.photo}
        alt={`Portrait of ${doctor.name}`}
        width={480}
        height={480}
        loading="lazy"
        className={cn("object-cover", size !== "thumb" && "w-full", size === "card" ? "aspect-[5/4] rounded-2xl" : "aspect-square rounded-4xl", className)}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${doctor.name} — photo coming soon`}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-maroon-50 via-maroon-100 to-maroon-50",
        size !== "thumb" && "w-full",
        size === "card" ? "aspect-[5/4] rounded-2xl" : size === "thumb" ? "aspect-square rounded-2xl" : "aspect-square rounded-4xl",
        className,
      )}
    >
      <span aria-hidden className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/50" />
      <span
        aria-hidden
        className={cn(
          "relative flex items-center justify-center rounded-full bg-white font-heading font-bold text-maroon-700 shadow-soft",
          size === "card" ? "h-20 w-20 text-2xl" : size === "thumb" ? "h-14 w-14 text-lg" : "h-36 w-36 text-5xl",
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
  return <span className="text-ink-600">Call to check days</span>;
}

/** Doctor card (§5.4): photo, name, qualification, speciality, visiting-day badge. Whole card is clickable. */
export function DoctorCard({ doctor, headingLevel = "h3", rowOnMobile = true }: { doctor: Doctor; headingLevel?: "h2" | "h3"; rowOnMobile?: boolean }) {
  const dept = getDepartment(doctor.department);
  const H = headingLevel;
  return (
    <article className={cn("group surface surface-hover relative flex h-full p-3", rowOnMobile ? "flex-row items-start gap-4 sm:flex-col sm:gap-0" : "flex-col")}>
      {rowOnMobile ? (
        <>
          <DoctorPhoto doctor={doctor} size="thumb" className="w-24 shrink-0 sm:hidden" />
          <DoctorPhoto doctor={doctor} className="hidden sm:flex" />
        </>
      ) : (
        <DoctorPhoto doctor={doctor} />
      )}
      <div className={cn("flex min-w-0 flex-1 flex-col pb-2", rowOnMobile ? "pt-1 sm:px-2 sm:pt-4" : "px-2 pt-4")}>
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
        <div className="relative z-10 mt-auto pt-3 sm:pt-4">
          <VisitingBadge doctor={doctor} />
        </div>
      </div>
    </article>
  );
}
