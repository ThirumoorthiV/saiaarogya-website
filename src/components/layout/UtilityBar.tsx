import { Clock, Phone, Siren } from "lucide-react";
import { siteSettings } from "@/content";
import { usePick, useT } from "@/i18n/LangContext";
import { Container } from "@/components/ui/Container";
import { LLink } from "@/components/ui/LLink";
import { OpenNowBadge } from "@/components/ui/OpenNowBadge";

/** §4.2 / §5.1-0: thin top strip — emergency number · OPD timings · tap-to-call. */
export function UtilityBar() {
  const t = useT();
  const pick = usePick();
  const s = siteSettings;

  return (
    <div className="bg-maroon-900 text-sm text-white">
      <Container className="flex min-h-10 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <Siren className="h-4 w-4 text-gold-400" aria-hidden />
            <span className="font-semibold">{t("utility.emergency")}:</span>
            {s.emergencyPhone ? (
              <a href={`tel:${s.emergencyPhone}`} className="font-semibold text-white underline" data-track="call-emergency">
                {s.emergencyPhone}
              </a>
            ) : (
              <span data-todo="emergency-number" className="rounded bg-white/15 px-1.5">
                TODO: number to be confirmed
              </span>
            )}
          </span>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <Clock className="h-4 w-4 text-gold-400" aria-hidden />
            <span className="font-semibold">{t("utility.opd")}:</span>
            {s.opdSummary ? (
              <LLink to="/patient-guide/opd-timings/" className="text-white underline">
                {pick(s.opdSummary)}
              </LLink>
            ) : (
              <LLink to="/patient-guide/opd-timings/" data-todo="opd-summary" className="rounded bg-white/15 px-1.5 text-white no-underline">
                TODO: timings to be confirmed
              </LLink>
            )}
            <OpenNowBadge onDark />
          </span>
        </div>
        <a
          href={`tel:${s.phone}`}
          className="inline-flex min-h-8 items-center gap-1.5 font-semibold text-white no-underline hover:underline"
          data-track="call-utility"
        >
          <Phone className="h-4 w-4 text-gold-400" aria-hidden />
          {s.phoneDisplay}
        </a>
      </Container>
    </div>
  );
}
