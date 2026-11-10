import type { ReactNode } from "react";
import { ArrowUpRight, CalendarClock, MapPin, Phone, Stethoscope } from "lucide-react";
import { siteSettings, tel } from "@/content";
import { Container } from "@/components/ui/Container";
import { SmartLink } from "@/components/ui/SmartLink";
import { cn } from "@/components/ui/cn";

function Tile({ icon, title, text, to, featured, newTab, track }: { icon: ReactNode; title: string; text: string; to: string; featured?: boolean; newTab?: boolean; track?: string }) {
  return (
    <SmartLink
      to={to}
      newTab={newTab}
      track={track}
      className={cn(
        "group flex h-full flex-col justify-between gap-6 rounded-3xl p-5 no-underline transition duration-200 hover:-translate-y-0.5 md:p-6",
        featured ? "bg-maroon-700 text-white shadow-lift hover:bg-maroon-800" : "surface hover:border-maroon-200 hover:shadow-lift",
      )}
    >
      <span className="flex items-start justify-between">
        <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-2xl", featured ? "bg-white/15 text-white" : "bg-maroon-50 text-maroon-700")}>{icon}</span>
        <ArrowUpRight className={cn("h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5", featured ? "text-maroon-100" : "text-ink-300 group-hover:text-maroon-700")} aria-hidden />
      </span>
      <span>
        <span className={cn("block font-heading text-lg font-bold md:text-xl", featured ? "text-white" : "text-ink-900")}>{title}</span>
        <span className={cn("mt-1 block text-sm md:text-[15px]", featured ? "text-maroon-100" : "text-ink-600")}>{text}</span>
      </span>
    </SmartLink>
  );
}

/** §5.1-2 Quick action tiles — 4 across on desktop, 2×2 on mobile. */
export function QuickActions() {
  const ic = "h-6 w-6";
  return (
    <section aria-labelledby="quick-title" className="relative z-10 bg-ink-50 pb-4 pt-10 md:pt-14">
      <Container>
        <h2 id="quick-title" className="sr-only">
          How can we help you today?
        </h2>
        <ul className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          <li>
            <Tile featured icon={<Stethoscope className={ic} aria-hidden />} title="Find a Doctor" text="Specialists and their visiting days" to="/doctors/" track="quick-find-doctor" />
          </li>
          <li>
            <Tile icon={<CalendarClock className={ic} aria-hidden />} title="OPD Timings" text="When the OPD is open" to="/patient-guide/opd-timings/" track="quick-opd" />
          </li>
          <li>
            <Tile icon={<MapPin className={ic} aria-hidden />} title="Directions" text="Khajipalem, Bapatla District" to={siteSettings.mapUrl} newTab track="directions-quick" />
          </li>
          <li>
            <Tile icon={<Phone className={ic} aria-hidden />} title="Call Us" text={siteSettings.phoneDisplay} to={tel} track="call-quick" />
          </li>
        </ul>
      </Container>
    </section>
  );
}
