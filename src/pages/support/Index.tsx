import { FileCheck2, HandHeart } from "lucide-react";
import { faqsFor } from "@/content";
import { useLang } from "@/i18n/LangContext";
import { getPageMeta } from "@/lib/pageMeta";
import { faqSchema } from "@/lib/schema";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { FaqList } from "@/components/sections/FaqList";
import { DONATION_APPEAL, DonatePaths, ImpactPerContribution } from "@/components/support/SupportParts";

/** Support Us (§5.7): hero, impact per contribution, donate paths, transparency, volunteer, FAQs. */
export function Component() {
  const lang = useLang();
  const path = "/support-us/";
  const meta = getPageMeta(path);
  const faqs = faqsFor("SupportUs");
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} schema={[faqSchema(faqs, lang)]} />
      <PageHeader
        title={meta.h1 ?? meta.title}
        eyebrow={<p className="font-heading text-xl text-saffron-700">Let’s Do This Together!</p>}
        intro={
          <div className="space-y-3">
            {DONATION_APPEAL.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        }
        crumbs={meta.crumbs}
        path={path}
      />

      <Section id="impact" title="What your contribution does">
        <ImpactPerContribution />
      </Section>

      <Section id="donate" tone="cream" title="Ways to give">
        <DonatePaths />
      </Section>

      <Section id="more">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-card bg-maroon-50 p-6 md:p-8">
            <FileCheck2 className="h-8 w-8 text-maroon-700" aria-hidden />
            <h2 className="h3 mt-4">Transparency</h2>
            <p className="mt-2 flex-1 text-ink-900">How funds are used, receipts, tax information and the Trust’s policies.</p>
            <div className="mt-5">
              <ButtonLink to="/support-us/transparency/" variant="secondary">
                See how funds are used
              </ButtonLink>
            </div>
          </div>
          <div className="flex flex-col rounded-card bg-maroon-50 p-6 md:p-8">
            <HandHeart className="h-8 w-8 text-maroon-700" aria-hidden />
            <h2 className="h3 mt-4">Volunteer</h2>
            <p className="mt-2 flex-1 text-ink-900">Medical professionals and non-medical volunteers can share their time and skills.</p>
            <div className="mt-5">
              <ButtonLink to="/support-us/volunteer/" variant="secondary">
                Volunteer with us
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <Section id="faqs" tone="cream" title="Frequently asked questions">
        <FaqList items={faqs} idPrefix="support-faq" />
      </Section>
    </>
  );
}
