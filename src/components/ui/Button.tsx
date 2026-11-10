import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { LLink } from "./LLink";
import { cn } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "light";

/** §6.4: Primary (saffron-700 fill), Secondary (maroon outline), Ghost (text + arrow); 12px radius; min 48px height. */
const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-btn py-3 text-base font-semibold no-underline transition-colors duration-200";
const variants: Record<ButtonVariant, string> = {
  primary: "px-5 bg-saffron-700 text-white hover:bg-[#9A3412]",
  secondary: "px-5 border-2 border-maroon-700 bg-white text-maroon-700 hover:bg-maroon-50",
  ghost: "justify-start text-maroon-700 hover:underline",
  light: "px-5 border-2 border-white bg-transparent text-white hover:bg-white/10",
};

interface CommonProps {
  variant?: ButtonVariant;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function buttonClass(variant: ButtonVariant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

const isExternal = (to: string) => /^(https?:|mailto:|tel:|#)/.test(to);

/**
 * Link styled as a button. Internal paths ("/x/") use the router and keep
 * the current language; tel:, mailto:, # and http(s) links render a plain <a>.
 * `track` adds a data-track attribute used by analytics (§8).
 */
export function ButtonLink({
  to,
  variant = "primary",
  icon,
  className,
  children,
  newTab,
  track,
}: CommonProps & { to: string; newTab?: boolean; track?: string }) {
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {variant === "ghost" && <ArrowRight className="h-4 w-4" aria-hidden />}
    </>
  );
  const cls = buttonClass(variant, className);
  if (isExternal(to)) {
    return (
      <a href={to} className={cls} data-track={track} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {content}
      </a>
    );
  }
  return (
    <LLink to={to} className={cls} data-track={track}>
      {content}
    </LLink>
  );
}

export function Button({
  variant = "primary",
  icon,
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClass(variant, className)} {...rest}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
