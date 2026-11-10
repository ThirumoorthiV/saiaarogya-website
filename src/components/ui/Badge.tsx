import type { ReactNode } from "react";
import { cn } from "./cn";

type Tone = "neutral" | "maroon" | "success" | "alert" | "dark";

const tones: Record<Tone, string> = {
  neutral: "bg-ink-100 text-ink-700",
  maroon: "bg-maroon-100 text-maroon-800",
  success: "bg-success-50 text-success-700",
  alert: "bg-alert-50 text-alert-700",
  dark: "bg-maroon-900 text-white",
};

export function Badge({ children, tone = "neutral", icon, className }: { children: ReactNode; tone?: Tone; icon?: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold", tones[tone], className)}>
      {icon}
      {children}
    </span>
  );
}
