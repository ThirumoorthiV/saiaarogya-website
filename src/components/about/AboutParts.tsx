import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, ExternalLink, Quote } from "lucide-react";
import { about, siteSettings, type Portrait } from "@/content";
import type { GovernanceGroup, Person } from "@/types";
import { cn } from "@/components/ui/cn";

/**
 * Inspiration / Founder feature (§5.2): framed square photo beside the text.
 * `reverse` puts the photo on the right on desktop, so consecutive rows alternate.
 */
export function PortraitFeature({ eyebrow, person, reverse = false }: { eyebrow: string; person: Portrait; reverse?: boolean }) {
  return (
    <article className="grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <figure className={cn("relative mx-auto w-full max-w-[420px]", reverse && "md:order-2")}>
        <div aria-hidden className={cn("absolute inset-0 hidden rounded-[2rem] bg-maroon-100 md:block md:translate-y-4", reverse ? "md:-translate-x-4" : "md:translate-x-4")} />
        <img
          src={person.photo}
          alt={`Portrait of ${person.name}`}
          width={480}
          height={480}
          loading="lazy"
          className="relative aspect-square w-full rounded-[2rem] object-cover object-center shadow-lift ring-1 ring-ink-200/60"
        />
      </figure>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">{person.name}</h3>
        <blockquote className="relative mt-6 pl-6">
          <span aria-hidden className="absolute bottom-1 left-0 top-1 w-1 rounded-full bg-maroon-700" />
          <Quote className="mb-2 h-6 w-6 text-maroon-300" aria-hidden />
          <p className="font-heading text-xl font-semibold leading-snug text-maroon-800 md:text-2xl">{person.quote}</p>
        </blockquote>
        <div className="prose-body mt-6 max-w-prose text-ink-700">
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
/**
 * Sticky vertical timeline with scroll progress.
 * Desktop: a sticky panel (current milestone, progress bar, jump list) beside the vertical timeline.
 * All sizes: the line fills in as you scroll and each milestone's dot fills once it is reached.
 * Without JavaScript it is a plain, fully readable vertical list.
 */
export function Timeline() {
  const events = about.timeline;
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const wrap = wrapRef.current;
    const list = listRef.current;
    if (!wrap || !list) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const dots = [...list.querySelectorAll<HTMLElement>("[data-dot]")];
      if (!dots.length) return;
      const centre = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      };
      const first = centre(dots[0]!);
      const last = centre(dots[dots.length - 1]!);
      const mark = window.innerHeight * 0.55; // the "reading line"
      const track = Math.max(1, last - first);
      const progress = Math.min(1, Math.max(0, (mark - first) / track));
      list.style.setProperty("--track", `${track}px`);
      wrap.style.setProperty("--progress", String(progress));
      let a = -1;
      dots.forEach((d, i) => {
        if (centre(d) <= mark) a = i;
      });
      setActive(a);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const shown = Math.max(active, 0);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div ref={wrapRef} className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14">
      {/* Sticky progress panel (desktop) */}
      <nav aria-label="Timeline milestones" className="hidden lg:block">
        <div className="surface sticky top-28 p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-600">
            Milestone <span className="text-maroon-700">{pad(shown + 1)}</span> / {pad(events.length)}
          </p>
          <p className="mt-3 font-heading text-3xl font-bold leading-tight text-maroon-800">{events[shown]!.date}</p>
          <p className="mt-1 text-lg font-semibold text-ink-900">{events[shown]!.title}</p>
          <div aria-hidden className="mt-5 h-1.5 overflow-hidden rounded-full bg-maroon-100">
            <div className="h-full origin-left rounded-full bg-maroon-700 motion-safe:transition-transform motion-safe:duration-150" style={{ transform: "scaleX(var(--progress, 0))" }} />
          </div>
          <ol className="mt-6 space-y-1">
            {events.map((e, i) => (
              <li key={e.title}>
                <a
                  href={`#milestone-${i + 1}`}
                  aria-current={i === active ? "step" : undefined}
                  className={cn(
                    "flex items-baseline gap-3 rounded-xl px-3 py-2 text-[15px] no-underline transition-colors hover:bg-maroon-50",
                    i === active ? "bg-maroon-50 font-semibold text-maroon-800" : i < active ? "text-ink-900" : "text-ink-600",
                  )}
                >
                  <span className="w-6 shrink-0 font-mono text-xs text-maroon-700">{pad(i + 1)}</span>
                  {e.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* Vertical timeline */}
      <ol ref={listRef} className="relative space-y-6">
        {/* track + scroll-progress fill, running from the first dot to the last */}
        <span aria-hidden className="absolute left-[15px] top-[38px] w-0.5 rounded-full bg-maroon-100" style={{ height: "var(--track, calc(100% - 76px))" }}>
          <span className="absolute inset-0 origin-top rounded-full bg-maroon-700" style={{ transform: "scaleY(var(--progress, 0))" }} />
        </span>
        {events.map((e, i) => {
          const reached = i <= active;
          return (
            <li key={e.title} id={`milestone-${i + 1}`} className="relative scroll-mt-32 pl-14">
              <span
                data-dot
                aria-hidden
                className={cn(
                  "absolute left-0 top-[22px] flex h-8 w-8 items-center justify-center rounded-full border-2 ring-4 ring-ink-50 motion-safe:transition-colors motion-safe:duration-300",
                  reached ? "border-maroon-700 bg-maroon-700" : "border-maroon-200 bg-white",
                )}
              >
                <span className={cn("h-2.5 w-2.5 rounded-full motion-safe:transition-colors", reached ? "bg-yellow-400" : "bg-maroon-300")} />
              </span>
              <div
                className={cn(
                  "surface p-5 motion-safe:transition-all motion-safe:duration-300 md:p-6",
                  i === active && "shadow-lift ring-2 ring-maroon-200",
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-maroon-700">
                  <span className="mr-2 font-mono text-ink-600">{pad(i + 1)}</span>
                  {e.date}
                </p>
                <h3 className="mt-2 font-heading text-lg font-bold text-ink-900 md:text-xl">{e.title}</h3>
                <p className="mt-1 text-[15px] text-ink-600 md:text-base">{e.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** `open` / `onToggle` come from GovernanceGroups so only one card's bio is expanded at a time. */
function PersonCard({ person, open, onToggle }: { person: Person; open: boolean; onToggle: () => void }) {
  const bioId = useId();
  const initials = person.name
    .replace(/^(Dr|Sri|Smt)\.?\s+/i, "")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  const long = (person.bio?.length ?? 0) > 150;
  return (
    <li className="surface flex h-full flex-col p-5 md:p-6">
      <div className="flex items-center gap-4">
        {person.photo ? (
          <img
            src={person.photo}
            alt={`Portrait of ${person.name}`}
            width={112}
            height={112}
            loading="lazy"
            className="h-24 w-24 shrink-0 rounded-2xl object-cover object-top ring-1 ring-ink-200 md:h-28 md:w-28"
          />
        ) : (
          <span aria-hidden className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-maroon-100 font-heading text-2xl font-bold text-maroon-700 md:h-28 md:w-28">
            {initials}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="font-heading text-lg font-bold leading-snug text-ink-900">{person.name}</h3>
          {person.role && <p className="mt-1.5 inline-block rounded-full bg-maroon-50 px-2.5 py-0.5 text-[13px] font-semibold text-maroon-800">{person.role}</p>}
        </div>
      </div>
      {person.bio && (
        <div className="mt-4 border-t border-ink-200/70 pt-4">
          <p id={bioId} className={cn("text-[15px] leading-relaxed text-ink-700", long && !open && "line-clamp-3")}>
            {person.bio}
          </p>
          {long && (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={bioId}
              onClick={onToggle}
              className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-maroon-700 hover:text-maroon-900"
            >
              {open ? "Show less" : "Read more"}
              <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden />
              <span className="sr-only"> about {person.name}</span>
            </button>
          )}
        </div>
      )}
    </li>
  );
}

/** Board of Trustees · Advisors · Management Committee — grouped grids (§5.2). */
export function GovernanceGroups({ groups }: { groups: GovernanceGroup[] }) {
  // Only one "Read more" open at a time across the page: opening a card closes the previous one
  const [openKey, setOpenKey] = useState<string | null>(null);
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
                    {g.people.map((p) => {
                      const key = `${m.title}-${i}-${p.slug}`;
                      return <PersonCard key={p.slug} person={p} open={openKey === key} onToggle={() => setOpenKey((k) => (k === key ? null : key))} />;
                    })}
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
