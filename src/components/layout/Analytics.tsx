import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Analytics hooks (§8): page views + Call / Directions / Form-submit events.
 *
 * Analytics is OFF until a GA4 measurement ID is set in VITE_GA_ID
 * (TODO: analytics-id — see docs/CONTENT_TODO.md). Any element with a
 * `data-track` attribute reports a click event; forms call trackEvent().
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window !== "undefined" && window.gtag) window.gtag("event", name, params);
}

export function Analytics() {
  const { pathname } = useLocation();

  // Load gtag once, only if configured
  useEffect(() => {
    if (!GA_ID || window.gtag) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: false, anonymize_ip: true });
  }, []);

  useEffect(() => {
    trackEvent("page_view", { page_path: pathname });
  }, [pathname]);

  // Delegated click tracking for [data-track]
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const id = el.dataset.track ?? "";
      const kind = id.startsWith("call") ? "call_click" : id.startsWith("directions") ? "directions_click" : "cta_click";
      trackEvent(kind, { id, page_path: window.location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
