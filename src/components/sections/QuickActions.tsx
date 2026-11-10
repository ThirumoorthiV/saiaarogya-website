import type { ReactNode } from "react";
import { Clock, MapPin, Phone, Stethoscope } from "lucide-react";
import { siteSettings } from "@/content";
import { useT } from "@/i18n/LangContext";
import { Container } from "@/components/ui/Container";
import { LLink } from "@/components/ui/LLink";

function Tile({ icon, title, text, to, external, track }: { icon: ReactNode; title: string; text: string; to: string; external?: boolean; track?: string }) {
  const inner = (
    <>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-700 text-white transition-colors group-hover:bg-saffron-700">
        {icon}
      </span>
      <span className="mt-3 block font-heading text-lg font-medium text-maroon-700 md:text-xl">{title}</span>
      <span className="mt-1 block text-sm text-ink-600 md:text-base">{text}</span>
    </>
  );
  const cls =
    "group flex h-full flex-col rounded-card bg-white p-4 no-underline shadow-card transition-shadow hover:shadow-lg md:p-6";
  return external ? (
    <a href={to} className={cls} data-track={track} {...(to.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {inner}
    </a>
  ) : (
    <LLink to={to} className={cls} data-track={track}>
      {inner}
    </LLink>
  );
}

/** §5.1-2 Quick action tiles: 4 across on desktop, 2×2 on mobile. Overlaps the hero edge. */
export function QuickActions() {
  const t = useT();
  const ic = "h-6 w-6";
  return (
    <section aria-labelledby="quick-title" className="relative z-10 -mt-2 md:-mt-10">
      <Container>
        <h2 id="quick-title" className="sr-only">
          {t("home.quickTitle")}
        </h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          <li>
            <Tile icon={<Stethoscope className={ic} aria-hidden />} title={t("actions.findDoctor")} text={t("home.quickDoctor")} to="/doctors/" track="quick-find-doctor" />
          </li>
          <li>
            <Tile icon={<Clock className={ic} aria-hidden />} title={t("actions.opdTimings")} text={t("home.quickTimings")} to="/patient-guide/opd-timings/" track="quick-opd" />
          </li>
          <li>
            <Tile icon={<MapPin className={ic} aria-hidden />} title={t("actions.directions")} text={t("home.quickDirections")} to={siteSettings.mapUrl} external track="directions-quick" />
          </li>
          <li>
            <Tile icon={<Phone className={ic} aria-hidden />} title={t("actions.callUs")} text={siteSettings.phoneDisplay} to={`tel:${siteSettings.phone}`} external track="call-quick" />
          </li>
        </ul>
      </Container>
    </section>
  );
}
