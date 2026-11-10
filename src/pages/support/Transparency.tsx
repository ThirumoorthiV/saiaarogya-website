import { Landmark, PieChart, Receipt, Scale } from "lucide-react";
import type { ReactNode } from "react";
import { siteSettings } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Todo } from "@/components/ui/Todo";
import { PolicyLinks } from "@/components/support/SupportParts";

function Block({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 rounded-card bg-white p-6 shadow-card">
      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">{icon}</span>
      <div className="flex-1">
        <h2 className="font-heading text-xl font-medium text-maroon-700">{title}</h2>
        <div className="mt-2 text-ink-900">{children}</div>
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
      <PageHeader title={meta.h1 ?? meta.title} intro={meta.description} crumbs={meta.crumbs} path={path} />
      <Section tone="cream">
        <div className="grid gap-6 md:grid-cols-2">
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
        </div>
      </Section>
    </>
  );
}
