import type { ReactNode } from "react";
import { cn } from "./cn";

type Tone = "neutral" | "success" | "maroon" | "alert" | "gold";

// All combinations meet WCAG AA (see §6.2).
const tones: Record<Tone, string> = {
  neutral: "bg-cream-100 text-ink-900",
  success: "bg-[#E7F3EA] text-success-700",
  maroon: "bg-maroon-50 text-maroon-700",
  alert: "bg-[#FDECEC] text-alert-700",
  gold: "bg-gold-400 text-maroon-900",
};

export function Badge({
  children,
  tone = "neutral",
  icon,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium", tones[tone], className)}>
      {icon}
      {children}
    </span>
  );
}
