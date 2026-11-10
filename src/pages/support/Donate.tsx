import { Globe, Receipt } from "lucide-react";
import { siteSettings } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { DONATION_APPEAL, ImpactPerContribution, IndianDonateButton } from "@/components/support/SupportParts";

/** Donate — Indian donors (§5.7). The old /donormanagement URL redirects here. */
export function Component() {
  const path = "/support-us/donate/";
  const meta = getPageMeta(path);
  const tax = siteSettings.donation.taxInfo;
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHero title={meta.h1 ?? meta.title} eyebrow={<p className="eyebrow">For Indian Donors - Indian Passport Holders</p>} intro={<p>{DONATION_APPEAL[1]}</p>} crumbs={meta.crumbs} path={path}>
        <div className="mt-8 max-w-xl">
          <IndianDonateButton />
        </div>
      </PageHero>
      <Section id="impact" eyebrow="Impact" title="What your contribution does">
        <ImpactPerContribution />
      </Section>
      <Section id="tax" tone="white" eyebrow="Receipts" title="Receipts and tax benefits">
        <div className="surface flex max-w-3xl gap-4 p-6 md:p-8">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700">
            <Receipt className="h-6 w-6" aria-hidden />
          </span>
          <div className="flex-1">{tax ? <p className="text-ink-900">{tax}</p> : <p>For donation receipts and tax-exemption details, please write to info@saisujalasravanthi.in.</p>}</div>
        </div>
      </Section>
      <Section id="abroad">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-maroon-50 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-maroon-700">
              <Globe className="h-6 w-6" aria-hidden />
            </span>
            <p className="max-w-prose text-ink-900">
              In case of foreign nationals who wish to contribute, please write to{" "}
              <a href={`mailto:${siteSettings.donation.internationalEmail}`} className="font-semibold">
                {siteSettings.donation.internationalEmail}
              </a>
            </p>
          </div>
          <ButtonLink to="/support-us/international-donors/">International donors</ButtonLink>
        </div>
      </Section>
    </>
  );
}
