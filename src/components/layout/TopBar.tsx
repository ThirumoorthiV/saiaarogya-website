import { Link } from "react-router-dom";
import { Clock, Phone, Siren } from "lucide-react";
import { emergencyDisplay, emergencyIsMainPhone, siteSettings, tel } from "@/content";
import { Container } from "@/components/ui/Container";
import { OpenNowBadge } from "@/components/ui/OpenNowBadge";

/** §4.2 utility strip: emergency number · OPD timings · tap-to-call. */
export function TopBar() {
  const s = siteSettings;
  return (
    <div className="on-dark border-b border-white/10 bg-maroon-900 text-[13px] text-maroon-100">
      <Container className="flex min-h-10 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <Siren className="h-4 w-4 text-maroon-200" aria-hidden />
            <span className="font-semibold text-white">{emergencyIsMainPhone ? "Emergency & enquiries" : "Emergency"}</span>
            {s.emergencyPhone ? (
              <a href={`tel:${s.emergencyPhone}`} className="font-semibold text-white decoration-white/40" data-track="call-emergency">
                {emergencyDisplay}
              </a>
            ) : (
              <a href="tel:108" className="font-semibold text-white decoration-white/40">
                108
              </a>
            )}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <Clock className="h-4 w-4 text-maroon-200" aria-hidden />
            <span className="font-semibold text-white">OPD</span>
            {s.opdSummary ? (
              <Link to="/patient-guide/opd-timings/" className="text-maroon-100 decoration-white/30 hover:text-white">
                {s.opdSummary}
              </Link>
            ) : (
              <Link to="/patient-guide/opd-timings/" className="text-maroon-100 decoration-white/30 hover:text-white">
                See timings
              </Link>
            )}
            <OpenNowBadge onDark />
          </span>
          {!emergencyIsMainPhone && (
            <a href={tel} className="inline-flex min-h-8 items-center gap-1.5 font-semibold text-white no-underline hover:text-maroon-100" data-track="call-topbar">
              <Phone className="h-4 w-4" aria-hidden />
              {s.phoneDisplay}
            </a>
          )}
        </div>
      </Container>
    </div>
  );
}
