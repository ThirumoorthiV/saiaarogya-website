import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { HeartHandshake, Menu, X } from "lucide-react";
import { useLocalizePath, useT } from "@/i18n/LangContext";
import { MAIN_NAV } from "@/lib/nav";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";

/** Sticky header (§5.9): logo, main nav, language toggle, Donate. Hamburger menu on mobile. */
export function Header() {
  const t = useT();
  const lp = useLocalizePath();
  const { pathname } = useLocation();
  // The menu remembers the page it was opened on, so it closes automatically after navigating.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean | ((o: boolean) => boolean)) =>
    setOpenedOn((typeof next === "function" ? next(open) : next) ? pathname : null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenedOn(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative inline-flex min-h-12 items-center whitespace-nowrap px-1 text-[15px] font-medium no-underline transition-colors 2xl:text-base",
      "after:absolute after:inset-x-1 after:bottom-2 after:h-0.5 after:rounded after:bg-saffron-500 after:transition-transform after:duration-200",
      isActive ? "text-maroon-700 after:scale-x-100" : "text-ink-900 after:scale-x-0 hover:text-maroon-700 hover:after:scale-x-100",
    );

  return (
    <header className="sticky top-0 z-40 border-b border-maroon-700/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <Container className="flex min-h-[72px] items-center justify-between gap-4">
        <Logo className="shrink-0" />

        <nav aria-label={t("a11y.mainNav")} className="hidden xl:block">
          <ul className="flex items-center gap-3 2xl:gap-5">
            {MAIN_NAV.map((item) => (
              <li key={item.key}>
                <NavLink to={lp(item.to)} end={item.to === "/"} className={linkClass}>
                  {t(`nav.${item.key}`)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <LanguageToggle />
          <ButtonLink to="/support-us/donate/" icon={<HeartHandshake className="h-5 w-5" aria-hidden />} track="donate-header">
            {t("nav.donate")}
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-btn text-maroon-700 hover:bg-maroon-50 xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-7 w-7" aria-hidden /> : <Menu className="h-7 w-7" aria-hidden />}
          <span className="sr-only">{open ? t("a11y.closeMenu") : t("a11y.openMenu")}</span>
        </button>
      </Container>

      <div id="mobile-menu" hidden={!open} className="border-t border-maroon-700/10 bg-white xl:hidden">
        <Container className="max-h-[calc(100vh-120px)] overflow-y-auto pb-6 pt-2">
          <nav aria-label={t("a11y.mainNav")}>
            <ul className="divide-y divide-maroon-700/10">
              {MAIN_NAV.map((item) => (
                <li key={item.key}>
                  <NavLink
                    to={lp(item.to)}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "flex min-h-12 items-center text-lg font-medium no-underline",
                        isActive ? "text-maroon-700" : "text-ink-900",
                      )
                    }
                  >
                    {t(`nav.${item.key}`)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <LanguageToggle />
            <ButtonLink to="/support-us/donate/" icon={<HeartHandshake className="h-5 w-5" aria-hidden />} className="flex-1" track="donate-menu">
              {t("nav.donate")}
            </ButtonLink>
          </div>
        </Container>
      </div>
    </header>
  );
}
