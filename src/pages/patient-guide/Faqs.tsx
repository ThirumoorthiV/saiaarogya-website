import { faqsFor } from "@/content";
import { faqSchema } from "@/lib/schema";
import { GuideShell } from "@/components/guide/GuideShell";
import { FaqList } from "@/components/sections/FaqList";

/** Patient FAQs (§5.5) with FAQPage structured data for answered questions (§8). */
export function Component() {
  const items = faqsFor("PatientGuide");
  return (
    <GuideShell path="/patient-guide/faqs/" schema={[faqSchema(items)]}>
      <div className="mx-auto max-w-3xl">
        <FaqList items={items} />
      </div>
    </GuideShell>
  );
}
