import type { ReactNode } from "react";
import { Landmark, PieChart, Receipt, Scale } from "lucide-react";
import { siteSettings } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Todo } from "@/components/ui/Todo";
import { PolicyLinks } from "@/components/support/SupportParts";

function Block({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="surface flex gap-4 p-6 md:p-8">
      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700">{icon}</span>
      <div className="flex-1">
        <h2 className="font-heading text-xl font-bold text-ink-900">{title}</h2>
        <div className="mt-3 text-ink-700">{children}</div>
      </div>
    </div>
  );
}

/** Transparency (§5.7): fund use, receipts, tax exemption, the Trust, policies. */
export function Component() {
  const path = "/support-us/transparency/";
  const meta = getPageMeta(path);
  const d = siteSettings.donation;
  const ic = "h-6 w-6";
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} />
      <PageHero title={meta.h1 ?? meta.title} eyebrow={<p className="eyebrow">Support us</p>} intro={meta.description} crumbs={meta.crumbs} path={path} />
      <div className="py-14 md:py-20">
        <Container className="grid gap-5 md:grid-cols-2">
          <Block icon={<PieChart className={ic} aria-hidden />} title="How funds are used">
            {d.fundUse ? <p>{d.fundUse}</p> : <Todo id="fund-use">Short statement on how donations are used, or a link to the annual report.</Todo>}
          </Block>
          <Block icon={<Receipt className={ic} aria-hidden />} title="Receipts and tax exemption">
            {d.taxInfo ? <p>{d.taxInfo}</p> : <Todo id="tax-exemption">Tax-exemption status (e.g. 80G), registration number and how receipts are issued.</Todo>}
          </Block>
          <Block icon={<Landmark className={ic} aria-hidden />} title="The Trust">
            <p>
              Sai Aarogya Hospital is a unit of the {siteSettings.trust.name}, established in 2012. Registered office: {siteSettings.trust.registeredOffice}.
            </p>
          </Block>
          <Block icon={<Scale className={ic} aria-hidden />} title="Policies">
            <PolicyLinks />
          </Block>
        </Container>
      </div>
    </>
  );
}
