import { LLink } from "@/components/ui/LLink";
import { cn } from "@/components/ui/cn";

/** Logo mark (from the official logo) with the hospital name set as text. */
export function Logo({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  return (
    <LLink to="/" className={cn("flex items-center gap-3 no-underline", className)} aria-label="Sai Aarogya Hospital, Bapatla — home">
      <img src="/images/logo-mark.webp" alt="" width={44} height={44} className="h-11 w-11" />
      <span className="flex flex-col leading-tight">
        <span className={cn("whitespace-nowrap font-heading text-lg font-semibold 2xl:text-xl", onDark ? "text-white" : "text-maroon-700")}>
          Sai Aarogya Hospital
        </span>
        <span className={cn("text-xs font-medium uppercase tracking-wider", onDark ? "text-white/85" : "text-ink-600")}>
          Bapatla
        </span>
      </span>
    </LLink>
  );
}
