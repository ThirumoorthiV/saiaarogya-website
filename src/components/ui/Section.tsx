import type { ReactNode } from "react";
import { Container } from "./Container";
import { cn } from "./cn";

type Tone = "plain" | "white" | "tint" | "dark";

const tones: Record<Tone, string> = {
  plain: "bg-ink-50",
  white: "bg-white",
  tint: "bg-maroon-50",
  dark: "bg-maroon-950 text-white",
};

interface SectionProps {
  id?: string;
  tone?: Tone;
  eyebrow?: ReactNode;
  title?: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  as?: "h2" | "h3";
  center?: boolean;
  className?: string;
  children: ReactNode;
}

/** Page section: eyebrow pill + large title + intro, generous vertical rhythm. */
export function Section({ id, tone = "plain", eyebrow, title, intro, action, as: H = "h2", center, className, children }: SectionProps) {
  const headingId = id && title ? `${id}-title` : undefined;
  const dark = tone === "dark";
  return (
    <section id={id} aria-labelledby={headingId} className={cn("py-16 md:py-24", tones[tone], className)}>
      <Container>
        {(eyebrow || title || intro || action) && (
          <div className={cn("mb-10 flex flex-col gap-5 md:mb-14", center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between")}>
            <div className={cn("max-w-2xl", center && "mx-auto")}>
              {eyebrow && <p className={cn("eyebrow", dark && "bg-white/10 text-maroon-100")}>{eyebrow}</p>}
              {title && (
                <H id={headingId} className={cn("text-h2", eyebrow ? "mt-4" : undefined, dark && "text-white")}>
                  {title}
                </H>
              )}
              {intro && <div className={cn("mt-4 text-lg", dark ? "text-maroon-100" : "text-ink-600")}>{intro}</div>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
