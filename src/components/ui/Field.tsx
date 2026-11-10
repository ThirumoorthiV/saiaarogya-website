import type { ReactNode } from "react";
import { cn } from "./cn";

export const inputClass = (invalid: boolean) =>
  cn(
    "block min-h-12 w-full rounded-2xl border bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-500 transition",
    "hover:border-maroon-300 focus:border-maroon-700 focus:outline-none focus:ring-4 focus:ring-maroon-100",
    invalid ? "border-alert-700" : "border-ink-200",
  );

/** Labelled form field with hint and error wired up for screen readers (§8). */
export function Field({
  id,
  label,
  required,
  optional,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label id={`${id}-label`} htmlFor={id} className="mb-1.5 block text-[15px] font-semibold text-ink-900">
        {label}
        {required && (
          <span className="text-alert-700" aria-hidden>
            {" "}
            *
          </span>
        )}
        {optional && <span className="font-normal text-ink-600"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mb-1.5 text-sm text-ink-600">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-alert-700">
          {error}
        </p>
      )}
    </div>
  );
}

export const describedBy = (id: string, hasHint: boolean, hasError: boolean) =>
  [hasHint && `${id}-hint`, hasError && `${id}-error`].filter(Boolean).join(" ") || undefined;
