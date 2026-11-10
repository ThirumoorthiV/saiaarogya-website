import { siteSettings } from "@/content";
import { useT } from "@/i18n/LangContext";
import { cn } from "@/components/ui/cn";

/** Google Maps embed (no API key), lazy-loaded so it never slows the first paint. */
export function MapEmbed({ className }: { className?: string }) {
  const t = useT();
  return (
    <div className={cn("overflow-hidden rounded-card bg-cream-100 shadow-card", className)}>
      <iframe
        src={siteSettings.mapEmbedUrl}
        title={t("a11y.mapTitle")}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-full min-h-[320px] w-full border-0"
        allowFullScreen
      />
    </div>
  );
}
