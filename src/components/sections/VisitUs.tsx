import { MapPin, Navigation, Phone } from "lucide-react";
import { siteSettings } from "@/content";
import { useT } from "@/i18n/LangContext";
import { ButtonLink } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";
import { ContactDetails } from "./ContactDetails";
import { MapEmbed } from "./MapEmbed";

/**
 * §5.1-9 Visit us — map, address, timings, directions. Uses the same
 * SiteSettings data as Contact and How to Reach (single source of truth).
 */
export function VisitUs({ showDirectionsTodo = true }: { showDirectionsTodo?: boolean }) {
  const t = useT();
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
      <div className="flex flex-col gap-6">
        <ContactDetails showEmergency={false} />
        {showDirectionsTodo && (
          <Todo id="directions">Landmarks, nearest bus stop and the road route from Bapatla town (bus / auto directions).</Todo>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink to={siteSettings.mapUrl} newTab icon={<Navigation className="h-5 w-5" aria-hidden />} track="directions-visit">
            {t("actions.getDirections")}
          </ButtonLink>
          <ButtonLink to={`tel:${siteSettings.phone}`} variant="secondary" icon={<Phone className="h-5 w-5" aria-hidden />} track="call-visit">
            {t("actions.callUs")}
          </ButtonLink>
        </div>
      </div>
      <div className="flex min-h-[320px] flex-col gap-2">
        <MapEmbed className="flex-1" />
        <a href={siteSettings.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 self-start text-sm font-semibold" data-track="directions-map-link">
          <MapPin className="h-4 w-4" aria-hidden />
          {t("actions.openInMaps")}
          <span className="sr-only">{t("a11y.opensNewTab")}</span>
        </a>
      </div>
    </div>
  );
}
