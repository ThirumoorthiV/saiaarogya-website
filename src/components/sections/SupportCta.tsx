import { HandHeart, HeartHandshake } from "lucide-react";
import { useT } from "@/i18n/LangContext";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

/** §5.1-10 Support CTA: Donate + Volunteer. */
export function SupportCta() {
  const t = useT();
  return (
    <section aria-labelledby="support-cta-title" className="bg-maroon-700 text-white">
      <Container className="flex flex-col items-start gap-6 py-section-sm md:flex-row md:items-center md:justify-between md:py-20">
        <div className="max-w-prose">
          <h2 id="support-cta-title" className="h2 text-white">
            {t("home.supportTitle")}
          </h2>
          <p className="mt-3 text-lg text-white/90">{t("home.supportText")}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink to="/support-us/donate/" icon={<HeartHandshake className="h-5 w-5" aria-hidden />} track="donate-home-cta">
            {t("actions.donate")}
          </ButtonLink>
          <ButtonLink to="/support-us/volunteer/" variant="light" icon={<HandHeart className="h-5 w-5" aria-hidden />} track="volunteer-home-cta">
            {t("actions.volunteer")}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
