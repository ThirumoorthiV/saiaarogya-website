import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

interface PageHeroProps {
  title: ReactNode;
  intro?: ReactNode;
  eyebrow?: ReactNode;
  crumbs: Crumb[];
  /** Page path (for breadcrumb schema) */
  path: string;
  actions?: ReactNode;
  /** Background photo for the banner (defaults to the hospital ward) */
  image?: { src: string; alt: string; width: number; height: number };
  children?: ReactNode;
}

const DEFAULT_BG = { src: "/images/hospital-ward-sm.webp", srcSet: "/images/hospital-ward-sm.webp 800w, /images/hospital-ward.webp 1600w" };

/**
 * Standard inner-page banner: a hospital photo under a maroon overlay, with the
 * eyebrow, the page's single H1, intro, breadcrumbs and optional actions, centred.
 * The photo is decorative (alt=""); the overlay keeps white text at AA contrast.
 */
export function PageHero({ title, intro, eyebrow, crumbs, path, actions, image, children }: PageHeroProps) {
  return (
    <div className="hero-dark on-dark relative isolate overflow-hidden bg-maroon-900">
      <img
        src={image?.src ?? DEFAULT_BG.src}
        srcSet={image ? undefined : DEFAULT_BG.srcSet}
        sizes="100vw"
        alt=""
        width={1600}
        height={600}
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-maroon-950/85 via-maroon-900/85 to-maroon-950/90" />
      <Container className="flex flex-col items-center py-14 text-center md:py-20">
        {eyebrow && <div>{eyebrow}</div>}
        <h1 className="text-h1 mt-4 max-w-[22ch] text-white">{title}</h1>
        {intro && <div className="hero-intro mx-auto mt-4 max-w-2xl text-base text-maroon-50 md:text-lg md:leading-relaxed">{intro}</div>}
        {actions && <div className="mt-7 flex flex-wrap justify-center gap-3">{actions}</div>}
        {children}
        <div className="mt-8">
          <Breadcrumbs items={crumbs} currentPath={path} onDark />
        </div>
      </Container>
    </div>
  );
}
