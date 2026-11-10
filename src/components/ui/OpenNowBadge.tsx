import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { siteSettings } from "@/content";
import { isOpenNow } from "@/lib/opdStatus";
import { useT } from "@/i18n/LangContext";
import { Badge } from "./Badge";

/**
 * "Open now / Closed now" badge from SiteSettings.opdHours (IST).
 * Computed in the browser only (the pre-rendered HTML can't know the time).
 * Renders nothing while OPD hours are unconfirmed.
 */
export function OpenNowBadge({ onDark = false }: { onDark?: boolean }) {
  const t = useT();
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOpen(isOpenNow(siteSettings.opdHours));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (open === null) return null;
  if (onDark) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-ink-900">
        <span className={open ? "h-2 w-2 rounded-full bg-success-700" : "h-2 w-2 rounded-full bg-alert-700"} aria-hidden />
        {open ? t("utility.openNow") : t("utility.closed")}
      </span>
    );
  }
  return (
    <Badge tone={open ? "success" : "alert"} icon={<Clock className="h-4 w-4" aria-hidden />}>
      {open ? t("utility.openNow") : t("utility.closed")}
    </Badge>
  );
}
