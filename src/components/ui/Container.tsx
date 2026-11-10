import type { ReactNode } from "react";
import { cn } from "./cn";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-content px-4 md:px-6", className)}>{children}</div>;
}
