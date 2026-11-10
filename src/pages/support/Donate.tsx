import { Receipt } from "lucide-react";
import { siteSettings } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Todo } from "@/components/ui/Todo";
import { ButtonLink } from "@/components/ui/Button";
import { DONATION_APPEAL, ImpactPerContribution, IndianDonateButton } from "@/components/support/SupportParts";

/** Donate — Indian donors (§5.7). Old /donormanagement redirects here. */
export function Component() {
  const path = "/support-us/donate/";
  const meta = getPageMeta(path);
  const tax = siteSettings.donation.taxInfo;
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHeader
        title={meta.h1 ?? meta.title}
        eyebrow={<p className="font-heading text-xl text-saffron-700">For Indian Donors - Indian Passport Holders</p>}
        intro={<p>{DONATION_APPEAL[1]}</p>}
        crumbs={meta.crumbs}
        path={path}
      >
        <div className="mt-6">
          <IndianDonateButton />
        </div>
      </PageHeader>

      <Section id="impact" title="What your contribution does">
        <ImpactPerContribution />
      </Section>

      <Section id="tax" tone="cream" title="Receipts and tax benefits">
        <div className="flex max-w-prose gap-4">
          <Receipt className="mt-1 h-7 w-7 shrink-0 text-maroon-700" aria-hidden />
          {tax ? <p className="text-ink-900">{tax}</p> : <Todo id="tax-exemption">Are donations tax-exempt (e.g. 80G)? Registration number and how receipts are issued.</Todo>}
        </div>
      </Section>

      <Section id="abroad">
        <div className="flex flex-col items-start gap-4 rounded-card bg-maroon-50 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <p className="max-w-prose text-ink-900">
            In case of foreign nationals who wish to contribute, please write to{" "}
            <a href={`mailto:${siteSettings.donation.internationalEmail}`} className="font-semibold">
              {siteSettings.donation.internationalEmail}
            </a>
          </p>
          <ButtonLink to="/support-us/international-donors/" variant="secondary">
            International donors
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
