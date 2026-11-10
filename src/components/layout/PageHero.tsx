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
  /** Override the banner photo (name in public/images/banner/); chosen from the path by default */
  banner?: string;
  children?: ReactNode;
}

/** Banner photo per page (exact path first, then section prefix). Files: public/images/banner/<name>(-sm).webp */
const BANNERS: [string, string][] = [
  ["/about/history/", "patient-care"],
  ["/about/governance/", "trust-activities"],
  ["/about/", "hospital-ward"],
  ["/departments/dentistry/", "dental-consultation"],
  ["/departments/general-medicine/", "consultation"],
  ["/departments/", "medical-equipment"],
  ["/doctors/", "consultation"],
  ["/patient-guide/facilities/", "hospital-ward"],
  ["/patient-guide/", "opd-waiting-area"],
  ["/impact/gallery/", "hospital-ward"],
  ["/impact/", "patient-care"],
  ["/support-us/volunteer/", "patient-care"],
  ["/support-us/", "trust-activities"],
  ["/contact/", "opd-waiting-area"],
  ["/policies/", "medical-equipment"],
];
const bannerFor = (path: string) => BANNERS.find(([p]) => path === p || path.startsWith(p))?.[1] ?? "hospital-ward";

/**
 * Standard inner-page banner: a hospital photo under a maroon overlay, with the
 * eyebrow, the page's single H1, intro, breadcrumbs and optional actions, centred.
 * The photo is decorative (alt=""); the overlay keeps white text at AA contrast.
 */
export function PageHero({ title, intro, eyebrow, crumbs, path, actions, banner, children }: PageHeroProps) {
  const bg = `/images/banner/${banner ?? bannerFor(path)}`;
  return (
    <div className="hero-dark on-dark relative isolate overflow-hidden bg-maroon-900">
      <img
        src={`${bg}-sm.webp`}
        srcSet={`${bg}-sm.webp 768w, ${bg}.webp 1600w`}
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
