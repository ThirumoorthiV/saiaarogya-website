import { ExternalLink, Quote } from "lucide-react";
import { about, siteSettings, type Portrait } from "@/content";
import type { GovernanceGroup, Person } from "@/types";
import { Todo } from "@/components/ui/Todo";

/** Portrait card for the Inspiration and the Founder (§5.2). */
export function PortraitCard({ eyebrow, person }: { eyebrow: string; person: Portrait }) {
  return (
    <article className="surface flex h-full flex-col overflow-hidden">
      <div className="relative flex items-center gap-5 bg-gradient-to-br from-maroon-800 to-maroon-950 p-6 text-white md:p-7">
        <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[24px] border-white/5" />
        <img src={person.photo} alt={`Portrait of ${person.name}`} width={104} height={104} loading="lazy" className="relative h-24 w-24 shrink-0 rounded-3xl object-cover ring-4 ring-white/15" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-maroon-200">{eyebrow}</p>
          {/* Name on its own line, so "The Founder" heading never wraps awkwardly (gap #12) */}
          <h3 className="mt-1.5 font-heading text-2xl font-bold text-white">{person.name}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <blockquote className="flex gap-3 rounded-2xl bg-maroon-50 p-4 font-heading text-lg font-semibold text-maroon-900">
          <Quote className="h-5 w-5 shrink-0 text-maroon-400" aria-hidden />
          <p>{person.quote}</p>
        </blockquote>
        <div className="prose-body mt-5 text-ink-700">
          {person.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

/** Mission & Trust two-column cards (§5.2). */
export function MissionTrust() {
  const url = siteSettings.trust.url;
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <article className="surface p-6 md:p-8">
        <p className="eyebrow">The Mission</p>
        <h3 className="mt-4 font-heading text-2xl font-bold text-ink-900">{about.mission.name}</h3>
        <div className="prose-body mt-4 text-ink-700">
          {about.mission.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>
      <article className="surface p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="eyebrow">The Trust</p>
          <img src={about.trust.logo} alt={`${about.trust.name} logo`} width={180} height={72} loading="lazy" className="h-12 w-auto" />
        </div>
        <h3 className="mt-4 font-heading text-2xl font-bold text-ink-900">{about.trust.name}</h3>
        <div className="prose-body mt-4 text-ink-700">
          {about.trust.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-5">
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold">
              Visit the Trust website <ExternalLink className="h-4 w-4" aria-hidden />
              <span className="sr-only"> (opens in a new tab)</span>
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
  const last = about.timeline.length - 1;
  return (
    <ol className="relative grid gap-6 lg:grid-cols-6 lg:gap-4">
      <span aria-hidden className="absolute bottom-3 left-[15px] top-3 w-px bg-maroon-200 lg:bottom-auto lg:left-4 lg:right-4 lg:top-[15px] lg:h-px lg:w-auto" />
      {about.timeline.map((e, i) => (
        <li key={e.title} className="relative pl-12 lg:pl-0 lg:pt-12">
          <span
            aria-hidden
            className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-ink-50 ${i === last ? "bg-maroon-700" : "bg-white ring-offset-0"} border ${i === last ? "border-maroon-700" : "border-maroon-200"}`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${i === last ? "bg-white" : "bg-maroon-700"}`} />
          </span>
          <div className="surface h-full p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-maroon-700">
              {e.date}
              {i === 0 && (
                <span className="ml-2 normal-case tracking-normal">
                  <Todo id="timeline-start-date" inline>
                    year
                  </Todo>
                </span>
              )}
            </p>
            <h3 className="mt-2 font-heading text-lg font-bold text-ink-900">{e.title}</h3>
            <p className="mt-1 text-[15px] text-ink-600">{e.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function PersonCard({ person }: { person: Person }) {
  return (
    <li className="surface flex h-full flex-col p-5 md:p-6">
      <div className="flex items-center gap-4">
        {person.photo ? (
          <img src={person.photo} alt={`Portrait of ${person.name}`} width={80} height={80} loading="lazy" className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover" />
        ) : (
          <span className="h-[72px] w-[72px] shrink-0 rounded-2xl bg-maroon-50" aria-hidden />
        )}
        <div>
          <h3 className="font-heading text-lg font-bold text-ink-900">{person.name}</h3>
          {person.role && <p className="text-sm font-medium text-maroon-700">{person.role}</p>}
        </div>
      </div>
      {person.bio ? (
        <p className="mt-4 text-[15px] text-ink-700">{person.bio}</p>
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
  const merged: { title: string; parts: GovernanceGroup[] }[] = [];
  for (const g of groups) {
    const prev = merged[merged.length - 1];
    if (prev && prev.title === g.title) prev.parts.push(g);
    else merged.push({ title: g.title, parts: [g] });
  }
  return (
    <div className="space-y-16">
      {merged.map((m) => {
        const id = `gov-${m.title.replace(/\W+/g, "-").toLowerCase()}`;
        return (
          <section key={m.title} aria-labelledby={id}>
            <h2 id={id} className="text-h2 mb-8">
              {m.title}
            </h2>
            <div className="space-y-8">
              {m.parts.map((g, i) => (
                <div key={i}>
                  {g.subtitle && <p className="eyebrow mb-4">{g.subtitle}</p>}
                  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                    {g.people.map((p) => (
                      <PersonCard key={p.slug} person={p} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
