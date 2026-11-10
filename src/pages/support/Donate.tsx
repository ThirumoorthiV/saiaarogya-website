import { BadgeCheck, FileText, Globe, Mail, Phone } from "lucide-react";
import { about, siteSettings } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ImpactPerContribution } from "@/components/support/SupportParts";
import { DonationForm } from "@/components/forms/DonationForm";

/** Copy from the current website's donation page (/donateus). */
const INTRO =
  "Your generous support helps us continue to provide vital services and make a lasting impact. Every donation counts, and together we can bring about positive change. Contribute today and be a part of something bigger.";
const MISSION = "Providing relief to the poor and needy in the areas of Drinking water, Sanitation, Rural infrastructure, Education, Nutrition, Healthcare and other charitable activities";
const VOLUNTARY =
  "The Trust works purely on a voluntary basis and has been rendering services in the areas mentioned above. Love for God and love for humanity are the motivating factors for this Trust.";

/** Donate — Indian donors (§5.7). Same fields and content as the current /donateus page. The old /donormanagement URL redirects here. */
export function Component() {
  const path = "/support-us/donate/";
  const meta = getPageMeta(path);
  const d = siteSettings.donation;
  const tel = `tel:${d.contactPhone.replace(/[^\d+]/g, "")}`;
  const h = "font-heading text-xl font-bold text-maroon-800";
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHero title="Make a Difference, Donate Today" eyebrow={<p className="eyebrow">For Indian Donors - Indian Passport Holders</p>} intro={<p>{INTRO}</p>} crumbs={meta.crumbs} path={path} />

      <div id="donate-form" className="scroll-mt-28 bg-white py-14 md:py-20">
        <Container className="grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          {/* Left: Trust information (from the current page) */}
          <div className="space-y-8">
            <div className="space-y-5">
              <img src={about.trust.logo} alt={`${about.trust.name} logo`} width={180} height={72} loading="lazy" className="h-14 w-auto" />
              <p className="font-heading text-xl font-bold leading-snug text-maroon-800 md:text-2xl">{MISSION}</p>
              <p className="inline-flex items-center gap-2 rounded-2xl bg-maroon-50 px-4 py-3 font-semibold text-maroon-900 ring-1 ring-maroon-100">
                <BadgeCheck className="h-5 w-5 shrink-0 text-maroon-700" aria-hidden />
                This page accepts contributions from Indian Passport holders only
              </p>
              <p className="text-ink-700">{VOLUNTARY}</p>
            </div>

            <section aria-labelledby="tax-title" className="surface p-6">
              <h2 id="tax-title" className={h}>
                Tax exemption details
              </h2>
              <dl className="mt-4 divide-y divide-ink-200/70">
                {d.registrations.map((r) => (
                  <div key={r.label} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <dt className="text-[15px] text-ink-600">{r.label}</dt>
                    <dd className="font-mono text-[15px] font-semibold tracking-wide text-ink-900">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="dcontact-title" className="surface p-6">
              <h2 id="dcontact-title" className={h}>
                Contact Us
              </h2>
              <ul className="mt-4 space-y-3 text-[15px]">
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-maroon-700" aria-hidden />
                  <a href={`mailto:${d.internationalEmail}`} className="break-all">
                    {d.internationalEmail}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-maroon-700" aria-hidden />
                  <a href={tel}>{d.contactPhone}</a>
                </li>
              </ul>
            </section>

            <section id="donate-terms" aria-labelledby="dterms-title" className="surface p-6">
              <h2 id="dterms-title" className={h}>
                <FileText className="mr-2 inline h-5 w-5 align-[-3px]" aria-hidden />
                Terms &amp; Conditions
              </h2>
              <p className="mt-3 text-[15px] text-ink-700">
                You agree to share information entered on this page with SRI SATHYA SAI SUJALA SRAVANTHI TRUST (owner of this page), adhering to applicable laws.
              </p>
            </section>
          </div>

          {/* Right: the donation form */}
          <div className="surface p-5 sm:p-8 md:p-10">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-maroon-700">Support our cause</p>
            <h2 className="text-h2 mt-2">Help us make a difference</h2>
            <div className="mt-8">
              <DonationForm />
            </div>
          </div>
        </Container>
      </div>

      <Section id="impact" eyebrow="Impact" title="What your contribution does">
        <ImpactPerContribution />
      </Section>

      <Section id="abroad" tone="white">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-maroon-50 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-maroon-700">
              <Globe className="h-6 w-6" aria-hidden />
            </span>
            <p className="max-w-prose text-ink-900">
              In case of foreign nationals who wish to contribute, please write to{" "}
              <a href={`mailto:${d.internationalEmail}`} className="font-semibold">
                {d.internationalEmail}
              </a>
            </p>
          </div>
          <ButtonLink to="/support-us/international-donors/" variant="outline">
            International donors
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
