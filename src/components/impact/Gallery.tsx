import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Expand } from "lucide-react";
import { gallery } from "@/content";
import type { GalleryCategory } from "@/types";
import { cn } from "@/components/ui/cn";

const CATEGORIES: GalleryCategory[] = ["Hospital", "Camps", "Events"];

/** Filterable gallery (Hospital · Camps · Events) with an accessible lightbox (§5.6). */
export function Gallery({ limit, showFilters = true }: { limit?: number; showFilters?: boolean }) {
  const [category, setCategory] = useState<GalleryCategory | "All">("All");
  const [index, setIndex] = useState(-1);
  const items = gallery.filter((g) => category === "All" || g.category === category).slice(0, limit);
  const count = (c: GalleryCategory) => gallery.filter((g) => g.category === c).length;

  const chip = (value: GalleryCategory | "All", label: string) => (
    <button
      key={value}
      type="button"
      aria-pressed={category === value}
      onClick={() => setCategory(value)}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-semibold transition-colors",
        category === value ? "bg-maroon-700 text-white" : "border border-ink-200 bg-white text-ink-700 hover:bg-maroon-100 hover:text-maroon-900",
      )}
    >
      {label}
    </button>
  );

  return (
    <div>
      {showFilters && (
        <div role="group" aria-label="Filter photos by category" className="mb-8 flex flex-wrap gap-2">
          {chip("All", `All (${gallery.length})`)}
          {CATEGORIES.map((c) => chip(c, `${c} (${count(c)})`))}
        </div>
      )}
      {items.length ? (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {items.map((g, i) => (
            <li key={g.image} className={cn(i === 0 && !limit && "md:col-span-2 md:row-span-2")}>
              <button type="button" onClick={() => setIndex(i)} className="group relative block h-full w-full overflow-hidden rounded-3xl bg-maroon-50">
                <span className="sr-only">View larger: </span>
                <img
                  src={g.image}
                  alt={g.caption}
                  width={640}
                  height={480}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 && !limit ? "high" : undefined}
                  className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-maroon-950/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                <span aria-hidden className="absolute bottom-3 left-3 right-14 line-clamp-2 text-left text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {g.caption}
                </span>
                <span aria-hidden className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-maroon-700 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Expand className="h-4 w-4" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="surface p-6 text-ink-600">No photos in this category yet.</p>
      )}
      <Lightbox
        open={index >= 0}
        index={Math.max(index, 0)}
        close={() => setIndex(-1)}
        slides={items.map((g) => ({ src: g.image, alt: g.caption }))}
        styles={{ container: { backgroundColor: "rgba(46,4,4,.94)" } }}
      />
    </div>
  );
}
