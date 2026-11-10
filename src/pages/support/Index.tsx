import { HandHeart, ShieldCheck } from "lucide-react";
import { faqsFor } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { faqSchema } from "@/lib/schema";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { FaqList } from "@/components/sections/FaqList";
import { DONATION_APPEAL, DonatePaths, ImpactPerContribution } from "@/components/support/SupportParts";

/** Support Us (§5.7): hero, impact per contribution, donate paths, transparency, volunteer, FAQs. */
export function Component() {
  const path = "/support-us/";
  const meta = getPageMeta(path);
  const faqs = faqsFor("SupportUs");
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} schema={[faqSchema(faqs)]} />
      <PageHero
        title={meta.h1 ?? meta.title}
        eyebrow={<p className="eyebrow">Let’s Do This Together!</p>}
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
      <Section id="donate" eyebrow="Ways to give" title="Choose how you’d like to help">
        <DonatePaths />
      </Section>
      <Section id="impact" tone="white" eyebrow="Impact" title="What your contribution does">
        <ImpactPerContribution />
      </Section>
      <Section id="more">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { icon: ShieldCheck, title: "Transparency", text: "How funds are used, receipts, tax information and the Trust’s policies.", to: "/support-us/transparency/", cta: "See how funds are used" },
            { icon: HandHeart, title: "Volunteer", text: "Medical professionals and non-medical volunteers can share their time and skills.", to: "/support-us/volunteer/", cta: "Volunteer with us" },
          ].map((c) => (
            <div key={c.title} className="surface flex flex-col p-7 md:p-9">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700">
                <c.icon className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="mt-6 font-heading text-2xl font-bold text-ink-900">{c.title}</h2>
              <p className="mt-2 flex-1 text-ink-700">{c.text}</p>
              <div className="mt-6">
                <ButtonLink to={c.to} variant="soft">
                  {c.cta}
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section id="faqs" tone="white" eyebrow="FAQs" title="Frequently asked questions">
        <div className="max-w-3xl">
          <FaqList items={faqs} idPrefix="support-faq" />
        </div>
      </Section>
    </>
  );
}
