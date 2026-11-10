import { FileText, IdCard, Pill } from "lucide-react";

/** §5.5 Registration: 3-step visual Arrive → Register at desk → Consult. */
export function RegistrationSteps() {
  const steps = [
    { title: "Arrive", text: "Come to the hospital during OPD hours." },
    { title: "Register at the desk", text: "Give your name and details at the registration desk." },
    { title: "Consult", text: "Wait for your turn and see the doctor." },
  ];
  return (
    <ol className="grid gap-4 md:grid-cols-3 md:gap-5">
      {steps.map((s, i) => (
        <li key={s.title} className="surface relative overflow-hidden p-6 md:p-7">
          <span aria-hidden className="absolute -right-3 -top-6 font-heading text-[110px] font-bold leading-none text-maroon-50">
            {i + 1}
          </span>
          <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-maroon-700 font-heading text-lg font-bold text-white" aria-hidden>
            {i + 1}
          </span>
          <h3 className="relative mt-5 font-heading text-xl font-bold text-ink-900">
            <span className="sr-only">Step {i + 1}: </span>
            {s.title}
          </h3>
          <p className="relative mt-1.5 text-ink-600">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

/** §5.5 What to bring: ID, previous reports, medicine list. */
export function WhatToBring() {
  const items = [
    { icon: IdCard, text: "An identity document (ID)" },
    { icon: FileText, text: "Previous medical reports and prescriptions" },
    { icon: Pill, text: "A list of the medicines you are taking" },
  ];
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {items.map((i) => (
        <li key={i.text} className="surface flex items-center gap-4 p-5">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700">
            <i.icon className="h-6 w-6" aria-hidden strokeWidth={1.75} />
          </span>
          <span className="font-medium text-ink-900">{i.text}</span>
        </li>
      ))}
    </ul>
  );
}
