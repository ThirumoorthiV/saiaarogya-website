import { Outlet, ScrollRestoration } from "react-router-dom";
import { Languages } from "lucide-react";
import { LangContext, useT } from "@/i18n/LangContext";
import { Container } from "@/components/ui/Container";
import type { Lang } from "@/types";
import { UtilityBar } from "./UtilityBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileActionBar } from "./MobileActionBar";
import { Analytics } from "./Analytics";

function SkipLink() {
  const t = useT();
  return (
    <a
      href="#main"
      className="sr-only z-50 rounded-btn bg-saffron-700 px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {t("a11y.skipToContent")}
    </a>
  );
}

/** TODO(telugu): shown on /te/ pages until translations are supplied. */
function TeluguNotice() {
  const t = useT();
  return (
    <div data-todo="telugu-translation" className="border-b border-saffron-700/30 bg-[#FFF7ED] text-sm text-ink-900">
      <Container className="flex items-center gap-2 py-2">
        <Languages className="h-4 w-4 shrink-0 text-saffron-700" aria-hidden />
        <span>
          <strong>TODO:</strong> {t("common.teluguNotice")}
        </span>
      </Container>
    </div>
  );
}

export function Layout({ lang }: { lang: Lang }) {
  return (
    <LangContext.Provider value={lang}>
      <SkipLink />
      <UtilityBar />
      <Header />
      {lang === "te" && <TeluguNotice />}
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <MobileActionBar />
      <Analytics />
      <ScrollRestoration />
    </LangContext.Provider>
  );
}
