import type { ReactNode } from "react";
import { cn } from "./cn";

/** §6.4: white card, 16px radius, soft shadow. */
export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return <Tag className={cn("rounded-card bg-white p-5 shadow-card md:p-6", className)}>{children}</Tag>;
}
