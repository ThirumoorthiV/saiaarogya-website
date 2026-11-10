import { Link, useLocation } from "react-router-dom";
import { useLang, useT } from "@/i18n/LangContext";
import { switchLanguagePath } from "@/lib/nav";
import { cn } from "@/components/ui/cn";

/** EN | తెలుగు toggle (§4.2, §5.9) — links to the same page in the other language. */
export function LanguageToggle({ className }: { className?: string }) {
  const lang = useLang();
  const t = useT();
  const { pathname } = useLocation();
  const item = (code: "en" | "te", label: string, labelLang: string) => (
    <Link
      to={switchLanguagePath(pathname, code)}
      lang={labelLang}
      hrefLang={labelLang}
      aria-current={lang === code ? "true" : undefined}
      className={cn(
        "inline-flex min-h-10 min-w-10 items-center justify-center rounded-md px-2.5 text-sm font-semibold no-underline",
        lang === code ? "bg-maroon-700 text-white" : "text-maroon-700 hover:bg-maroon-50",
      )}
    >
      {label}
    </Link>
  );
  return (
    <div role="group" aria-label={t("a11y.language")} className={cn("inline-flex items-center gap-1 rounded-lg border border-maroon-700/20 p-0.5", className)}>
      {item("en", "EN", "en")}
      {item("te", "తెలుగు", "te")}
    </div>
  );
}
