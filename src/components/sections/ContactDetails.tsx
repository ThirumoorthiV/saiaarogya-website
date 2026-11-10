import { Clock, Mail, MapPin, MessageCircle, Phone, Siren } from "lucide-react";
import type { ReactNode } from "react";
import { siteSettings } from "@/content";
import { usePick, useT } from "@/i18n/LangContext";
import { Todo } from "@/components/ui/Todo";
import { LLink } from "@/components/ui/LLink";
import { OpenNowBadge } from "@/components/ui/OpenNowBadge";

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">{icon}</span>
      <div className="min-w-0">
        <dt className="text-sm font-semibold uppercase tracking-wide text-ink-600">{label}</dt>
        <dd className="mt-0.5 text-ink-900">{children}</dd>
      </div>
    </div>
  );
}

/**
 * Single-source contact block (§5.9): address, tap-to-call phone, email,
 * WhatsApp, emergency number and OPD hours — all from SiteSettings.
 */
export function ContactDetails({ showEmergency = true }: { showEmergency?: boolean }) {
  const t = useT();
  const pick = usePick();
  const s = siteSettings;
  const ic = "h-5 w-5";
  return (
    <dl className="space-y-5">
      <Row icon={<MapPin className={ic} aria-hidden />} label={t("common.address")}>
        <address className="not-italic">
          {s.address.lines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
          <span className="block">
            {s.address.district}, {s.address.region} – {s.address.postalCode}
          </span>
        </address>
      </Row>
      <Row icon={<Phone className={ic} aria-hidden />} label={t("common.phone")}>
        <a href={`tel:${s.phone}`} className="text-lg font-semibold" data-track="call-contact-details">
          {s.phoneDisplay}
        </a>
      </Row>
      {showEmergency && (
        <Row icon={<Siren className={ic} aria-hidden />} label={t("utility.emergency")}>
          {s.emergencyPhone ? (
            <a href={`tel:${s.emergencyPhone}`} className="text-lg font-semibold" data-track="call-emergency">
              {s.emergencyPhone}
            </a>
          ) : (
            <Todo id="emergency-number" inline>
              emergency number
            </Todo>
          )}
        </Row>
      )}
      <Row icon={<Mail className={ic} aria-hidden />} label={t("common.email")}>
        <a href={`mailto:${s.email}`} className="break-all">
          {s.email}
        </a>
      </Row>
      <Row icon={<MessageCircle className={ic} aria-hidden />} label={t("common.whatsapp")}>
        {s.whatsapp ? (
          <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
            {s.whatsapp}
          </a>
        ) : (
          <Todo id="whatsapp" inline>
            WhatsApp number, if available
          </Todo>
        )}
      </Row>
      <Row icon={<Clock className={ic} aria-hidden />} label={t("common.opdHours")}>
        <span className="flex flex-wrap items-center gap-2">
          {s.opdSummary ? (
            <LLink to="/patient-guide/opd-timings/">{pick(s.opdSummary)}</LLink>
          ) : (
            <Todo id="opd-summary" inline>
              OPD timings
            </Todo>
          )}
          <OpenNowBadge />
        </span>
      </Row>
    </dl>
  );
}
