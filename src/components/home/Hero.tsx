import { BadgeCheck, CalendarClock, HeartHandshake, Phone, Stethoscope } from "lucide-react";
import { departments, doctors, siteSettings, tel } from "@/content";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

/** §5.1-1 Home hero: H1 promise, supporting copy, Find a Doctor + OPD Timings CTAs, real consultation photo. */
export function Hero() {
  const stats = [
    { value: String(departments.length), label: "Specialities" },
    { value: String(doctors.length), label: "Doctors" },
    { value: "100%", label: "Free of charge" },
  ];
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_70%_at_85%_10%,#F6E4E4_0%,transparent_65%),radial-gradient(45%_55%_at_0%_100%,#FBF4F4_0%,transparent_70%)]"
      />
      <Container className="relative grid items-center gap-10 pb-12 pt-7 md:pb-20 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* No entrance animation here: the H1 is the LCP element and must paint immediately */}
        <div>
          <p className="eyebrow">
            <BadgeCheck className="h-4 w-4" aria-hidden />
            Free care for everyone · Bapatla
          </p>
          <h1 className="text-display mt-4 max-w-[16ch] md:mt-6">
            Quality Secondary Care, Accessible to All, <span className="text-maroon-700">Free of Charge</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-600 md:mt-6 md:text-xl md:leading-relaxed">Serving Bapatla and rural Andhra Pradesh with specialist care — completely free for everyone.</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:flex md:mt-9">
            <ButtonLink
              to="/doctors/"
              size="sm"
              className="sm:min-h-14 sm:px-7 sm:text-base sm:[&>svg]:h-5 sm:[&>svg]:w-5"
              icon={<Stethoscope className="h-5 w-5" aria-hidden />}
              track="hero-find-doctor"
            >
              Find a Doctor
            </ButtonLink>
            <ButtonLink
              to="/patient-guide/opd-timings/"
              variant="outline"
              size="sm"
              className="sm:min-h-14 sm:px-7 sm:text-base sm:[&>svg]:h-5 sm:[&>svg]:w-5"
              icon={<CalendarClock className="h-5 w-5" aria-hidden />}
              track="hero-opd-timings"
            >
              OPD Timings
            </ButtonLink>
          </div>
          <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-ink-200 pt-5 md:mt-12 md:pt-6">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-sm text-ink-600">{s.label}</dt>
                <dd className="font-heading text-2xl font-bold tracking-tight text-maroon-700 sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div aria-hidden className="absolute -inset-2 rounded-[2.5rem] sm:-inset-4 sm:rounded-[2.75rem] bg-gradient-to-br from-maroon-100 to-transparent" />
          <img
            src="/images/consultation.webp"
            srcSet="/images/consultation-sm.webp 640w, /images/consultation.webp 1040w"
            sizes="(min-width: 1024px) 45vw, 100vw"
            alt="A doctor consulting an elderly patient at Sai Aarogya Hospital"
            width={1040}
            height={780}
            fetchPriority="high"
            decoding="async"
            className="relative aspect-[16/11] w-full rounded-3xl object-cover shadow-lift sm:aspect-[4/3] sm:rounded-[2.25rem]"
          />
          {/* Floating info cards */}
          <div className="absolute -bottom-6 left-3 right-3 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 p-3 shadow-lift sm:left-4 sm:right-4 sm:rounded-3xl sm:p-4 backdrop-blur-xl sm:left-auto sm:right-6 sm:w-80">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-maroon-700 text-yellow-400">
              <Phone className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">Hospital desk</p>
              <a href={tel} className="font-heading text-base font-bold text-ink-900 sm:text-lg no-underline hover:text-maroon-700" data-track="call-hero">
                {siteSettings.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="absolute -top-5 left-6 hidden items-center gap-2.5 rounded-full border border-white/60 bg-white/90 py-2 pl-2 pr-4 shadow-lift backdrop-blur-xl sm:flex">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-maroon-100 text-maroon-700">
              <HeartHandshake className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-sm font-semibold text-ink-900">No fees. No discrimination.</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
