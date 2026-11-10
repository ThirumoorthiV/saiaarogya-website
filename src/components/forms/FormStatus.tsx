import { forwardRef } from "react";
import { CircleCheck, CircleX } from "lucide-react";
import { siteSettings, tel } from "@/content";

export const FormSuccess = forwardRef<HTMLDivElement, { title: string; text: string; onReset?: () => void; resetLabel?: string }>(
  function FormSuccess({ title, text, onReset, resetLabel }, ref) {
    return (
      <div ref={ref} tabIndex={-1} role="status" className="rounded-3xl bg-success-50 p-6 outline-none md:p-8">
        <p className="flex items-center gap-2.5 font-heading text-xl font-bold text-success-700">
          <CircleCheck className="h-6 w-6" aria-hidden />
          {title}
        </p>
        <p className="mt-2 text-ink-900">{text}</p>
        {onReset && (
          <button type="button" onClick={onReset} className="mt-5 min-h-11 rounded-full bg-white px-5 font-semibold text-maroon-800 hover:bg-maroon-100">
            {resetLabel ?? "Send another message"}
          </button>
        )}
      </div>
    );
  },
);

export const FormError = forwardRef<HTMLDivElement>(function FormError(_props, ref) {
  return (
    <div ref={ref} tabIndex={-1} role="alert" className="rounded-2xl bg-alert-50 p-4 outline-none">
      <p className="flex items-center gap-2 font-semibold text-alert-700">
        <CircleX className="h-5 w-5" aria-hidden />
        Sorry, your message could not be sent.
      </p>
      <p className="mt-1 text-ink-900">
        Please try again, or call us on{" "}
        <a href={tel} className="font-semibold" data-track="call-form-error">
          {siteSettings.phoneDisplay}
        </a>
        .
      </p>
    </div>
  );
});
