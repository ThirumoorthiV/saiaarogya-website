import type { ReactNode, SyntheticEvent } from "react";
import { Plus } from "lucide-react";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

/** Opening one item closes the others in the same accordion. */
const closeSiblings = (e: SyntheticEvent<HTMLDetailsElement>) => {
  const opened = e.currentTarget;
  if (!opened.open) return;
  opened.parentElement?.querySelectorAll<HTMLDetailsElement>(":scope > details[open]").forEach((d) => {
    if (d !== opened) d.open = false;
  });
};

/**
 * Accessible accordion on <details>/<summary>. Only one item is open at a time
 * (without JavaScript, items still open — independently). Hover uses a light maroon tint.
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.id} id={item.id} onToggle={closeSiblings} className="group surface overflow-hidden open:border-maroon-200">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-heading text-[17px] font-semibold text-ink-900 transition-colors hover:bg-maroon-50 md:px-6">
            <span>{item.title}</span>
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon-100 text-maroon-800 transition-transform duration-200 group-open:rotate-45">
              <Plus className="h-5 w-5" aria-hidden />
            </span>
          </summary>
          <div className="px-5 pb-5 text-ink-700 md:px-6">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
