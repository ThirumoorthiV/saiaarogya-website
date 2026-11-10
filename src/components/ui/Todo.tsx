import type { ReactNode } from "react";
import { CircleDashed } from "lucide-react";
import { cn } from "./cn";

/**
 * Visible placeholder for content not yet confirmed by the hospital.
 * Every <Todo> id is listed in docs/CONTENT_TODO.md (`npm run todo:scan` checks this).
 */
export function Todo({ id, children, inline = false, onDark = false, className }: { id: string; children: ReactNode; inline?: boolean; onDark?: boolean; className?: string }) {
  const Tag = inline ? "span" : "div";
  return (
    <Tag
      data-todo={id}
      className={cn(
        "border border-dashed text-sm",
        onDark ? "border-maroon-200/60 bg-white/10 text-white" : "border-maroon-300 bg-maroon-50 text-maroon-900",
        inline ? "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 align-middle" : "flex items-start gap-2.5 rounded-2xl px-4 py-3",
        className,
      )}
    >
      <CircleDashed className={cn("shrink-0", onDark ? "text-maroon-200" : "text-maroon-600", inline ? "h-3.5 w-3.5" : "mt-0.5 h-4 w-4")} aria-hidden />
      <span>
        <strong className="font-semibold">TODO:</strong> {children}
      </span>
    </Tag>
  );
}
