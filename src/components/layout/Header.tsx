import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, HeartHandshake, Menu, Phone, X } from "lucide-react";
import { tel } from "@/content";
import { MAIN_NAV, isActiveSection } from "@/lib/navigation";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";
import { cn } from "@/components/ui/cn";
import { Logo } from "./Logo";
import { NavDropdown } from "./NavDropdown";

/** Sticky maroon header with dropdown navigation (desktop) and an accordion menu (mobile). The phone number lives in the top bar only. */
export function Header() {
  const { pathname } = useLocation();
  // The menu remembers the page it was opened on, so it closes after navigating.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const first = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenedOn(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={cn("sticky top-0 z-40 border-b border-maroon-800 bg-maroon-700 text-white transition-shadow", scrolled && "shadow-[0_10px_30px_-12px_rgba(46,4,4,.55)]")}>
      <Container className="on-dark flex min-h-[72px] items-center justify-between gap-4">
        <Logo onDark />

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {MAIN_NAV.map((item) =>
              item.children ? (
                <li key={item.label}>
                  <NavDropdown item={item} />
                </li>
              ) : (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-2.5 text-[15px] font-medium no-underline transition-colors",
                        isActive ? "bg-yellow-400 font-semibold text-maroon-900 shadow-sm" : "text-maroon-50 hover:bg-white/10 hover:text-white",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <ButtonLink to="/support-us/donate/" variant="accent" icon={<HeartHandshake className="h-[18px] w-[18px]" aria-hidden />} track="donate-header">
            Donate
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white hover:bg-white/10 xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpenedOn(open ? null : pathname)}
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </Container>

      <div id="mobile-menu" hidden={!open} className="border-t border-maroon-800 bg-white text-ink-900 xl:hidden">
        <Container className="max-h-[calc(100dvh-112px)] overflow-y-auto pb-32 pt-3">
          <nav aria-label="Main">
            <ul className="space-y-1">
              {MAIN_NAV.map((item) =>
                item.children ? (
                  <li key={item.label}>
                    <details className="group" open={isActiveSection(pathname, item.to) && item.to !== "/"}>
                      <summary
                        className={cn(
                          "flex min-h-12 cursor-pointer list-none items-center justify-between rounded-2xl px-4 text-lg font-semibold transition-colors hover:bg-maroon-50 group-open:bg-maroon-50",
                          isActiveSection(pathname, item.to) ? "text-maroon-700" : "text-ink-900",
                        )}
                      >
                        {item.label}
                        <ChevronDown className="h-5 w-5 text-maroon-700 transition-transform group-open:rotate-180" aria-hidden />
                      </summary>
                      <ul className="mt-1 space-y-0.5 pb-2 pl-2">
                        {item.children.map((l) => (
                          <li key={l.to}>
                            <Link
                              to={l.to}
                              aria-current={pathname === l.to ? "page" : undefined}
                              className={cn(
                                "flex min-h-11 items-center gap-3 rounded-xl px-3 text-base no-underline transition-colors hover:bg-maroon-100",
                                pathname === l.to ? "bg-maroon-100 font-semibold text-maroon-900" : "text-ink-700",
                              )}
                            >
                              {l.deptIcon ? (
                                <DepartmentIcon name={l.deptIcon} className="h-[18px] w-[18px] text-maroon-700" />
                              ) : l.icon ? (
                                <l.icon className="h-[18px] w-[18px] text-maroon-700" aria-hidden />
                              ) : null}
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ) : (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        cn("flex min-h-12 items-center rounded-2xl px-4 text-lg font-semibold no-underline transition-colors hover:bg-maroon-50", isActive ? "text-maroon-700" : "text-ink-900")
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ButtonLink to={tel} variant="outline" icon={<Phone className="h-[18px] w-[18px]" aria-hidden />} track="call-menu">
              Call
            </ButtonLink>
            <ButtonLink to="/support-us/donate/" icon={<HeartHandshake className="h-[18px] w-[18px]" aria-hidden />} track="donate-menu">
              Donate
            </ButtonLink>
          </div>
        </Container>
      </div>
    </header>
  );
}
