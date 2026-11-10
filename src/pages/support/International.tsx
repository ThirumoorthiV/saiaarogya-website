import { Mail } from "lucide-react";
import { siteSettings } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

/** International donors (§5.7): email + enquiry form (reason preset to Donation). */
export function Component() {
  const path = "/support-us/international-donors/";
  const meta = getPageMeta(path);
  const email = siteSettings.donation.internationalEmail;
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHeader
        title={meta.h1 ?? meta.title}
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
          <ButtonLink to={`mailto:${email}`} icon={<Mail className="h-5 w-5" aria-hidden />}>
            Email the Trust
          </ButtonLink>
        }
        crumbs={meta.crumbs}
        path={path}
      />
      <Section tone="cream" title="Or send us an enquiry">
        <Card className="max-w-3xl md:p-8">
          <EnquiryForm defaultReason="donation" pagePath={path} />
        </Card>
      </Section>
    </>
  );
}
