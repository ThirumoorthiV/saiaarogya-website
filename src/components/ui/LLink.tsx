import { Link, type LinkProps } from "react-router-dom";
import { useLocalizePath } from "@/i18n/LangContext";

/** Router link that keeps the visitor in their chosen language (/te/ prefix). */
export function LLink({ to, ...rest }: Omit<LinkProps, "to"> & { to: string }) {
  const lp = useLocalizePath();
  return <Link to={lp(to)} {...rest} />;
}
