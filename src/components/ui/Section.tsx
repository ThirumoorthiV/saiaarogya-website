import type { ReactNode } from "react";
import { Container } from "./Container";
import { cn } from "./cn";

type Tone = "white" | "cream" | "maroon";

const tones: Record<Tone, string> = {
  white: "bg-white",
  cream: "bg-cream-100",
  maroon: "bg-maroon-700 text-white",
};

interface SectionProps {
  id?: string;
  tone?: Tone;
  title?: ReactNode;
  intro?: ReactNode;
  /** Heading level for the section title (default h2) */
  as?: "h2" | "h3";
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Page section with §6.4 vertical rhythm (96px desktop / 56px mobile). */
export function Section({ id, tone = "white", title, intro, as: H = "h2", action, children, className }: SectionProps) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={title && headingId ? headingId : undefined}
      className={cn("scroll-mt-24 py-section-sm md:py-section", tones[tone], className)}
    >
      <Container>
        {(title || intro || action) && (
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-prose">
              {title && (
                <H id={headingId} className={cn("h2", tone === "maroon" && "text-white")}>
                  {title}
                </H>
              )}
              {intro && <p className={cn("mt-3", tone === "maroon" ? "text-white/90" : "text-ink-600")}>{intro}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
