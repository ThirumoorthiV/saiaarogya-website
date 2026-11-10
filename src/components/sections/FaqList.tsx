import type { Faq } from "@/types";
import { usePick } from "@/i18n/LangContext";
import { Accordion } from "@/components/ui/Accordion";
import { Todo } from "@/components/ui/Todo";

/** FAQ accordion. Unanswered questions show a TODO instead of a made-up answer. */
export function FaqList({ items, idPrefix = "faq" }: { items: Faq[]; idPrefix?: string }) {
  const pick = usePick();
  return (
    <Accordion
      items={items.map((f, i) => ({
        id: `${idPrefix}-${i + 1}`,
        title: pick(f.question),
        content: f.answer ? (
          <p>{pick(f.answer)}</p>
        ) : (
          <Todo id="faq-answer">Answer to be confirmed by the hospital.</Todo>
        ),
      }))}
    />
  );
}
