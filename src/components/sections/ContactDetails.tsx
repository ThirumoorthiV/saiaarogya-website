import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, MessageCircle, Phone, Siren } from "lucide-react";
import { siteSettings, tel } from "@/content";
import { Todo } from "@/components/ui/Todo";
import { OpenNowBadge } from "@/components/ui/OpenNowBadge";

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="relative min-h-11 pl-[60px]">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">
        <span className="absolute left-0 top-0 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 min-w-0 text-ink-900">{children}</dd>
    </div>
  );
}

/** Single-source contact block (§5.9) — address, tap-to-call, email, WhatsApp, emergency, OPD hours. */
export function ContactDetails({ showEmergency = true }: { showEmergency?: boolean }) {
  const s = siteSettings;
  const ic = "h-5 w-5";
  return (
    <dl className="space-y-6">
      <Row icon={<MapPin className={ic} aria-hidden />} label="Address">
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
      <Row icon={<Phone className={ic} aria-hidden />} label="Phone">
        <a href={tel} className="text-lg font-semibold" data-track="call-contact-details">
          {s.phoneDisplay}
        </a>
      </Row>
      {showEmergency && (
        <Row icon={<Siren className={ic} aria-hidden />} label="Emergency">
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
      <Row icon={<Mail className={ic} aria-hidden />} label="Email">
        <a href={`mailto:${s.email}`} className="break-all">
          {s.email}
        </a>
      </Row>
      <Row icon={<MessageCircle className={ic} aria-hidden />} label="WhatsApp">
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
      <Row icon={<Clock className={ic} aria-hidden />} label="OPD hours">
        <span className="flex flex-wrap items-center gap-2">
          {s.opdSummary ? (
            <Link to="/patient-guide/opd-timings/">{s.opdSummary}</Link>
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
