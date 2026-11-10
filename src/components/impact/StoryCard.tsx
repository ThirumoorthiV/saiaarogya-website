import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import type { Story } from "@/types";
import { Badge } from "@/components/ui/Badge";

export const formatDate = (iso: string) => new Date(`${iso}T00:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

/** Story / camp update card. Whole card is clickable. */
export function StoryCard({ story }: { story: Story }) {
  return (
    <article className="group surface surface-hover relative flex h-full flex-col overflow-hidden p-2">
      {story.coverImage ? (
        <img src={story.coverImage} alt={story.coverAlt} width={640} height={400} loading="lazy" className="aspect-[16/10] w-full rounded-2xl object-cover" />
      ) : (
        <div className="aspect-[16/10] w-full rounded-2xl bg-gradient-to-br from-maroon-50 to-maroon-100" aria-hidden />
      )}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-600">
          <Badge tone="maroon">{story.category === "Patient" ? "Patient story" : story.category === "Camp" ? "Medical camp" : "Update"}</Badge>
          {story.isDemo && <Badge tone="neutral">Demo story</Badge>}
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-4 w-4" aria-hidden />
            <time dateTime={story.date}>{formatDate(story.date)}</time>
          </span>
        </div>
        <h3 className="mt-3 font-heading text-lg font-bold text-ink-900">
          <Link to={`/impact/stories/${story.slug}/`} className="text-ink-900 no-underline after:absolute after:inset-0 group-hover:text-maroon-800">
            {story.title}
          </Link>
        </h3>
        {story.body[0] && <p className="mt-2 line-clamp-3 text-[15px] text-ink-600">{story.body[0]}</p>}
      </div>
    </article>
  );
}
