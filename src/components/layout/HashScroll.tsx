import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to `#section` after in-site navigation (e.g. "Donate now" → /support-us/donate/#donate-form,
 * "Our network" → /about/#network). React Router doesn't do this by itself, and pages are lazy-loaded,
 * so we retry briefly until the target element exists.
 */
export function HashScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let timer = 0;
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: "start" });
      else if (tries++ < 20) timer = window.setTimeout(attempt, 50);
    };
    timer = window.setTimeout(attempt, 0);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);
  return null;
}
