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

/** Inner-page hero: light maroon banner (maroon-100, the menu hover colour) with soft rings, breadcrumbs, the page's single H1, intro. */
export function PageHero({ title, intro, eyebrow, crumbs, path, actions, image, aside, children }: PageHeroProps) {
  const split = Boolean(image || aside);
  return (
    <div className="hero-tint relative overflow-hidden border-b border-maroon-200 bg-maroon-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_90%_at_100%_0%,#EDCACA_0%,transparent_65%),radial-gradient(50%_70%_at_0%_100%,#FBF4F4_0%,transparent_70%)]"
      />
      <Container className={cn("relative py-10 md:py-16", split && "grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14")}>
        <div>
          <Breadcrumbs items={crumbs} currentPath={path} />
          {eyebrow && <div className="mt-8">{eyebrow}</div>}
          <h1 className={cn("text-h1 max-w-[20ch]", eyebrow ? "mt-4" : "mt-8")}>{title}</h1>
          {intro && <div className="mt-5 max-w-prose text-lg text-ink-700 md:text-xl md:leading-relaxed">{intro}</div>}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
          {children}
        </div>
        {image && (
          <div className="relative">
            <img src={image.src} alt={image.alt} width={image.width} height={image.height} fetchPriority="high" className="aspect-[4/3] w-full rounded-4xl object-cover shadow-lift" />
          </div>
        )}
        {aside}
      </Container>
    </div>
  );
}
