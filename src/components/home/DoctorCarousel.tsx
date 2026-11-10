import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { doctors } from "@/content";
import { DoctorCard } from "@/components/doctors/DoctorCard";

/**
 * §5.1-5 "Meet our doctors" — native scroll-snap carousel (swipe on touch,
 * keyboard-scrollable, works without JS) with prev/next buttons on desktop.
 */
export function DoctorCarousel() {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step * 2, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const btn = "inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-900 transition hover:border-maroon-200 hover:bg-maroon-50 hover:text-maroon-800";
  return (
    <div>
      <div className="mb-5 hidden justify-end gap-2 md:flex">
        <button type="button" className={btn} onClick={() => scroll(-1)} aria-controls="doctor-track">
          <ArrowLeft className="h-5 w-5" aria-hidden />
          <span className="sr-only">Previous doctors</span>
        </button>
        <button type="button" className={btn} onClick={() => scroll(1)} aria-controls="doctor-track">
          <ArrowRight className="h-5 w-5" aria-hidden />
          <span className="sr-only">Next doctors</span>
        </button>
      </div>
      <ul
        id="doctor-track"
        ref={track}
        tabIndex={0}
        aria-label="Our doctors"
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-6 pt-1 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 md:gap-5 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {doctors.map((d) => (
          <li key={d.slug} className="w-[70%] shrink-0 snap-start sm:w-[46%] md:w-[31%] lg:w-[calc(25%-15px)]">
            <DoctorCard rowOnMobile={false} doctor={d} />
          </li>
        ))}
      </ul>
    </div>
  );
}
