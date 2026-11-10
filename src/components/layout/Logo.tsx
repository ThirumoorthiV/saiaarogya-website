import { Link } from "react-router-dom";
import { cn } from "@/components/ui/cn";

/** Original logo mark (unchanged brand asset) with the hospital name as text. */
export function Logo({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("group flex shrink-0 items-center gap-3 no-underline", className)}>
      <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", onDark ? "bg-white" : "bg-white ring-1 ring-ink-200")}>
        <img src="/images/logo-mark.webp" alt="" width={34} height={34} className="h-[34px] w-[34px]" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("whitespace-nowrap font-heading text-[17px] font-bold tracking-tight", onDark ? "text-white" : "text-ink-900")}>
          Sai Aarogya Hospital
        </span>
        <span className={cn("mt-1 text-[11px] font-semibold uppercase tracking-[0.18em]", onDark ? "text-maroon-200" : "text-maroon-700")}>Bapatla</span>
      </span>
    </Link>
  );
}
