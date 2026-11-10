import { Mail, MapPin, Phone } from "lucide-react";
import { policies, siteSettings } from "@/content";
import { useT } from "@/i18n/LangContext";
import { Container } from "@/components/ui/Container";
import { LLink } from "@/components/ui/LLink";
import { Logo } from "./Logo";

const quickLinks = [
  { key: "nav.about", to: "/about/" },
  { key: "nav.departments", to: "/departments/" },
  { key: "nav.doctors", to: "/doctors/" },
  { key: "nav.impact", to: "/impact/" },
  { key: "nav.supportUs", to: "/support-us/" },
  { key: "nav.contact", to: "/contact/" },
];

const guideLinks = [
  { label: "OPD timings", to: "/patient-guide/opd-timings/" },
  { label: "How to reach", to: "/patient-guide/how-to-reach/" },
  { label: "Registration", to: "/patient-guide/registration/" },
  { label: "Facilities", to: "/patient-guide/facilities/" },
  { label: "FAQs", to: "/patient-guide/faqs/" },
];

/** §5.1-11 footer: about · quick links · patient guide · contact · policies · © current year. */
export function Footer() {
  const t = useT();
  const s = siteSettings;
  const year = new Date().getFullYear();
  const heading = "mb-4 font-heading text-lg font-medium text-gold-400";
  const link = "text-white/90 no-underline hover:text-white hover:underline";

  return (
    <footer className="bg-maroon-700 text-white">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <Logo onDark />
          <p className="mt-4 max-w-sm text-base text-white/90">{t("footer.tagline")}</p>
          <p className="mt-4 text-sm text-white/85">
            {t("footer.unitOf")}
            <br />
            {t("footer.underMission")}
          </p>
        </div>

        <nav aria-labelledby="footer-quick">
          <h2 id="footer-quick" className={heading}>
            {t("footer.quickLinks")}
          </h2>
          <ul className="space-y-2.5 text-base">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <LLink to={l.to} className={link}>
                  {t(l.key)}
                </LLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-guide">
          <h2 id="footer-guide" className={heading}>
            {t("footer.patientGuide")}
          </h2>
          <ul className="space-y-2.5 text-base">
            {guideLinks.map((l) => (
              <li key={l.to}>
                <LLink to={l.to} className={link}>
                  {l.label}
                </LLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={heading}>{t("footer.contact")}</h2>
          <address className="space-y-3 text-base not-italic">
            <p className="flex gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold-400" aria-hidden />
              <span className="text-white/90">
                {s.address.lines.join(", ")},<br />
                {s.address.district}, {s.address.region} – {s.address.postalCode}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0 text-gold-400" aria-hidden />
              <a href={`tel:${s.phone}`} className={link} data-track="call-footer">
                {s.phoneDisplay}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <Mail className="h-5 w-5 shrink-0 text-gold-400" aria-hidden />
              <a href={`mailto:${s.email}`} className={`${link} break-all`}>
                {s.email}
              </a>
            </p>
          </address>
        </div>
      </Container>

      {/* Bottom padding on mobile leaves room for the fixed action bar */}
      <div className="bg-maroon-900 pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0">
        <Container className="flex flex-col gap-3 py-5 text-sm text-white/85 md:flex-row md:items-center md:justify-between">
          <p>{t("footer.copyright", { year })}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {policies.map((p) => (
              <li key={p.slug}>
                <LLink to={`/policies/${p.slug}/`} className={link}>
                  {p.title}
                </LLink>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
