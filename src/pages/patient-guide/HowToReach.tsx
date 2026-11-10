import { Bus, Landmark, Route } from "lucide-react";
import { GuideShell } from "@/components/guide/GuideShell";
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
    <GuideShell path="/patient-guide/how-to-reach/">
      <VisitUs showDirectionsTodo={false} />
      <section aria-labelledby="reach-directions">
        <h2 id="reach-directions" className="text-h2 mb-8">
          Directions
        </h2>
        <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
          {items.map((i) => (
            <li key={i.title} className="surface p-6 md:p-7">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700">
                <i.icon className="h-6 w-6" aria-hidden strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 font-heading text-xl font-bold text-ink-900">{i.title}</h3>
              <div className="mt-3">
                <Todo id="directions">{i.todo}</Todo>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </GuideShell>
  );
}
