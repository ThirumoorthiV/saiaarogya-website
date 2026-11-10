/** Main navigation — requirements §4.2. Keys are i18n keys under `nav.` */
export const MAIN_NAV = [
  { key: "home", to: "/" },
  { key: "about", to: "/about/" },
  { key: "departments", to: "/departments/" },
  { key: "doctors", to: "/doctors/" },
  { key: "patientGuide", to: "/patient-guide/" },
  { key: "impact", to: "/impact/" },
  { key: "contact", to: "/contact/" },
] as const;

/** Swap the language prefix of the current URL (EN ⇄ TE). */
export function switchLanguagePath(pathname: string, target: "en" | "te") {
  const en = pathname === "/te" || pathname === "/te/" ? "/" : pathname.replace(/^\/te(?=\/)/, "");
  return target === "en" ? en : en === "/" ? "/te/" : `/te${en}`;
}
