import { useT } from "@/i18n/LangContext";
import { getPageMeta } from "@/lib/pageMeta";
import { hospitalSchema } from "@/lib/schema";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ContactDetails } from "@/components/sections/ContactDetails";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

/** Contact (§5.8): details left, enquiry form right, full-width map. */
export function Component() {
  const t = useT();
  const path = "/contact/";
  const meta = getPageMeta(path);
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} schema={[hospitalSchema()]} />
      <PageHeader title={meta.h1 ?? meta.title} intro={t("contact.formIntro")} crumbs={meta.crumbs} path={path} />

      <Section tone="cream" className="!pt-10 md:!pt-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
          <div>
            <h2 className="h3 mb-6">{t("contact.detailsTitle")}</h2>
            <ContactDetails />
          </div>
          <Card className="md:p-8">
            <h2 className="h3 mb-6">{t("contact.formTitle")}</h2>
            <EnquiryForm pagePath={path} />
          </Card>
        </div>
      </Section>

      <section aria-labelledby="contact-map" className="bg-white py-section-sm md:py-20">
        <div className="mx-auto max-w-content px-4 md:px-6">
          <h2 id="contact-map" className="h2 mb-6">
            {t("contact.mapTitle")}
          </h2>
          <MapEmbed className="h-[360px] md:h-[440px]" />
        </div>
      </section>
    </>
  );
}
