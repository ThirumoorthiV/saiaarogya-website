import { Mail } from "lucide-react";
import { siteSettings } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

/** International donors (§5.7): email + enquiry form preset to Donation. */
export function Component() {
  const path = "/support-us/international-donors/";
  const meta = getPageMeta(path);
  const email = siteSettings.donation.internationalEmail;
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHero
        title={meta.h1 ?? meta.title}
        eyebrow={<p className="eyebrow">Foreign nationals</p>}
        intro={
          <p>
            In case of foreign nationals who wish to contribute, please write to{" "}
            <a href={`mailto:${email}`} className="font-semibold">
              {email}
            </a>
            .
          </p>
        }
        actions={
          <ButtonLink to={`mailto:${email}`} variant="onDark" size="lg" icon={<Mail className="h-5 w-5" aria-hidden />}>
            Email the Trust
          </ButtonLink>
        }
        crumbs={meta.crumbs}
        path={path}
      />
      <div className="py-14 md:py-20">
        <Container>
          <div className="surface mx-auto max-w-3xl p-6 md:p-10">
            <h2 className="text-h3 mb-2 md:text-2xl">Or send us an enquiry</h2>
            <p className="mb-7 text-ink-600">Fields marked * are required.</p>
            <EnquiryForm defaultReason="donation" pagePath={path} />
          </div>
        </Container>
      </div>
    </>
  );
}
