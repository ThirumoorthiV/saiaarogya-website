import { ExternalLink, Network } from "lucide-react";
import { about } from "@/content";
import { usePick, useT } from "@/i18n/LangContext";
import { Todo } from "@/components/ui/Todo";

/** §5.1-7 / §5.2: SMSIMSR · Sanjeevani Hospitals · Sai Swasthya Wellness Centres. */
export function NetworkCards() {
  const pick = usePick();
  const t = useT();
  return (
    <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
      {about.network.map((org) => (
        <li key={org.name} className="flex flex-col rounded-card bg-white p-5 shadow-card md:p-6">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">
            <Network className="h-6 w-6" aria-hidden />
          </span>
          <h3 className="mt-4 font-heading text-xl font-medium text-maroon-700">
            {org.name}
            {org.short && <span className="block text-base font-normal text-ink-600">{org.short}</span>}
          </h3>
          <p className="mt-2 flex-1 text-base text-ink-600">{pick(org.description)}</p>
          <div className="mt-4">
            {org.url ? (
              <a href={org.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold">
                Visit website <ExternalLink className="h-4 w-4" aria-hidden />
                <span className="sr-only">{t("a11y.opensNewTab")}</span>
              </a>
            ) : (
              <Todo id="network-url" inline>
                website link
              </Todo>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
