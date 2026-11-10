import { ViteReactSSG } from "vite-react-ssg";
import "@/styles/index.css";
import { routes } from "./routes";

/**
 * Entry point. vite-react-ssg pre-renders every route listed in
 * src/lib/staticPaths.ts to static HTML at build time (§7.5), then
 * hydrates in the browser.
 */
export const createRoot = ViteReactSSG({ routes });
