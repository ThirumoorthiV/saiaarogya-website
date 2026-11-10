import { BadgeCheck, Clock, Stethoscope } from "lucide-react";
import { useT } from "@/i18n/LangContext";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

/** §5.1-1 Home hero: H1 promise, supporting copy, Find a Doctor + OPD Timings CTAs, doctor-with-patient photo. */
export function Hero() {
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-cream-100">
      {/* Decorative saffron/maroon shape echoing the logo */}
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-saffron-500/10 md:h-[520px] md:w-[520px]" />
      <Container className="relative grid items-center gap-10 py-10 md:grid-cols-[1.1fr_1fr] md:gap-14 md:py-20">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-success-700 shadow-sm">
            <BadgeCheck className="h-4 w-4" aria-hidden />
            {t("common.freeOfCharge")}
          </p>
          <h1 className="h1 mt-5">{t("home.heroTitle")}</h1>
          <p className="mt-5 max-w-prose text-lg text-ink-600 md:text-xl">{t("home.heroText")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/doctors/" icon={<Stethoscope className="h-5 w-5" aria-hidden />} track="hero-find-doctor">
              {t("actions.findDoctor")}
            </ButtonLink>
            <ButtonLink to="/patient-guide/opd-timings/" variant="secondary" icon={<Clock className="h-5 w-5" aria-hidden />} track="hero-opd-timings">
              {t("actions.opdTimings")}
            </ButtonLink>
          </div>
        </div>
        <div className="relative">
          <div aria-hidden className="absolute -bottom-3 -left-3 hidden h-full w-full rounded-card border-2 border-saffron-500/60 md:block" />
          <img
            src="/images/consultation.webp"
            srcSet="/images/consultation-sm.webp 640w, /images/consultation.webp 1040w"
            sizes="(min-width: 768px) 45vw, 100vw"
            alt={t("home.heroImageAlt")}
            width={1040}
            height={780}
            fetchPriority="high"
            decoding="async"
            className="relative aspect-[4/3] w-full rounded-card object-cover shadow-card"
          />
        </div>
      </Container>
    </section>
  );
}
