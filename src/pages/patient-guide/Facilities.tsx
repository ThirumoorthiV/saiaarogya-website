import { gallery } from "@/content";
import { usePick, useT } from "@/i18n/LangContext";
import { GuidePage } from "@/components/guide/GuidePage";
import { Todo } from "@/components/ui/Todo";
import { ButtonLink } from "@/components/ui/Button";

/** Facilities (§5.5). The facilities list must be confirmed by the hospital; real photos are shown meanwhile. */
export function Component() {
  const t = useT();
  const pick = usePick();
  const photos = gallery.filter((g) => g.category === "Hospital").slice(0, 6);
  return (
    <GuidePage path="/patient-guide/facilities/">
      <section aria-labelledby="fac-list" className="space-y-6">
        <h2 id="fac-list" className="h2">
          {t("guide.facilitiesTitle")}
        </h2>
        <Todo id="facilities">
          Confirmed list of facilities — e.g. laboratory, pharmacy, wards, X-ray — with a line about each, and the current bed count.
        </Todo>
        <Todo id="bed-count">Current bed count (the current website says “30-50 bedded facilities”).</Todo>
      </section>
      <section aria-labelledby="fac-photos" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="fac-photos" className="h2">
            {t("guide.photosTitle")}
          </h2>
          <ButtonLink to="/impact/gallery/" variant="ghost">
            {t("actions.viewAll")}
          </ButtonLink>
        </div>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
          {photos.map((p) => (
            <li key={p.image}>
              <figure className="overflow-hidden rounded-card bg-white shadow-card">
                <img src={p.image} alt={pick(p.caption)} width={640} height={480} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <figcaption className="p-3 text-sm text-ink-600">{pick(p.caption)}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>
    </GuidePage>
  );
}
