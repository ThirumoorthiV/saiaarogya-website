import { FileText, Globe, HeartHandshake, Mail } from "lucide-react";
import { siteSettings } from "@/content";
import { ButtonLink } from "@/components/ui/Button";

/** Real copy from the current Donations page ("Let's Do This Together!"). */
export const DONATION_APPEAL = [
  "In today’s times of need, access to quality services and compassionate healthcare are among the most essential priorities for every individual on this planet.",
  "Let’s all join hands in this mission of delivering compassionate healthcare to those in need, absolutely free of cost! Every small step we take can make a big difference in giving someone a happier childhood and a healthier life.",
];

/** Online donation button for Indian donors: jumps straight to the donation form (or an external link if one is set). */
export function IndianDonateButton({ onDark = false }: { onDark?: boolean }) {
  const url = siteSettings.donation.indianDonorUrl;
  return url ? (
    <ButtonLink to={url} newTab variant={onDark ? "onDark" : "primary"} size="lg" icon={<HeartHandshake className="h-5 w-5" aria-hidden />} track="donate-indian">
      Donate online
    </ButtonLink>
  ) : (
    <ButtonLink to="/support-us/donate/#donate-form" variant={onDark ? "onDark" : "primary"} size="lg" icon={<HeartHandshake className="h-5 w-5" aria-hidden />} track="donate-indian-contact">
      Donate now
    </ButtonLink>
  );
}

/** §5.7 Donate paths: Indian donors → online; international donors → email / enquiry. */
export function DonatePaths() {
  const email = siteSettings.donation.internationalEmail;
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      <li className="relative flex flex-col overflow-hidden rounded-4xl border border-maroon-100 bg-gradient-to-br from-maroon-50 to-white p-7 shadow-soft md:p-9">
        <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[32px] border-maroon-100/60" />
        <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-maroon-100 text-maroon-700">
          <HeartHandshake className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="relative mt-6 font-heading text-2xl font-bold text-ink-900">For Indian Donors</h3>
        <p className="relative mt-1 font-medium text-maroon-700">Indian Passport Holders</p>
        <p className="relative mt-4 flex-1 text-ink-700">Contribute online from India.</p>
        <div className="relative mt-6 flex flex-wrap items-center gap-3">
          <IndianDonateButton />
          {/* "Donate now" jumps to the form; this goes to the 80G / fund-use page */}
          <ButtonLink to="/support-us/transparency/" variant="outline">
            Tax benefits
          </ButtonLink>
        </div>
      </li>
      <li className="surface flex flex-col p-7 md:p-9">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700">
          <Globe className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="mt-6 font-heading text-2xl font-bold text-ink-900">International Donors</h3>
        <p className="mt-1 font-medium text-maroon-700">Foreign nationals</p>
        <p className="mt-4 flex-1 text-ink-700">
          In case of foreign nationals who wish to contribute, please write to{" "}
          <a href={`mailto:${email}`} className="break-all font-semibold">
            {email}
          </a>
          .
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink to={`mailto:${email}`} variant="soft" icon={<Mail className="h-[18px] w-[18px]" aria-hidden />}>
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

/** "What your support pays for" list from SiteSettings. */
export function ImpactPerContribution() {
  const list = siteSettings.donation.impactPerContribution;
  if (!list.length) return null;
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {list.map((l) => (
        <li key={l} className="surface p-6 font-heading text-xl font-bold text-maroon-800">
          {l}
        </li>
      ))}
    </ul>
  );
}

export function PolicyLinks() {
  return (
    <ul className="flex flex-wrap gap-2">
      {[
        ["/policies/terms/", "Terms & Conditions"],
        ["/policies/privacy/", "Privacy Policy"],
        ["/policies/refund/", "Refund Policy"],
      ].map(([to, label]) => (
        <li key={to}>
          <ButtonLink to={to!} variant="outline" icon={<FileText className="h-4 w-4" aria-hidden />}>
            {label!}
          </ButtonLink>
        </li>
      ))}
    </ul>
  );
}
