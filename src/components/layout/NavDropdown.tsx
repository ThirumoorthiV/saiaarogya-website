import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { NavItem } from "@/lib/navigation";
import { isActiveSection } from "@/lib/navigation";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";
import { cn } from "@/components/ui/cn";

/**
 * Desktop dropdown menu (disclosure pattern).
 * Opens on hover (with a short close delay), click, or ↓ / Enter / Space.
 * Esc closes and returns focus to the trigger; ↑/↓ move between links.
 * Hover and focus states use a light maroon tint (maroon-100) — no orange.
 */
export function NavDropdown({ item }: { item: NavItem }) {
  const { pathname } = useLocation();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number>(0);
  const active = isActiveSection(pathname, item.to);

  // Close on route change (pathname dependency) and when focus/click leaves the menu
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const links = () => [...(root.current?.querySelectorAll<HTMLAnchorElement>("[data-menu-link]") ?? [])];
  const focusLink = (i: number) => {
    const l = links();
    l[(i + l.length) % l.length]?.focus();
  };

  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusLink(0));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };
  const onPanelKey = (e: KeyboardEvent) => {
    const l = links();
    const i = l.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusLink(i + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (i <= 0) trigger.current?.focus();
      else focusLink(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusLink(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusLink(l.length - 1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    }
  };

  const enter = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  const children = item.children ?? [];
  const [lead, ...rest] = item.wide ? children : [undefined, ...children];

  return (
    <div
      ref={root}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && enter()}
      onPointerLeave={(e) => e.pointerType === "mouse" && leave()}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKey}
        className={cn(
          "inline-flex min-h-11 items-center gap-1 whitespace-nowrap rounded-full px-3.5 text-[15px] font-medium transition-colors",
          open
            ? "bg-maroon-100 text-maroon-900 [&_svg]:!text-maroon-800"
            : active
              ? "bg-yellow-400 font-semibold text-maroon-900 shadow-sm [&_svg]:!text-maroon-900"
              : "text-maroon-50 hover:bg-white/10 hover:text-white",
        )}
      >
        {item.label}
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")} aria-hidden />
        {active && <span className="sr-only">(current section)</span>}
      </button>

      <div id={panelId} hidden={!open} onKeyDown={onPanelKey} className={cn("absolute left-1/2 top-full z-50 pt-3", item.wide ? "w-[640px] -translate-x-[40%]" : "w-[340px] -translate-x-1/2")}>
        <div data-panel className="animate-menu-in overflow-hidden rounded-3xl border border-maroon-100 bg-white p-2 shadow-menu">
          {lead && (
            <Link
              to={lead.to}
              data-menu-link
              className="mb-1 flex items-center justify-between gap-3 rounded-2xl bg-maroon-50 px-4 py-3 no-underline transition-colors hover:bg-maroon-100 focus-visible:bg-maroon-100"
            >
              <span>
                <span className="block font-heading text-[15px] font-semibold text-maroon-900">{lead.label}</span>
                {lead.description && <span className="block text-[13px] text-ink-600">{lead.description}</span>}
              </span>
              <ArrowRight className="h-4 w-4 text-maroon-700" aria-hidden />
            </Link>
          )}
          <ul className={cn(item.wide ? "grid grid-cols-2 gap-0.5" : "space-y-0.5")}>
            {rest.map((l) => {
              const current = pathname === l!.to;
              const Icon = l!.icon;
              return (
                <li key={l!.to}>
                  <Link
                    to={l!.to}
                    data-menu-link
                    aria-current={current ? "page" : undefined}
                    className={cn("flex items-center gap-3 rounded-2xl px-3 py-2.5 no-underline transition-colors", "hover:bg-maroon-100 focus-visible:bg-maroon-100", current && "bg-maroon-50")}
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">
                      {l!.deptIcon ? <DepartmentIcon name={l!.deptIcon} className="h-[18px] w-[18px]" /> : Icon ? <Icon className="h-[18px] w-[18px]" aria-hidden /> : null}
                    </span>
                    <span className="min-w-0">
                      <span className={cn("block text-[15px] font-semibold", current ? "text-maroon-800" : "text-ink-900")}>{l!.label}</span>
                      {l!.description && <span className="block truncate text-[13px] text-ink-600">{l!.description}</span>}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
