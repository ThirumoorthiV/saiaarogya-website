import { faqsFor } from "@/content";
import { useLang } from "@/i18n/LangContext";
import { faqSchema } from "@/lib/schema";
import { GuidePage } from "@/components/guide/GuidePage";
import { FaqList } from "@/components/sections/FaqList";

/** Patient FAQs (§5.5) with FAQPage structured data for answered questions (§8). */
export function Component() {
  const lang = useLang();
  const items = faqsFor("PatientGuide");
  return (
    <GuidePage path="/patient-guide/faqs/" schema={[faqSchema(items, lang)]}>
      <FaqList items={items} />
    </GuidePage>
  );
}
