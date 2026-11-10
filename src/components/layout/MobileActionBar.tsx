import { Link } from "react-router-dom";
import { CalendarClock, MapPin, Phone } from "lucide-react";
import { siteSettings, tel } from "@/content";

/** §4.2 sticky bottom action bar on mobile — Call · Timings · Directions. */
export function MobileActionBar() {
  const item = "flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-semibold no-underline transition-colors";
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-200 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),6px)] pt-1.5 shadow-[0_-6px_20px_-12px_rgba(36,28,26,.25)] backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto flex max-w-md gap-1.5">
        <a href={tel} className={`${item} bg-maroon-700 text-white`} data-track="call-mobile-bar">
          <Phone className="h-[18px] w-[18px] text-yellow-400" aria-hidden />
          Call
        </a>
        <Link to="/patient-guide/opd-timings/" className={`${item} text-ink-900 hover:bg-maroon-50`}>
          <CalendarClock className="h-[18px] w-[18px] text-maroon-700" aria-hidden />
          Timings
        </Link>
        <a href={siteSettings.mapUrl} target="_blank" rel="noopener noreferrer" className={`${item} text-ink-900 hover:bg-maroon-50`} data-track="directions-mobile-bar">
          <MapPin className="h-[18px] w-[18px] text-maroon-700" aria-hidden />
          Directions
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </nav>
  );
}
