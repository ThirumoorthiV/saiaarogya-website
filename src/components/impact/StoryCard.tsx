import { CalendarDays } from "lucide-react";
import type { Story } from "@/types";
import { usePick } from "@/i18n/LangContext";
import { LLink } from "@/components/ui/LLink";
import { Badge } from "@/components/ui/Badge";

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

/** Story / camp update card used on Impact listings. */
export function StoryCard({ story }: { story: Story }) {
  const pick = usePick();
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card transition-shadow hover:shadow-lg">
      {story.coverImage ? (
        <img src={story.coverImage} alt={story.coverAlt} width={640} height={400} loading="lazy" className="aspect-[16/10] w-full object-cover" />
      ) : (
        <div className="aspect-[16/10] w-full bg-gradient-to-br from-maroon-50 to-cream-100" aria-hidden />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-600">
          <Badge tone="maroon">{story.category === "Patient" ? "Patient story" : story.category === "Camp" ? "Medical camp" : "Update"}</Badge>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-4 w-4" aria-hidden />
            <time dateTime={story.date}>{formatDate(story.date)}</time>
          </span>
        </div>
        <h3 className="mt-3 font-heading text-xl font-medium text-maroon-700">
          <LLink to={`/impact/stories/${story.slug}/`} className="no-underline after:absolute after:inset-0">
            {pick(story.title)}
          </LLink>
        </h3>
        {story.body[0] && <p className="mt-2 line-clamp-3 text-base text-ink-600">{pick(story.body[0])}</p>}
      </div>
    </article>
  );
}
