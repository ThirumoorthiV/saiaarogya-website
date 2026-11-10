import { siteSettings } from "@/content";
import { cn } from "@/components/ui/cn";

/** Google Maps embed (no API key), lazy-loaded so it never slows first paint. */
export function MapEmbed({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-3xl border border-ink-200 bg-maroon-50", className)}>
      <iframe
        src={siteSettings.mapEmbedUrl}
        title="Map showing the location of Sai Aarogya Hospital, Khajipalem, Bapatla"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-full min-h-[320px] w-full border-0"
        allowFullScreen
      />
    </div>
  );
}
