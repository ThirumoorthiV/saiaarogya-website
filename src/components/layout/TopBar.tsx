import { Link } from "react-router-dom";
import { Clock, Phone, Siren } from "lucide-react";
import { siteSettings, tel } from "@/content";
import { Container } from "@/components/ui/Container";
import { OpenNowBadge } from "@/components/ui/OpenNowBadge";

/** §4.2 utility strip: emergency number · OPD timings · tap-to-call. */
export function TopBar() {
  const s = siteSettings;
  return (
    <div className="bg-maroon-900 text-[13px] text-maroon-100">
      <Container className="flex min-h-10 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <Siren className="h-4 w-4 text-maroon-200" aria-hidden />
            <span className="font-semibold text-white">Emergency</span>
            {s.emergencyPhone ? (
              <a href={`tel:${s.emergencyPhone}`} className="font-semibold text-white decoration-white/40" data-track="call-emergency">
                {s.emergencyPhone}
              </a>
            ) : (
              <span data-todo="emergency-number" className="rounded-full border border-dashed border-maroon-200/50 px-2 text-maroon-100">
                TODO: number to be confirmed
              </span>
            )}
          </span>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <Clock className="h-4 w-4 text-maroon-200" aria-hidden />
            <span className="font-semibold text-white">OPD</span>
            {s.opdSummary ? (
              <Link to="/patient-guide/opd-timings/" className="text-maroon-100 decoration-white/30 hover:text-white">
                {s.opdSummary}
              </Link>
            ) : (
              <Link
                to="/patient-guide/opd-timings/"
                data-todo="opd-summary"
                className="rounded-full border border-dashed border-maroon-200/50 px-2 text-maroon-100 no-underline hover:text-white"
              >
                TODO: timings to be confirmed
              </Link>
            )}
            <OpenNowBadge onDark />
          </span>
        </div>
        <a href={tel} className="inline-flex min-h-8 items-center gap-1.5 font-semibold text-white no-underline hover:text-maroon-100" data-track="call-topbar">
          <Phone className="h-4 w-4" aria-hidden />
          {s.phoneDisplay}
        </a>
      </Container>
    </div>
  );
}
