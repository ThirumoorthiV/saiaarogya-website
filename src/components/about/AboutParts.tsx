import { ExternalLink, Quote } from "lucide-react";
import { about, siteSettings, type Portrait } from "@/content";
import type { GovernanceGroup, Person } from "@/types";
import { cn } from "@/components/ui/cn";

/**
 * Inspiration / Founder feature row (§5.2): photo on one side, text on the other.
 * `reverse` puts the photo on the right on desktop, so consecutive rows alternate.
 */
export function PortraitFeature({ eyebrow, person, reverse = false }: { eyebrow: string; person: Portrait; reverse?: boolean }) {
  return (
    <article className="surface grid items-center overflow-hidden md:grid-cols-2">
      <div className={cn("flex h-full items-center justify-center bg-gradient-to-br from-maroon-100 to-maroon-50 p-5 sm:p-8", reverse && "md:order-2")}>
        <img src={person.photo} alt={`Portrait of ${person.name}`} width={640} height={480} loading="lazy" className="h-auto w-full max-w-xl rounded-3xl shadow-lift ring-4 ring-white" />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
        <p className="eyebrow self-start">{eyebrow}</p>
        <h3 className="mt-4 font-heading text-2xl font-bold text-ink-900 md:text-3xl">{person.name}</h3>
        <blockquote className="mt-5 flex gap-3 border-l-4 border-maroon-300 bg-maroon-50 py-3 pl-4 pr-4 font-heading text-lg font-semibold text-maroon-900 rounded-r-2xl">
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
        {url && (
          <div className="mt-5">
            <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold">
              Visit the Trust website <ExternalLink className="h-4 w-4" aria-hidden />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        )}
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
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-maroon-700">{e.date}</p>
            <h3 className="mt-2 font-heading text-lg font-bold text-ink-900">{e.title}</h3>
            <p className="mt-1 text-[15px] text-ink-600">{e.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function PersonCard({ person }: { person: Person }) {
  const initials = person.name
    .replace(/^(Dr|Sri|Smt)\.?\s+/i, "")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <li className="surface surface-hover group flex h-full flex-col overflow-hidden p-2">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-maroon-100 to-maroon-50">
        {person.photo ? (
          <img
            src={person.photo}
            alt={`Portrait of ${person.name}`}
            width={320}
            height={320}
            loading="lazy"
            className="aspect-square w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex aspect-square w-full items-center justify-center font-heading text-4xl font-bold text-maroon-700" aria-hidden>
            {initials}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-4 text-center">
        <h3 className="font-heading text-lg font-bold text-ink-900">{person.name}</h3>
        {person.role && <p className="mt-0.5 text-sm font-semibold text-maroon-700">{person.role}</p>}
        {person.bio && <p className="mt-3 text-[15px] text-ink-700">{person.bio}</p>}
      </div>
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
                  <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
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
