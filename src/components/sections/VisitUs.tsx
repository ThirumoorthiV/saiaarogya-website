import { MapPin, Navigation, Phone } from "lucide-react";
import { siteSettings, tel } from "@/content";
import { ButtonLink } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";
import { ContactDetails } from "./ContactDetails";
import { MapEmbed } from "./MapEmbed";

/** §5.1-9 Visit us — the same SiteSettings data as Contact and How to Reach (single source). */
export function VisitUs({ showDirectionsTodo = true }: { showDirectionsTodo?: boolean }) {
  return (
    <div className="surface grid overflow-hidden lg:grid-cols-[1fr_1.25fr]">
      <div className="flex flex-col gap-7 p-6 md:p-10">
        <ContactDetails showEmergency={false} />
        {showDirectionsTodo && <Todo id="directions">Landmarks, nearest bus stop and the road route from Bapatla town (bus / auto directions).</Todo>}
        <div className="mt-auto flex flex-col gap-3 sm:flex-row">
          <ButtonLink to={siteSettings.mapUrl} newTab icon={<Navigation className="h-[18px] w-[18px]" aria-hidden />} track="directions-visit">
            Get directions
          </ButtonLink>
          <ButtonLink to={tel} variant="outline" icon={<Phone className="h-[18px] w-[18px]" aria-hidden />} track="call-visit">
            Call us
          </ButtonLink>
        </div>
      </div>
      <div className="relative min-h-[340px] p-3 lg:pl-0">
        <MapEmbed className="h-full" />
        <a
          href={siteSettings.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-6 left-6 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-maroon-800 no-underline shadow-soft hover:bg-maroon-50 lg:left-3"
          data-track="directions-map-link"
        >
          <MapPin className="h-4 w-4" aria-hidden />
          Open in Google Maps
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
