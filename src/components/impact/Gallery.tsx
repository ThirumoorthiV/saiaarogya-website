import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Expand } from "lucide-react";
import { gallery } from "@/content";
import type { GalleryCategory } from "@/types";
import { usePick } from "@/i18n/LangContext";
import { cn } from "@/components/ui/cn";

const CATEGORIES: GalleryCategory[] = ["Hospital", "Camps", "Events"];

/** Filterable gallery (Hospital · Camps · Events) with an accessible lightbox (§5.6). */
export function Gallery({ limit, showFilters = true }: { limit?: number; showFilters?: boolean }) {
  const pick = usePick();
  const [category, setCategory] = useState<GalleryCategory | "All">("All");
  const [index, setIndex] = useState(-1);

  const items = gallery.filter((g) => category === "All" || g.category === category).slice(0, limit);
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, gallery.filter((g) => g.category === c).length]));

  const chip = (value: GalleryCategory | "All", label: string) => (
    <button
      key={value}
      type="button"
      aria-pressed={category === value}
      onClick={() => setCategory(value)}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold",
        category === value ? "border-maroon-700 bg-maroon-700 text-white" : "border-maroon-700/30 bg-white text-maroon-700 hover:bg-maroon-50",
      )}
    >
      {label}
    </button>
  );

  return (
    <div>
      {showFilters && (
        <div role="group" aria-label="Filter photos by category" className="mb-6 flex flex-wrap gap-2">
          {chip("All", `All (${gallery.length})`)}
          {CATEGORIES.map((c) => chip(c, `${c} (${counts[c]})`))}
        </div>
      )}
      {items.length ? (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {items.map((g, i) => (
            <li key={g.image}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block w-full overflow-hidden rounded-card bg-cream-100 shadow-card"
              >
                <span className="sr-only">View larger: </span>
                <img src={g.image} alt={pick(g.caption)} width={640} height={480} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                <span className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-maroon-700 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Expand className="h-4 w-4" aria-hidden />
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-card bg-cream-100 p-6 text-ink-600">No photos in this category yet.</p>
      )}
      <Lightbox
        open={index >= 0}
        index={Math.max(index, 0)}
        close={() => setIndex(-1)}
        slides={items.map((g) => ({ src: g.image, alt: pick(g.caption) }))}
        styles={{ container: { backgroundColor: "rgba(43,34,32,.95)" } }}
      />
    </div>
  );
}
