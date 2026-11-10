import { getPageMeta } from "@/lib/pageMeta";
import { hospitalSchema } from "@/lib/schema";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactDetails } from "@/components/sections/ContactDetails";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

/** Contact (§5.8): details left, enquiry form right, full-width map. */
export function Component() {
  const path = "/contact/";
  const meta = getPageMeta(path);
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} schema={[hospitalSchema()]} />
      <PageHero
        title={meta.h1 ?? meta.title}
        eyebrow={<p className="eyebrow">Contact</p>}
        intro="We'd love to hear from you! Whether you have a question, feedback, or need assistance, our team is here to help."
        crumbs={meta.crumbs}
        path={path}
      />
      <div className="py-14 md:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr] lg:gap-8">
            <div className="surface p-6 md:p-8">
              <h2 className="text-h3 mb-7 md:text-2xl">Get in touch</h2>
              <ContactDetails />
            </div>
            <div className="surface p-6 md:p-10">
              <h2 className="text-h3 mb-2 md:text-2xl">Send us a message</h2>
              <p className="mb-7 text-ink-600">Fields marked * are required.</p>
              <EnquiryForm pagePath={path} />
            </div>
          </div>
          <section aria-labelledby="contact-map" className="mt-14 md:mt-20">
            <h2 id="contact-map" className="text-h2 mb-8">
              Find us on the map
            </h2>
            <MapEmbed className="h-[380px] md:h-[460px]" />
          </section>
        </Container>
      </div>
    </>
  );
}
