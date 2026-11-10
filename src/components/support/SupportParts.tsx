import { FileText, Globe, HeartHandshake, Mail } from "lucide-react";
import { siteSettings } from "@/content";
import { ButtonLink } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";

/** Real copy from the current Donations page (Let's Do This Together!). */
export const DONATION_APPEAL = [
  "In today’s times of need, access to quality services and compassionate healthcare are among the most essential priorities for every individual on this planet.",
  "Let’s all join hands in this mission of delivering compassionate healthcare to those in need, absolutely free of cost! Every small step we take can make a big difference in giving someone a happier childhood and a healthier life.",
];

/** Primary online donation button for Indian donors (link TODO until supplied). */
export function IndianDonateButton() {
  const url = siteSettings.donation.indianDonorUrl;
  return url ? (
    <ButtonLink to={url} newTab icon={<HeartHandshake className="h-5 w-5" aria-hidden />} track="donate-indian">
      Donate online
    </ButtonLink>
  ) : (
    <Todo id="donation-link">Online donation link for Indian donors (the current site loads it through a Wix widget, so the URL is not visible in the page).</Todo>
  );
}

/** §5.7 Donate paths: Indian donors → online; International donors → email/enquiry. */
export function DonatePaths() {
  const email = siteSettings.donation.internationalEmail;
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      <li className="flex flex-col rounded-card bg-white p-6 shadow-card md:p-8">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-saffron-700 text-white">
          <HeartHandshake className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="h3 mt-4">For Indian Donors</h3>
        <p className="mt-1 font-medium text-ink-600">Indian Passport Holders</p>
        <p className="mt-3 flex-1 text-ink-900">Contribute online from India.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <IndianDonateButton />
          <ButtonLink to="/support-us/donate/" variant="ghost">
            Details
          </ButtonLink>
        </div>
      </li>
      <li className="flex flex-col rounded-card bg-white p-6 shadow-card md:p-8">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-700 text-white">
          <Globe className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="h3 mt-4">International Donors</h3>
        <p className="mt-1 font-medium text-ink-600">Foreign nationals</p>
        <p className="mt-3 flex-1 text-ink-900">
          In case of foreign nationals who wish to contribute, please write to{" "}
          <a href={`mailto:${email}`} className="break-all font-semibold">
            {email}
          </a>
          .
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink to={`mailto:${email}`} variant="secondary" icon={<Mail className="h-5 w-5" aria-hidden />}>
            Email the Trust
          </ButtonLink>
          <ButtonLink to="/support-us/international-donors/" variant="ghost">
            Enquiry form
          </ButtonLink>
        </div>
      </li>
    </ul>
  );
}

/** "₹X covers…" list from SiteSettings, or a TODO. */
export function ImpactPerContribution() {
  const list = siteSettings.donation.impactPerContribution;
  return list.length ? (
    <ul className="grid gap-4 md:grid-cols-3">
      {list.map((l) => (
        <li key={l} className="rounded-card bg-maroon-700 p-6 font-heading text-xl text-white">
          {l}
        </li>
      ))}
    </ul>
  ) : (
    <Todo id="donation-impact">Impact per contribution with real figures from the Trust (e.g. “₹X covers a day of OPD medicines”).</Todo>
  );
}

export function PolicyLinks() {
  return (
    <ul className="flex flex-wrap gap-3">
      {[
        ["/policies/terms/", "Terms & Conditions"],
        ["/policies/privacy/", "Privacy Policy"],
        ["/policies/refund/", "Refund Policy"],
      ].map(([to, label]) => (
        <li key={to}>
          <ButtonLink to={to!} variant="secondary" icon={<FileText className="h-4 w-4" aria-hidden />}>
            {label!}
          </ButtonLink>
        </li>
      ))}
    </ul>
  );
}
