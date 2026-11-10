import { gallery } from "@/content";
import { GuideShell } from "@/components/guide/GuideShell";
import { Todo } from "@/components/ui/Todo";
import { ButtonLink } from "@/components/ui/Button";

/** Facilities (§5.5). The list must be confirmed by the hospital; real photos are shown meanwhile. */
export function Component() {
  const photos = gallery.filter((g) => g.category === "Hospital").slice(0, 6);
  return (
    <GuideShell path="/patient-guide/facilities/">
      <section aria-labelledby="fac-list" className="space-y-4">
        <h2 id="fac-list" className="text-h2">
          Facilities
        </h2>
        <Todo id="facilities">Confirmed list of facilities — e.g. laboratory, pharmacy, wards, X-ray — with a line about each.</Todo>
        <Todo id="bed-count">Current bed count (the current website says “30-50 bedded facilities”).</Todo>
      </section>
      <section aria-labelledby="fac-photos">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 id="fac-photos" className="text-h2">
            Inside the hospital
          </h2>
          <ButtonLink to="/impact/gallery/" variant="ghost">
            Full gallery
          </ButtonLink>
        </div>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {photos.map((p) => (
            <li key={p.image}>
              <figure className="surface overflow-hidden p-2">
                <img src={p.image} alt={p.caption} width={640} height={480} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
                <figcaption className="px-2 pb-1 pt-3 text-sm text-ink-600">{p.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>
    </GuideShell>
  );
}
