import { BedDouble, FlaskConical, Pill, Stethoscope, Syringe, Users } from "lucide-react";
import { gallery } from "@/content";
import { GuideShell } from "@/components/guide/GuideShell";
import { ButtonLink } from "@/components/ui/Button";

const FACILITIES = [
  {
    icon: Stethoscope,
    title: "Out-patient department",
    text: "General medicine every day and visiting specialists in 10 departments.",
  },
  {
    icon: BedDouble,
    title: "In-patient wards",
    text: "A 30–50 bedded facility for patients who need to stay for treatment.",
  },
  {
    icon: Pill,
    title: "Pharmacy",
    text: "Medicines prescribed by our doctors, given free of charge.",
  },
  {
    icon: FlaskConical,
    title: "Laboratory",
    text: "Routine blood and urine tests to support diagnosis.",
  },
  {
    icon: Syringe,
    title: "Minor procedures",
    text: "Dressings, injections and minor procedures in the treatment room.",
  },
  {
    icon: Users,
    title: "Waiting area",
    text: "A clean, covered waiting area for patients and attendants.",
  },
];

/** Facilities (§5.5). */
export function Component() {
  const photos = gallery.filter((g) => g.category === "Hospital").slice(0, 6);
  return (
    <GuideShell path="/patient-guide/facilities/">
      <section aria-labelledby="fac-list" className="space-y-6">
        <h2 id="fac-list" className="text-h2">
          Facilities
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {FACILITIES.map((f) => (
            <li key={f.title} className="surface flex h-full gap-4 p-5 md:p-6">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700">
                <f.icon className="h-6 w-6" aria-hidden strokeWidth={1.75} />
              </span>
              <span>
                <span className="block font-heading text-lg font-bold text-ink-900">{f.title}</span>
                <span className="mt-1 block text-[15px] text-ink-600">{f.text}</span>
              </span>
            </li>
          ))}
        </ul>
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
              <figure className="surface h-full overflow-hidden p-2">
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
