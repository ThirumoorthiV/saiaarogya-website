import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/components/ui/cn";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

interface PageHeaderProps {
  title: ReactNode;
  intro?: ReactNode;
  crumbs: Crumb[];
  /** English path of this page (for breadcrumb schema) */
  path: string;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  image?: { src: string; alt: string; width: number; height: number };
  children?: ReactNode;
}

/** Inner-page hero: breadcrumbs, the page's single H1, intro and optional image. */
export function PageHeader({ title, intro, crumbs, path, eyebrow, actions, image, children }: PageHeaderProps) {
  return (
    <div className="bg-cream-100">
      <Container className={cn("py-8 md:py-14", image && "grid items-center gap-8 md:grid-cols-2 md:gap-12")}>
        <div>
          <Breadcrumbs items={crumbs} currentPath={path} />
          {eyebrow && <div className="mt-6">{eyebrow}</div>}
          <h1 className={cn("h1 max-w-[22ch]", eyebrow ? "mt-3" : "mt-6")}>{title}</h1>
          {intro && <div className="mt-4 max-w-prose text-lg text-ink-600 md:text-xl">{intro}</div>}
          {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
          {children}
        </div>
        {image && (
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="aspect-[4/3] w-full rounded-card object-cover shadow-card"
            fetchPriority="high"
          />
        )}
      </Container>
    </div>
  );
}
