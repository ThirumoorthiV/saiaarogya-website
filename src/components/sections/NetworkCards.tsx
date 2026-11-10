import { ExternalLink, Network } from "lucide-react";
import { about } from "@/content";
import { Todo } from "@/components/ui/Todo";

/** §5.1-7 / §5.2: SMSIMSR · Sanjeevani Hospitals · Sai Swasthya Wellness Centres. */
export function NetworkCards() {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {about.network.map((org) => (
        <li key={org.name} className="surface flex flex-col p-6 md:p-7">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700">
            <Network className="h-6 w-6" aria-hidden strokeWidth={1.75} />
          </span>
          <h3 className="mt-5 font-heading text-lg font-bold text-ink-900">
            {org.name}
            {org.short && <span className="mt-0.5 block text-sm font-semibold text-maroon-700">{org.short}</span>}
          </h3>
          <p className="mt-2 flex-1 text-[15px] text-ink-600">{org.description}</p>
          <div className="mt-5">
            {org.url ? (
              <a href={org.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold">
                Visit website <ExternalLink className="h-4 w-4" aria-hidden />
                <span className="sr-only"> (opens in a new tab)</span>
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
