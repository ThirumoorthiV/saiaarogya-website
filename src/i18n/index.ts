import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import te from "./te.json";

/**
 * UI strings. Telugu (te.json) is empty until translations are supplied
 * (see docs/CONTENT_TODO.md) — missing keys fall back to English.
 *
 * The active language comes from the URL (/te/ prefix), not global state,
 * so pre-rendering many pages in parallel is safe: components call
 * useTranslation(undefined, { lng }) through the useT() hook.
 */
i18next.use(initReactI18next).init({
  resources: { en: { translation: en }, te: { translation: te } },
  lng: "en",
  fallbackLng: "en",
  supportedLngs: ["en", "te"],
  interpolation: { escapeValue: false },
  initAsync: false,
  returnNull: false,
});

export default i18next;
