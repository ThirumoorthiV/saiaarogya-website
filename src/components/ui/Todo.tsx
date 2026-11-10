import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "./cn";

/**
 * Visible placeholder for content not yet confirmed by the hospital.
 * Every <Todo> id is listed in docs/CONTENT_TODO.md.
 * `npm run todo:scan` lists every id used in the code.
 */
export function Todo({
  id,
  children,
  inline = false,
  className,
}: {
  id: string;
  children: ReactNode;
  inline?: boolean;
  className?: string;
}) {
  const Tag = inline ? "span" : "div";
  return (
    <Tag
      data-todo={id}
      className={cn(
        "border-2 border-dashed border-saffron-700 bg-[#FFF7ED] text-sm text-ink-900",
        inline ? "inline-flex items-center gap-1 rounded-md px-2 py-0.5 align-middle" : "flex items-start gap-2 rounded-btn p-3",
        className,
      )}
    >
      <CircleAlert className={cn("shrink-0 text-saffron-700", inline ? "h-3.5 w-3.5" : "mt-0.5 h-4 w-4")} aria-hidden />
      <span>
        <strong className="font-semibold">TODO:</strong> {children}
      </span>
    </Tag>
  );
}
