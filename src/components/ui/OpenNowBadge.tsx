import { useEffect, useState } from "react";
import { siteSettings } from "@/content";
import { isOpenNow } from "@/lib/opdStatus";
import { cn } from "./cn";

/**
 * "Open now / Closed now" from SiteSettings.opdHours (IST). Browser-only
 * (pre-rendered HTML can't know the time). Hidden while hours are unconfirmed.
 */
export function OpenNowBadge({ onDark = false }: { onDark?: boolean }) {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const update = () => setOpen(isOpenNow(siteSettings.opdHours));
    const first = window.setTimeout(update, 0);
    const id = window.setInterval(update, 60_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  if (open === null) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        onDark ? "bg-white text-ink-900" : open ? "bg-success-50 text-success-700" : "bg-alert-50 text-alert-700",
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", open ? "bg-success-700" : "bg-alert-700")} aria-hidden />
      {open ? "Open now" : "Closed now"}
    </span>
  );
}
