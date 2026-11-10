import { Link } from "react-router-dom";
import { CalendarClock, MapPin, Phone } from "lucide-react";
import { siteSettings, tel } from "@/content";

/** §4.2 sticky bottom action bar on mobile — Call · Timings · Directions. */
export function MobileActionBar() {
  const item = "flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-semibold no-underline transition-colors";
  return (
    <nav aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),12px)] md:hidden">
      <div className="flex gap-1 rounded-3xl border border-ink-200 bg-white/95 p-1.5 shadow-menu backdrop-blur-xl">
        <a href={tel} className={`${item} bg-maroon-700 text-white`} data-track="call-mobile-bar">
          <Phone className="h-5 w-5 text-yellow-400" aria-hidden />
          Call
        </a>
        <Link to="/patient-guide/opd-timings/" className={`${item} text-ink-900 hover:bg-maroon-50`}>
          <CalendarClock className="h-5 w-5 text-maroon-700" aria-hidden />
          Timings
        </Link>
        <a href={siteSettings.mapUrl} target="_blank" rel="noopener noreferrer" className={`${item} text-ink-900 hover:bg-maroon-50`} data-track="directions-mobile-bar">
          <MapPin className="h-5 w-5 text-maroon-700" aria-hidden />
          Directions
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </nav>
  );
}
