import { useEffect, useRef, useState } from "react";
import { impactStats } from "@/content";
import { Container } from "@/components/ui/Container";

/**
 * Count-up for numeric values. Pre-rendered HTML always shows the final value;
 * the animation runs only in the browser when the number scrolls into view,
 * and never with prefers-reduced-motion.
 */
function CountUp({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const m = value.match(/^(\D*)([\d,]+)(.*)$/);
    const el = ref.current;
    if (!el || !m) return;
    const target = Number(m[2]!.replace(/,/g, ""));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already visible: keep the final value
    let frame = requestAnimationFrame(() => setDisplay(`${m[1]}0${m[3]}`));
    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / 1100);
        setDisplay(`${m[1]}${Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("en-IN")}${m[3]}`);
        if (p < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);
  return <span ref={ref}>{display}</span>;
}

/** §5.1-3 Impact counters — light card with tinted stat tiles. */
export function ImpactBand() {
  const dated = impactStats.find((s) => s.asOfDate)?.asOfDate;
  return (
    <section aria-labelledby="impact-band-title" className="bg-ink-50 py-10 md:py-16">
      <Container>
        <div className="surface p-5 md:p-10">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h2 id="impact-band-title" className="font-heading text-xl font-bold text-ink-900 sm:text-2xl md:text-3xl">
              Care that reaches everyone
            </h2>
            <p className="text-sm text-ink-600">{dated && `As of ${new Date(dated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}</p>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 md:mt-8 md:grid-cols-4 md:gap-4">
            {impactStats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse rounded-2xl bg-maroon-50 p-4 ring-1 ring-maroon-100 sm:rounded-3xl md:p-6">
                <dt className="mt-1 text-[13px] font-medium leading-snug text-ink-700 sm:mt-2 sm:text-[15px]">{s.label}</dt>
                <dd className="whitespace-nowrap font-heading text-[1.75rem] font-bold leading-none tracking-tight text-maroon-700 sm:text-4xl md:text-5xl">
                  {s.value ? <CountUp value={s.value} /> : "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
