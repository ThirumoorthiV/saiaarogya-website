import { Clock, MapPin, Phone } from "lucide-react";
import { siteSettings } from "@/content";
import { useT } from "@/i18n/LangContext";
import { LLink } from "@/components/ui/LLink";

/** §4.2: sticky bottom action bar on mobile — Call · Timings · Directions. */
export function MobileActionBar() {
  const t = useT();
  const item = "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-semibold no-underline";
  return (
    <nav
      aria-label={t("a11y.quickActions")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-maroon-700/15 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,.08)] md:hidden"
    >
      <div className="flex">
        <a href={`tel:${siteSettings.phone}`} className={`${item} bg-maroon-700 text-white`} data-track="call-mobile-bar">
          <Phone className="h-5 w-5" aria-hidden />
          {t("actions.call")}
        </a>
        <LLink to="/patient-guide/opd-timings/" className={`${item} text-maroon-700`}>
          <Clock className="h-5 w-5" aria-hidden />
          {t("actions.timings")}
        </LLink>
        <a
          href={siteSettings.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${item} text-maroon-700`}
          data-track="directions-mobile-bar"
        >
          <MapPin className="h-5 w-5" aria-hidden />
          {t("actions.directions")}
        </a>
      </div>
    </nav>
  );
}
