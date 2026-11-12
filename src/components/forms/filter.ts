import type { UseFormRegisterReturn } from "react-hook-form";

/**
 * Wraps a react-hook-form `register()` result so the field's value is cleaned on every
 * keystroke or paste (e.g. `clean.mobile`: digits only, max 10) before the form sees it.
 */
export function filtered<T extends string>(reg: UseFormRegisterReturn<T>, filter: (v: string) => string): UseFormRegisterReturn<T> {
  return {
    ...reg,
    onChange: (e) => {
      const el = e.target as HTMLInputElement | HTMLTextAreaElement;
      const next = filter(el.value);
      if (next !== el.value) el.value = next;
      return reg.onChange(e);
    },
  };
}
