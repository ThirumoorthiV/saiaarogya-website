import { Outlet, ScrollRestoration } from "react-router-dom";
import { TopBar } from "./TopBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileActionBar } from "./MobileActionBar";
import { Analytics } from "./Analytics";

export function Layout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-maroon-700 px-5 py-3 font-semibold text-white no-underline focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <TopBar />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <MobileActionBar />
      <Analytics />
      <ScrollRestoration />
    </>
  );
}
