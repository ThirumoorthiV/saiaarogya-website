import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cookie } from "lucide-react";

/**
 * Analytics (§8): page views + Call / Directions / Form-submit events, with a
 * cookie notice (§5.9). Nothing loads unless VITE_GA_ID is set (TODO
 * analytics-id) AND the visitor accepts. Elements with `data-track` report
 * clicks; forms call trackEvent().
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = (import.meta.env.VITE_GA_ID as string | undefined) || "";
const KEY = "sa-analytics-consent";
type Consent = "granted" | "denied" | null;

function readConsent(): Consent {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
function writeConsent(v: "granted" | "denied") {
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* storage unavailable — choice applies to this page view only */
  }
  listeners.forEach((l) => l());
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window !== "undefined" && window.gtag) window.gtag("event", name, params);
}

function loadGtag() {
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
}

export function Analytics() {
  const { pathname } = useLocation();
  // "pending" while pre-rendering / hydrating, then the stored choice (null = not chosen yet)
  const consent = useSyncExternalStore<Consent | "pending">(subscribe, readConsent, () => "pending");
  const [dismissed, setDismissed] = useState(false);
  const enabled = Boolean(GA_ID) && consent === "granted";

  useEffect(() => {
    if (enabled) loadGtag();
  }, [enabled]);
  useEffect(() => {
    if (enabled) trackEvent("page_view", { page_path: pathname, page_location: window.location.href });
  }, [pathname, enabled]);
  useEffect(() => {
    if (!enabled) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const id = el.dataset.track ?? "";
      trackEvent(id.startsWith("call") ? "call_click" : id.startsWith("directions") ? "directions_click" : "cta_click", { id, page_path: window.location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [enabled]);

  const choose = useCallback((v: "granted" | "denied") => {
    writeConsent(v);
    setDismissed(true);
  }, []);

  if (!GA_ID || consent !== null || dismissed) return null;
  return (
    <div role="dialog" aria-live="polite" aria-label="Cookie notice" className="fixed inset-x-3 bottom-[96px] z-50 mx-auto max-w-xl rounded-3xl border border-ink-200 bg-white p-5 shadow-menu md:bottom-5">
      <p className="flex gap-3 text-sm text-ink-900">
        <Cookie className="h-5 w-5 shrink-0 text-maroon-700" aria-hidden />
        <span>
          We use cookies to understand how visitors use this website, so we can improve it. No medical information is collected.{" "}
          <Link to="/policies/privacy/">Privacy Policy</Link>
        </span>
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={() => choose("denied")} className="min-h-11 rounded-full px-4 text-sm font-semibold text-maroon-700 hover:bg-maroon-50">
          No thanks
        </button>
        <button type="button" onClick={() => choose("granted")} className="min-h-11 rounded-full bg-maroon-700 px-5 text-sm font-semibold text-white hover:bg-maroon-800">
          Accept
        </button>
      </div>
    </div>
  );
}
