import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";

export const inputClass = (invalid: boolean) =>
  cn(
    "block min-h-12 w-full rounded-btn border bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-600/70",
    "focus:border-maroon-700 focus:outline-none focus:ring-2 focus:ring-maroon-700/30",
    invalid ? "border-alert-700" : "border-ink-600/40",
  );

/** Labelled form field with hint and error message wired up for screen readers (§8 accessibility). */
export function Field({
  id,
  label,
  required,
  optionalLabel,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optionalLabel?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-semibold text-ink-900">
        {label}
        {required ? (
          <span className="text-alert-700" aria-hidden>
            {" "}
            *
          </span>
        ) : optionalLabel ? (
          <span className="font-normal text-ink-600"> ({optionalLabel})</span>
        ) : null}
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

/** aria-describedby value for a field. */
export const describedBy = (id: string, hasHint: boolean, hasError: boolean) =>
  [hasHint && `${id}-hint`, hasError && `${id}-error`].filter(Boolean).join(" ") || undefined;
