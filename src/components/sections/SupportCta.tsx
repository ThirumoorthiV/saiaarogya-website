import { HandHeart, HeartHandshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

/** §5.1-10 Support CTA: Donate + Volunteer on a light maroon card. */
export function SupportCta() {
  return (
    <section aria-labelledby="support-cta-title" className="bg-ink-50 py-16 md:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-4xl border border-maroon-100 bg-gradient-to-br from-maroon-100 via-maroon-50 to-white px-7 py-12 shadow-soft md:px-14 md:py-16">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border-[40px] border-maroon-200/40" />
          <div aria-hidden className="pointer-events-none absolute -bottom-32 right-40 h-72 w-72 rounded-full border-[28px] border-maroon-200/40" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow bg-white">Support us</p>
              <h2 id="support-cta-title" className="text-h2 mt-4 text-ink-900">
                Help us keep care free for everyone
              </h2>
              <p className="mt-4 text-lg text-ink-700">Your support helps us provide free, high-quality healthcare to underserved communities across India.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
              <ButtonLink to="/support-us/donate/" size="lg" icon={<HeartHandshake className="h-5 w-5" aria-hidden />} track="donate-home-cta">
                Donate
              </ButtonLink>
              <ButtonLink to="/support-us/volunteer/" variant="outline" size="lg" icon={<HandHeart className="h-5 w-5" aria-hidden />} track="volunteer-home-cta">
                Volunteer
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
