import type { ReactNode } from "react";
import { ArrowUpRight, CalendarClock, MapPin, Phone, Stethoscope } from "lucide-react";
import { siteSettings, tel } from "@/content";
import { Container } from "@/components/ui/Container";
import { SmartLink } from "@/components/ui/SmartLink";

function Tile({ icon, title, text, to, newTab, track }: { icon: ReactNode; title: string; text: string; to: string; newTab?: boolean; track?: string }) {
  return (
    <SmartLink
      to={to}
      newTab={newTab}
      track={track}
      className="surface group flex h-full flex-col justify-between gap-6 p-5 no-underline transition duration-200 hover:-translate-y-0.5 hover:border-maroon-200 hover:bg-maroon-50/40 hover:shadow-lift md:p-6"
    >
      <span className="flex items-start justify-between">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700 transition-colors group-hover:bg-maroon-100">{icon}</span>
        <ArrowUpRight className="h-5 w-5 text-ink-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-maroon-700" aria-hidden />
      </span>
      <span>
        <span className="block font-heading text-lg font-bold text-ink-900 md:text-xl">{title}</span>
        <span className="mt-1 block text-sm text-ink-600 md:text-[15px]">{text}</span>
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
            <Tile icon={<Stethoscope className={ic} aria-hidden />} title="Find a Doctor" text="Specialists and their visiting days" to="/doctors/" track="quick-find-doctor" />
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
