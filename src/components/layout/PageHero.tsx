import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/components/ui/cn";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

interface PageHeroProps {
  title: ReactNode;
  intro?: ReactNode;
  eyebrow?: ReactNode;
  crumbs: Crumb[];
  /** Page path (for breadcrumb schema) */
  path: string;
  actions?: ReactNode;
  image?: { src: string; alt: string; width: number; height: number };
  /** Rendered beside the text instead of an image (e.g. an icon tile) */
  aside?: ReactNode;
  children?: ReactNode;
}

/** Inner-page hero: soft maroon-tinted backdrop, breadcrumbs, the page's single H1, intro. */
export function PageHero({ title, intro, eyebrow, crumbs, path, actions, image, aside, children }: PageHeroProps) {
  const split = Boolean(image || aside);
  return (
    <div className="relative overflow-hidden border-b border-ink-200/70 bg-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_0%,#F6E4E4_0%,transparent_60%),radial-gradient(40%_60%_at_0%_100%,#FBF4F4_0%,transparent_70%)]" />
      <Container className={cn("relative py-10 md:py-16", split && "grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14")}>
        <div>
          <Breadcrumbs items={crumbs} currentPath={path} />
          {eyebrow && <div className="mt-8">{eyebrow}</div>}
          <h1 className={cn("text-h1 max-w-[20ch]", eyebrow ? "mt-4" : "mt-8")}>{title}</h1>
          {intro && <div className="mt-5 max-w-prose text-lg text-ink-600 md:text-xl md:leading-relaxed">{intro}</div>}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
          {children}
        </div>
        {image && (
          <div className="relative">
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              fetchPriority="high"
              className="aspect-[4/3] w-full rounded-4xl object-cover shadow-lift"
            />
          </div>
        )}
        {aside}
      </Container>
    </div>
  );
}
