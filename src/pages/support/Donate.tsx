import { Globe, HeartHandshake, Receipt } from "lucide-react";
import { siteSettings } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { DONATION_APPEAL, ImpactPerContribution } from "@/components/support/SupportParts";
import { DonationForm } from "@/components/forms/DonationForm";

/** Donate — Indian donors (§5.7). The old /donormanagement URL redirects here. */
export function Component() {
  const path = "/support-us/donate/";
  const meta = getPageMeta(path);
  const tax = siteSettings.donation.taxInfo;
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHero title={meta.h1 ?? meta.title} eyebrow={<p className="eyebrow">For Indian Donors - Indian Passport Holders</p>} intro={<p>{DONATION_APPEAL[1]}</p>} crumbs={meta.crumbs} path={path}>
        <div className="mt-8">
          <ButtonLink to="#donate-form" size="lg" icon={<HeartHandshake className="h-5 w-5" aria-hidden />} track="donate-hero">
            Donate now
          </ButtonLink>
        </div>
      </PageHero>
      <Section
        id="donate-form"
        tone="white"
        eyebrow="Donate"
        title="Make a donation"
        intro="This form accepts contributions from Indian passport holders only. Choose how often and how much you would like to give."
      >
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-12">
          <div className="surface p-5 sm:p-8 md:p-10">
            <DonationForm />
          </div>
          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="rounded-3xl bg-maroon-50 p-6 ring-1 ring-maroon-100">
              <p className="font-heading text-lg font-bold text-ink-900">Your gift keeps care free</p>
              <ul className="mt-3 space-y-2 text-[15px] text-ink-700">
                {siteSettings.donation.impactPerContribution.map((l) => (
                  <li key={l} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon-700" aria-hidden />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface p-6 text-[15px] text-ink-700">
              <p className="font-heading text-lg font-bold text-ink-900">Need help?</p>
              <p className="mt-2">
                Call <a href={`tel:${siteSettings.phone}`}>{siteSettings.phoneDisplay}</a> or write to{" "}
                <a href={`mailto:${siteSettings.donation.internationalEmail}`} className="break-all">
                  {siteSettings.donation.internationalEmail}
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </Section>
      <Section id="impact" eyebrow="Impact" title="What your contribution does">
        <ImpactPerContribution />
      </Section>
      <Section id="tax" eyebrow="Receipts" title="Receipts and tax benefits">
        <div className="surface flex max-w-3xl gap-4 p-6 md:p-8">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700">
            <Receipt className="h-6 w-6" aria-hidden />
          </span>
          <div className="flex-1">{tax ? <p className="text-ink-900">{tax}</p> : <p>For donation receipts and tax-exemption details, please write to info@saisujalasravanthi.in.</p>}</div>
        </div>
      </Section>
      <Section id="abroad" tone="white">
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
