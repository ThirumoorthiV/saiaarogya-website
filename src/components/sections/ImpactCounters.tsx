import { useEffect, useRef, useState } from "react";
import { impactStats } from "@/content";
import { usePick, useT } from "@/i18n/LangContext";
import { Container } from "@/components/ui/Container";
import type { ImpactStat } from "@/types";

/**
 * Animated count-up for numeric values. The pre-rendered HTML always shows
 * the final value; the animation only runs in the browser when the number
 * scrolls into view, and never with prefers-reduced-motion.
 */
function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\D*)([\d,]+)(.*)$/);
  const target = match ? Number(match[2]!.replace(/,/g, "")) : NaN;
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || Number.isNaN(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already visible — don't reset it
    // Below the fold: start from zero (scheduled, so it isn't a synchronous state update in the effect)
    let frame = requestAnimationFrame(() => setDisplay(`${match[1]}0${match[3]}`));
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / 1200);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(`${match[1]}${Math.round(target * eased).toLocaleString("en-IN")}${match[3]}`);
        if (p < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

function Stat({ stat }: { stat: ImpactStat }) {
  const pick = usePick();
  return (
    <div className="flex flex-col-reverse items-center px-2 text-center">
      <dt className="mt-2 text-base text-white md:text-lg">{pick(stat.label)}</dt>
      <dd className="font-heading text-4xl font-semibold text-gold-400 md:text-5xl">
        {stat.value ? (
          <CountUp value={stat.value} />
        ) : (
          <span data-todo="impact-number" className="inline-block rounded-md border-2 border-dashed border-gold-400 px-3 py-1 text-base font-medium md:text-lg">
            TODO
          </span>
        )}
      </dd>
    </div>
  );
}

/** §5.1-3 Impact counters on a maroon band. */
export function ImpactCounters() {
  const t = useT();
  const dated = impactStats.find((s) => s.asOfDate)?.asOfDate;
  return (
    <section aria-labelledby="impact-band-title" className="bg-maroon-700 py-12 text-white md:py-16">
      <Container>
        <h2 id="impact-band-title" className="sr-only">
          {t("home.impactTitle")}
        </h2>
        <dl className="grid grid-cols-2 gap-y-8 md:grid-cols-4">
          {impactStats.map((s) => (
            <Stat key={s.label.en} stat={s} />
          ))}
        </dl>
        <p className="mt-8 text-center text-sm text-white/85">
          {dated ? (
            t("common.asOf", { date: new Date(dated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) })
          ) : (
            <span data-todo="impact-as-of">TODO: “as of” date and confirmed figures for patients served and beds</span>
          )}
        </p>
      </Container>
    </section>
  );
}
