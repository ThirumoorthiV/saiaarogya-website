import { Bus, Landmark, Route } from "lucide-react";
import { GuideShell } from "@/components/guide/GuideShell";
import { VisitUs } from "@/components/sections/VisitUs";

/** How to Reach (§5.5): map, landmarks, nearest bus stop, road directions from Bapatla town. */
export function Component() {
  const items = [
    {
      icon: Landmark,
      title: "Landmarks",
      text: "The hospital is on the Sai Swasthya Wellness Centre campus in Khajipalem village, Pittlavanipalem Mandal. Locally it is also known by its earlier name, Aravinda Ashramam.",
    },
    {
      icon: Bus,
      title: "Nearest bus stop",
      text: "Take a bus from Bapatla towards Pittlavanipalem and get down at Khajipalem. Autos are available from the stop to the hospital gate.",
    },
    {
      icon: Route,
      title: "From Bapatla town",
      text: "Khajipalem is a short drive from Bapatla town. Tap “Get directions” for the live road route from where you are, or call us and we will guide you.",
    },
  ];
  return (
    <GuideShell path="/patient-guide/how-to-reach/">
      <VisitUs />
      <section aria-labelledby="reach-directions">
        <h2 id="reach-directions" className="text-h2 mb-8">
          Directions
        </h2>
        <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
          {items.map((i) => (
            <li key={i.title} className="surface h-full p-6 md:p-7">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700">
                <i.icon className="h-6 w-6" aria-hidden strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 font-heading text-xl font-bold text-ink-900">{i.title}</h3>
              <p className="mt-3 text-ink-700">{i.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </GuideShell>
  );
}
