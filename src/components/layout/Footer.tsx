import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { policies, siteSettings, tel } from "@/content";
import { GUIDE_LINKS, SUPPORT_LINKS } from "@/lib/navigation";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";

const ABOUT_LINKS = [
  { label: "Our story", to: "/about/" },
  { label: "History", to: "/about/history/" },
  { label: "Governance", to: "/about/governance/" },
  { label: "Departments", to: "/departments/" },
  { label: "Doctors", to: "/doctors/" },
  { label: "Our impact", to: "/impact/" },
  { label: "Contact", to: "/contact/" },
];

/** Footer (§5.1-11): about · quick links · patient guide · support · contact · policies · © current year. */
export function Footer() {
  const s = siteSettings;
  const year = new Date().getFullYear();
  const h = "font-heading text-sm font-semibold uppercase tracking-[0.14em] text-maroon-200";
  const a = "text-[15px] text-white/80 no-underline transition-colors hover:text-white";

  return (
    <footer className="on-dark bg-maroon-900 text-white">
      <Container className="pt-14 md:pt-20">
        {/* CTA card */}
        <div data-panel className="flex flex-col gap-6 rounded-4xl bg-white p-7 text-ink-900 shadow-lift md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-xl">
            <p className="font-heading text-2xl font-bold tracking-tight text-ink-900 md:text-3xl">Need help planning your visit?</p>
            <p className="mt-2 text-ink-600">Call the hospital desk. Every consultation and treatment is free of charge.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink to={tel} icon={<Phone className="h-[18px] w-[18px]" aria-hidden />} track="call-footer-cta">
              {`Call ${s.phoneDisplay}`}
            </ButtonLink>
            <ButtonLink to="/patient-guide/" variant="outline">
              Patient Guide
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo onDark />
            <p className="mt-5 max-w-sm text-[15px] text-white/80">
              Your one-stop destination for quality healthcare solutions, offered by medical specialists driven by compassion and expertise, free of charge.
            </p>
            <address className="mt-6 space-y-3 text-[15px] not-italic">
              <p className="flex gap-3 text-white/80">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-maroon-200" aria-hidden />
                <span>
                  {s.address.lines.join(", ")}, {s.address.district}, {s.address.region} – {s.address.postalCode}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-maroon-200" aria-hidden />
                <a href={tel} className={a} data-track="call-footer">
                  {s.phoneDisplay}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-maroon-200" aria-hidden />
                <a href={`mailto:${s.email}`} className={`${a} break-all`}>
                  {s.email}
                </a>
              </p>
            </address>
          </div>

          <nav aria-labelledby="f-hospital">
            <h2 id="f-hospital" className={h}>
              Hospital
            </h2>
            <ul className="mt-4 space-y-2.5">
              {ABOUT_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={a}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="f-guide">
            <h2 id="f-guide" className={h}>
              Patient guide
            </h2>
            <ul className="mt-4 space-y-2.5">
              {GUIDE_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={a}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="f-support">
            <h2 id="f-support" className={h}>
              Support us
            </h2>
            <ul className="mt-4 space-y-2.5">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={a}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>

      <div className="border-t border-white/10 pb-[104px] md:pb-0">
        <Container className="flex flex-col gap-3 py-6 text-[13px] text-white/70 md:flex-row md:items-center md:justify-between">
          <p>© {year} Sai Aarogya Hospital. A unit of Sri Sathya Sai Sujala Sravanthi Trust, under the Sri Madhusudan Sai Global Humanitarian Mission.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {policies.map((p) => (
              <li key={p.slug}>
                <Link to={`/policies/${p.slug}/`} className="text-white/70 no-underline hover:text-white">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
