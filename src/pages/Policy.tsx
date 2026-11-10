import { useParams } from "react-router-dom";
import { getPolicy, policies } from "@/content";
import { fitDescription } from "@/lib/describe";
import { Seo } from "@/components/seo/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Todo } from "@/components/ui/Todo";
import { LLink } from "@/components/ui/LLink";
import { Component as NotFound } from "@/pages/NotFound";

const DESCRIPTIONS: Record<string, string> = {
  terms: "The terms and conditions for using the Sai Aarogya Hospital, Bapatla website, owned by the Sri Sathya Sai Sujala Sravanthi Trust, Hyderabad.",
  privacy: "How the Sri Sathya Sai Sujala Sravanthi Trust collects, uses and protects information you share on the Sai Aarogya Hospital, Bapatla website.",
  refund: "The cancellation and refund policy of the Sri Sathya Sai Sujala Sravanthi Trust for transactions made through the Sai Aarogya Hospital website.",
};

/** Policies (/policies/terms|privacy|refund) — text copied word for word from the current site. */
export function Component() {
  const { slug = "" } = useParams();
  const policy = getPolicy(slug);
  if (!policy) return <NotFound />;
  const path = `/policies/${policy.slug}/`;

  return (
    <>
      <Seo title={policy.title} description={fitDescription([DESCRIPTIONS[policy.slug] ?? policy.title])} path={path} />
      <PageHeader title={policy.title} crumbs={[{ label: "Policies" }, { label: policy.title }]} path={path} />
      <Section>
        <div className="max-w-prose space-y-8 text-ink-900">
          {(policy.slug === "refund" || policy.slug === "privacy") && (
            <Todo id="policy-review">
              {policy.slug === "refund"
                ? "This refund policy is e-commerce boilerplate (shipping, perishable items). Please review it for donations."
                : "Please review: this policy mentions job titles and promotional emails, and does not cover the new enquiry and volunteer forms."}
            </Todo>
          )}
          {policy.sections.map((s, i) => (
            <section key={i} className="space-y-4">
              {s.heading && <h2 className="h3">{s.heading}</h2>}
              {s.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
              {s.list.length > 0 && (
                <ul className="list-disc space-y-2 pl-6 marker:text-saffron-700">
                  {s.list.map((l, j) => (
                    <li key={j}>{l}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <nav aria-label="Other policies" className="border-t border-maroon-700/10 pt-6">
            <ul className="flex flex-wrap gap-4">
              {policies
                .filter((p) => p.slug !== policy.slug)
                .map((p) => (
                  <li key={p.slug}>
                    <LLink to={`/policies/${p.slug}/`}>{p.title}</LLink>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
      </Section>
    </>
  );
}
