import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

/** Accessible accordion built on <details>/<summary> — works without JavaScript. */
export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="divide-y divide-maroon-700/10 overflow-hidden rounded-card bg-white shadow-card">
      {items.map((item) => (
        <details key={item.id} id={item.id} className="group scroll-mt-24">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-heading text-lg font-medium text-maroon-700 hover:bg-maroon-50 md:px-6">
            <span>{item.title}</span>
            <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180" aria-hidden />
          </summary>
          <div className="px-5 pb-5 text-ink-900 md:px-6">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
