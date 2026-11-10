import { ExternalLink, Quote } from "lucide-react";
import { about, siteSettings } from "@/content";
import type { GovernanceGroup, Person } from "@/types";
import { Todo } from "@/components/ui/Todo";

/** Portrait card with quote for the Inspiration and the Founder (§5.2). */
export function PortraitCard({ eyebrow, person }: { eyebrow: string; person: { name: string; photo: string; quote: string; body: string[] } }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card">
      <div className="flex items-center gap-5 bg-maroon-700 p-5 text-white md:p-6">
        <img src={person.photo} alt={`Portrait of ${person.name}`} width={96} height={96} loading="lazy" className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-gold-400/70 md:h-24 md:w-24" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-400">{eyebrow}</p>
          {/* "The Founder" heading no longer wraps (gap #12): name sits on its own line */}
          <h3 className="mt-1 font-heading text-2xl font-medium text-white">{person.name}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <blockquote className="flex gap-3 border-l-4 border-saffron-500 pl-4 font-heading text-xl text-maroon-700">
          <Quote className="h-5 w-5 shrink-0 text-saffron-500" aria-hidden />
          <p>{person.quote}</p>
        </blockquote>
        <div className="prose-body mt-4 text-ink-900">
          {person.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

/** Mission and Trust two-column cards (§5.2). */
export function MissionTrust() {
  const trustUrl = siteSettings.trust.url;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <article className="rounded-card bg-white p-6 shadow-card md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-saffron-700">The Mission</p>
        <h3 className="h3 mt-2">{about.mission.name}</h3>
        <div className="prose-body mt-4 text-ink-900">
          {about.mission.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>
      <article className="rounded-card bg-white p-6 shadow-card md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-saffron-700">The Trust</p>
        <img src={about.trust.logo} alt={`${about.trust.name} logo`} width={180} height={72} loading="lazy" className="mt-3 h-14 w-auto" />
        <h3 className="h3 mt-3">{about.trust.name}</h3>
        <div className="prose-body mt-4 text-ink-900">
          {about.trust.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-5">
          {trustUrl ? (
            <a href={trustUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold">
              Visit the Trust website <ExternalLink className="h-4 w-4" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            <Todo id="trust-url" inline>
              Trust website link
            </Todo>
          )}
        </div>
      </article>
    </div>
  );
}

/** History timeline: vertical on mobile, horizontal on desktop (§5.2). */
export function Timeline() {
  return (
    <ol className="relative grid gap-8 lg:grid-cols-6 lg:gap-4">
      {/* connecting line */}
      <span aria-hidden className="absolute bottom-2 left-[11px] top-2 w-0.5 bg-saffron-500/50 lg:bottom-auto lg:left-2 lg:right-2 lg:top-[11px] lg:h-0.5 lg:w-auto" />
      {about.timeline.map((e, i) => (
        <li key={e.title} className="relative pl-10 lg:pl-0 lg:pt-10">
          <span
            aria-hidden
            className={`absolute left-0 top-0.5 h-6 w-6 rounded-full border-4 border-white shadow ${i === about.timeline.length - 1 ? "bg-saffron-700" : "bg-maroon-700"}`}
          />
          <p className="text-sm font-semibold uppercase tracking-wide text-saffron-700">
            {e.date}
            {i === 0 && (
              <span className="ml-2 normal-case tracking-normal">
                <Todo id="timeline-start-date" inline>
                  year
                </Todo>
              </span>
            )}
          </p>
          <h3 className="mt-1 font-heading text-xl font-medium text-maroon-700">{e.title}</h3>
          <p className="mt-1 text-base text-ink-600">{e.text}</p>
        </li>
      ))}
    </ol>
  );
}

function PersonCard({ person }: { person: Person }) {
  return (
    <li className="flex h-full flex-col rounded-card bg-white p-5 shadow-card">
      <div className="flex items-center gap-4">
        {person.photo ? (
          <img src={person.photo} alt={`Portrait of ${person.name}`} width={80} height={80} loading="lazy" className="h-20 w-20 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="h-20 w-20 shrink-0 rounded-full bg-maroon-50" aria-hidden />
        )}
        <div>
          <h3 className="font-heading text-xl font-medium text-maroon-700">{person.name}</h3>
          {person.role && <p className="text-sm font-medium text-ink-600">{person.role}</p>}
        </div>
      </div>
      {person.bio ? (
        <p className="mt-4 text-base text-ink-900">{person.bio}</p>
      ) : (
        <div className="mt-4">
          <Todo id="governance-bio" inline>
            short bio (optional)
          </Todo>
        </div>
      )}
    </li>
  );
}

/** Board of Trustees · Advisors · Management Committee — grouped grids (§5.2). */
export function GovernanceGroups({ groups }: { groups: GovernanceGroup[] }) {
  // Merge consecutive groups that share a title (e.g. Management Committee: President + Members)
  const merged: { title: string; parts: GovernanceGroup[] }[] = [];
  for (const g of groups) {
    const last = merged[merged.length - 1];
    if (last && last.title === g.title) last.parts.push(g);
    else merged.push({ title: g.title, parts: [g] });
  }
  return (
    <div className="space-y-14">
      {merged.map((m) => (
        <section key={m.title} aria-labelledby={`gov-${m.title.replace(/\W+/g, "-").toLowerCase()}`}>
          <h2 id={`gov-${m.title.replace(/\W+/g, "-").toLowerCase()}`} className="h2 mb-6">
            {m.title}
          </h2>
          <div className="space-y-8">
            {m.parts.map((g, i) => (
              <div key={i}>
                {g.subtitle && <p className="mb-4 font-heading text-lg font-medium text-saffron-700">{g.subtitle}</p>}
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {g.people.map((p) => (
                    <PersonCard key={p.slug} person={p} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
