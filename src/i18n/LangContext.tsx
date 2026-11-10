import { createContext, useContext } from "react";
import { useTranslation } from "react-i18next";
import type { Lang, LocalizedText } from "@/types";

export const LangContext = createContext<Lang>("en");

export const useLang = () => useContext(LangContext);

/** Translation function fixed to the language of the current URL. */
export function useT() {
  const lng = useLang();
  return useTranslation(undefined, { lng }).t;
}

/** Prefix an English path with /te when viewing the Telugu site. */
export function localizePath(path: string, lang: Lang) {
  if (lang === "en" || /^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return path === "/" ? "/te/" : `/te${path}`;
}

export function useLocalizePath() {
  const lang = useLang();
  return (path: string) => localizePath(path, lang);
}

/** Pick the Telugu value when available, otherwise English. */
export function pick(text: LocalizedText | null | undefined, lang: Lang): string {
  if (!text) return "";
  return (lang === "te" && text.te) || text.en;
}

export function usePick() {
  const lang = useLang();
  return (text: LocalizedText | null | undefined) => pick(text, lang);
}
