import { HandHeart, HeartHandshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

/** §5.1-10 Support CTA: Donate + Volunteer on a deep maroon card. */
export function SupportCta() {
  return (
    <section aria-labelledby="support-cta-title" className="bg-ink-50 py-16 md:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-maroon-700 via-maroon-800 to-maroon-950 px-7 py-12 text-white md:px-14 md:py-16">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border-[40px] border-white/5" />
          <div aria-hidden className="pointer-events-none absolute -bottom-32 right-40 h-72 w-72 rounded-full border-[28px] border-white/5" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow bg-white/10 text-maroon-100">Support us</p>
              <h2 id="support-cta-title" className="text-h2 mt-4 text-white">
                Help us keep care free for everyone
              </h2>
              <p className="mt-4 text-lg text-maroon-100">Your support helps us provide free, high-quality healthcare to underserved communities across India.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
              <ButtonLink to="/support-us/donate/" variant="onDark" size="lg" icon={<HeartHandshake className="h-5 w-5" aria-hidden />} track="donate-home-cta">
                Donate
              </ButtonLink>
              <ButtonLink to="/support-us/volunteer/" variant="onDarkOutline" size="lg" icon={<HandHeart className="h-5 w-5" aria-hidden />} track="volunteer-home-cta">
                Volunteer
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
