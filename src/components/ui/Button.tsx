import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { SmartLink } from "./SmartLink";
import { cn } from "./cn";

export type ButtonVariant = "primary" | "soft" | "outline" | "ghost" | "onDark" | "onDarkOutline";
export type ButtonSize = "md" | "lg";

/** Pill buttons, min 48px tall (§6.4 touch targets). Maroon only — no orange. */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold no-underline transition duration-200 disabled:cursor-not-allowed disabled:opacity-60";
const sizes: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 text-[15px]",
  lg: "min-h-14 px-7 text-base",
};
const variants: Record<ButtonVariant, string> = {
  primary: "bg-maroon-700 text-white shadow-[0_8px_20px_-8px_rgba(122,12,12,.6)] hover:bg-maroon-800 active:bg-maroon-900",
  soft: "bg-maroon-100 text-maroon-800 hover:bg-maroon-200",
  outline: "border border-ink-200 bg-white text-ink-900 hover:border-maroon-200 hover:bg-maroon-50 hover:text-maroon-800",
  ghost: "min-h-11 px-0 text-maroon-700 hover:text-maroon-900 [&>svg:last-child]:transition-transform hover:[&>svg:last-child]:translate-x-0.5",
  onDark: "bg-white text-maroon-800 hover:bg-maroon-100",
  onDarkOutline: "border border-white/40 text-white hover:bg-white/10",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(base, variant === "ghost" ? "" : sizes[size], variants[variant], className);
}

interface Common {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ to, variant = "primary", size = "md", icon, className, children, newTab, track }: Common & { to: string; newTab?: boolean; track?: string }) {
  return (
    <SmartLink to={to} newTab={newTab} track={track} className={buttonClass(variant, size, className)}>
      {icon}
      <span>{children}</span>
      {variant === "ghost" && <ArrowRight className="h-4 w-4" aria-hidden />}
    </SmartLink>
  );
}

export function Button({ variant = "primary", size = "md", icon, className, children, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
