import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "./cn";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id: string;
  /** id of the visible <label> element */
  labelId: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  /** Submitted with the form (hidden input) */
  name?: string;
  invalid?: boolean;
  describedBy?: string;
  required?: boolean;
  onBlur?: () => void;
  className?: string;
}

/**
 * Accessible custom dropdown (WAI-ARIA "select-only combobox"). Replaces the
 * native <select> so option hover/focus uses a light maroon tint (maroon-100)
 * instead of the operating system's blue highlight.
 * Keyboard: ↓/↑/Home/End move, Enter/Space select, Esc closes, letters jump.
 */
export function Select({ id, labelId, value, onChange, options, placeholder = "Choose…", name, invalid, describedBy, required, onBlur, className }: SelectProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.findIndex((o) => o.value === value)));
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const selected = options.find((o) => o.value === value);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the active option scrolled into view
  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const choose = (i: number) => {
    const opt = options[i];
    if (opt) onChange(opt.value);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openList();
        else setActive((a) => Math.min(last, a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openList();
        else setActive((a) => Math.max(0, a - 1));
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActive(last);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(active);
        else openList();
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        if (open) choose(active);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const k = e.key.toLowerCase();
          const start = open ? active + 1 : 0;
          const order = [...options.slice(start), ...options.slice(0, start)];
          const hit = order.find((o) => o.label.toLowerCase().startsWith(k));
          if (hit) {
            const idx = options.indexOf(hit);
            if (open) setActive(idx);
            else onChange(hit.value);
          }
        }
    }
  };

  return (
    <div ref={root} className={cn("relative", className)}>
      {name && <input type="hidden" name={name} value={value} />}
      <div
        id={id}
        role="combobox"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className={cn(
          "flex min-h-12 w-full cursor-pointer select-none items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-base transition",
          "hover:border-maroon-300 focus:outline-none focus-visible:border-maroon-700 focus-visible:ring-4 focus-visible:ring-maroon-100",
          invalid ? "border-alert-700" : open ? "border-maroon-700 ring-4 ring-maroon-100" : "border-ink-200",
        )}
      >
        <span className={cn("truncate", selected ? "text-ink-900" : "text-ink-600")}>{selected ? selected.label : placeholder}</span>
        <ChevronDown className={cn("h-5 w-5 shrink-0 text-maroon-700 transition-transform duration-200", open && "rotate-180")} aria-hidden />
      </div>
      <ul
        ref={list}
        id={listId}
        role="listbox"
        aria-labelledby={labelId}
        hidden={!open}
        className="absolute left-0 right-0 z-30 mt-2 max-h-72 animate-menu-in overflow-auto rounded-2xl border border-maroon-100 bg-white p-1.5 shadow-menu"
      >
        {options.map((o, i) => {
          const isSelected = o.value === value;
          return (
            <li
              key={o.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={isSelected}
              onPointerEnter={() => setActive(i)}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
              className={cn(
                "flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-[15px]",
                i === active ? "bg-maroon-100 text-maroon-900" : "text-ink-900",
                isSelected && "font-semibold",
              )}
            >
              <span>{o.label}</span>
              {isSelected && <Check className="h-4 w-4 shrink-0 text-maroon-700" aria-hidden />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
