import { Bus, Landmark, Route } from "lucide-react";
import { GuidePage } from "@/components/guide/GuidePage";
import { VisitUs } from "@/components/sections/VisitUs";
import { Todo } from "@/components/ui/Todo";

/** How to Reach (§5.5): map, landmarks, nearest bus stop, road directions from Bapatla town. */
export function Component() {
  const items = [
    { icon: Landmark, title: "Landmarks", todo: "Nearby landmarks to help people find the hospital." },
    { icon: Bus, title: "Nearest bus stop", todo: "Nearest bus stop and how far it is from the hospital (auto / walk)." },
    { icon: Route, title: "From Bapatla town", todo: "Road route and approximate distance from Bapatla town." },
  ];
  return (
    <GuidePage path="/patient-guide/how-to-reach/">
      <VisitUs showDirectionsTodo={false} />
      <section aria-labelledby="reach-directions">
        <h2 id="reach-directions" className="h2 mb-6">
          Directions
        </h2>
        <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
          {items.map((i) => (
            <li key={i.title} className="rounded-card bg-white p-6 shadow-card">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">
                <i.icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-4 font-heading text-xl font-medium text-maroon-700">{i.title}</h3>
              <div className="mt-3">
                <Todo id="directions">{i.todo}</Todo>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </GuidePage>
  );
}
