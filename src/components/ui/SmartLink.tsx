import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

export const isExternalHref = (to: string) => /^(https?:|mailto:|tel:|#)/.test(to);

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  /** Open http(s) links in a new tab (adds rel="noopener noreferrer"). */
  newTab?: boolean;
  /** Analytics id (data-track), see Analytics.tsx */
  track?: string;
  children: ReactNode;
};

/** Router link for internal paths, plain <a> for tel:, mailto:, # and external URLs. */
export function SmartLink({ to, newTab, track, children, ...rest }: Props) {
  if (isExternalHref(to)) {
    return (
      <a href={to} data-track={track} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
        {newTab && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link to={to} data-track={track} {...rest}>
      {children}
    </Link>
  );
}
