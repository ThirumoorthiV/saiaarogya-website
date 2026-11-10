import { Clock, Home, Phone, Stethoscope } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { siteSettings } from "@/content";

export function Component() {
  return (
    <>
      <Seo
        title="Page not found"
        description="Sorry, we could not find that page. Find a doctor, check OPD timings or call Sai Aarogya Hospital, Bapatla — all care is free of charge."
        path="/404"
        noindex
      />
      <div className="bg-cream-100">
        <Container className="py-section-sm md:py-section">
          <p className="font-heading text-6xl font-semibold text-saffron-700">404</p>
          <h1 className="h1 mt-4">Sorry, we couldn’t find that page</h1>
          <p className="mt-4 max-w-prose text-lg text-ink-600">
            The page may have moved during our website update. These links can help you find what you need.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/" icon={<Home className="h-5 w-5" aria-hidden />}>
              Home
            </ButtonLink>
            <ButtonLink to="/doctors/" variant="secondary" icon={<Stethoscope className="h-5 w-5" aria-hidden />}>
              Find a Doctor
            </ButtonLink>
            <ButtonLink to="/patient-guide/opd-timings/" variant="secondary" icon={<Clock className="h-5 w-5" aria-hidden />}>
              OPD Timings
            </ButtonLink>
            <ButtonLink to={`tel:${siteSettings.phone}`} variant="secondary" icon={<Phone className="h-5 w-5" aria-hidden />} track="call-404">
              Call {siteSettings.phoneDisplay}
            </ButtonLink>
          </div>
        </Container>
      </div>
    </>
  );
}
