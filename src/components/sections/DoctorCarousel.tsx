import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { doctors } from "@/content";
import { useT } from "@/i18n/LangContext";
import { DoctorCard } from "@/components/doctors/DoctorCard";

/**
 * §5.1-5 "Meet our doctors" carousel. Native horizontal scroll-snap list
 * (swipe on touch, keyboard-scrollable), with prev/next buttons on desktop.
 * No carousel library needed; works without JavaScript.
 */
export function DoctorCarousel() {
  const t = useT();
  const track = useRef<HTMLUListElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step * 2, behavior: reduce ? "auto" : "smooth" });
  };

  const btn =
    "inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-maroon-700 bg-white text-maroon-700 hover:bg-maroon-50";

  return (
    <div>
      <div className="mb-4 hidden justify-end gap-2 md:flex">
        <button type="button" className={btn} onClick={() => scroll(-1)} aria-controls="doctor-track">
          <ChevronLeft className="h-6 w-6" aria-hidden />
          <span className="sr-only">{t("a11y.previous")}</span>
        </button>
        <button type="button" className={btn} onClick={() => scroll(1)} aria-controls="doctor-track">
          <ChevronRight className="h-6 w-6" aria-hidden />
          <span className="sr-only">{t("a11y.next")}</span>
        </button>
      </div>
      <ul
        id="doctor-track"
        ref={track}
        tabIndex={0}
        aria-label={t("home.doctorsTitle")}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-6 pt-1 [scrollbar-width:thin] md:mx-0 md:gap-6 md:px-0"
      >
        {doctors.map((d) => (
          <li key={d.slug} className="w-[72%] shrink-0 snap-start sm:w-[45%] md:w-[30%] lg:w-[23%]">
            <DoctorCard doctor={d} />
          </li>
        ))}
      </ul>
    </div>
  );
}
