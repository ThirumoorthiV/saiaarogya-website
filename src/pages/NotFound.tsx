import { CalendarClock, Home, Phone, Stethoscope } from "lucide-react";
import { siteSettings, tel } from "@/content";
import { Seo } from "@/components/seo/Seo";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export function Component() {
  return (
    <>
      <Seo
        title="Page not found"
        description="Sorry, we could not find that page. Find a doctor, check OPD timings or call Sai Aarogya Hospital, Bapatla — all care is free of charge."
        path="/404"
        noindex
      />
      <div className="relative overflow-hidden bg-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_80%_10%,#F6E4E4_0%,transparent_65%)]" />
        <Container className="relative py-20 md:py-32">
          <p className="font-heading text-7xl font-bold tracking-tight text-maroon-200 md:text-8xl">404</p>
          <h1 className="text-h1 mt-4">Sorry, we couldn’t find that page</h1>
          <p className="mt-4 max-w-prose text-lg text-ink-600">The page may have moved during our website update. These links can help.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/" icon={<Home className="h-[18px] w-[18px]" aria-hidden />}>
              Home
            </ButtonLink>
            <ButtonLink to="/doctors/" variant="outline" icon={<Stethoscope className="h-[18px] w-[18px]" aria-hidden />}>
              Find a Doctor
            </ButtonLink>
            <ButtonLink to="/patient-guide/opd-timings/" variant="outline" icon={<CalendarClock className="h-[18px] w-[18px]" aria-hidden />}>
              OPD Timings
            </ButtonLink>
            <ButtonLink to={tel} variant="outline" icon={<Phone className="h-[18px] w-[18px]" aria-hidden />} track="call-404">
              {`Call ${siteSettings.phoneDisplay}`}
            </ButtonLink>
          </div>
        </Container>
      </div>
    </>
  );
}
