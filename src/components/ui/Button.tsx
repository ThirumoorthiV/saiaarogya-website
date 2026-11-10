import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { SmartLink } from "./SmartLink";
import { cn } from "./cn";

export type ButtonVariant = "primary" | "soft" | "outline" | "ghost" | "onDark" | "onDarkOutline" | "accent";
export type ButtonSize = "sm" | "md" | "lg";

/** Pill buttons, min 48px tall (§6.4 touch targets). Maroon only — no orange. */
const base = "inline-flex items-center justify-center gap-2 rounded-full font-semibold no-underline transition duration-200 disabled:cursor-not-allowed disabled:opacity-60";
const sizes: Record<ButtonSize, string> = {
  // Phones get 44–48px buttons (still ≥44px touch targets); tablets/desktop keep the larger sizes
  sm: "min-h-11 px-4 text-sm [&>svg]:h-4 [&>svg]:w-4",
  md: "min-h-11 px-5 text-[15px] sm:min-h-12 [&>svg]:h-[18px] [&>svg]:w-[18px]",
  lg: "min-h-12 px-6 text-[15px] sm:min-h-14 sm:px-7 sm:text-base [&>svg]:h-[18px] [&>svg]:w-[18px] sm:[&>svg]:h-5 sm:[&>svg]:w-5",
};
const variants: Record<ButtonVariant, string> = {
  // Icons on maroon are yellow (brand rule); on white / yellow they stay maroon
  primary: "bg-maroon-700 text-white shadow-[0_8px_20px_-8px_rgba(122,12,12,.6)] hover:bg-maroon-800 active:bg-maroon-900 [&_svg]:!text-yellow-400",
  soft: "bg-maroon-100 text-maroon-800 hover:bg-maroon-200",
  outline: "border-2 border-maroon-700 bg-white text-maroon-700 hover:bg-maroon-100 hover:text-maroon-800",
  ghost: "min-h-11 px-0 text-maroon-700 hover:text-maroon-900 [&>svg:last-child]:transition-transform hover:[&>svg:last-child]:translate-x-0.5",
  onDark: "bg-white text-maroon-800 hover:bg-maroon-100 [&_svg]:!text-maroon-700",
  accent: "bg-yellow-400 text-maroon-900 shadow-[0_8px_20px_-8px_rgba(250,204,21,.55)] hover:bg-yellow-300 [&_svg]:!text-maroon-800",
  onDarkOutline: "border border-white/40 text-white hover:bg-white/10 [&_svg]:!text-yellow-400",
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
