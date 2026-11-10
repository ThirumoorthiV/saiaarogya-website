import { BadgeCheck } from "lucide-react";
import { GuideShell } from "@/components/guide/GuideShell";
import { RegistrationSteps, WhatToBring } from "@/components/guide/Registration";

/** Registration & What to Bring (§5.5). */
export function Component() {
  return (
    <GuideShell path="/patient-guide/registration/">
      <section aria-labelledby="reg-steps" className="space-y-6">
        <h2 id="reg-steps" className="text-h2">
          Registration in three steps
        </h2>
        <RegistrationSteps />
        <p className="flex items-start gap-3 rounded-2xl bg-success-50 p-4 text-ink-900">
          <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-success-700" aria-hidden />
          All services are offered completely free of charge to every individual, without discrimination based on caste, creed, religion, or economic status.
        </p>
      </section>
      <section aria-labelledby="reg-bring" className="space-y-6">
        <h2 id="reg-bring" className="text-h2">
          What to bring
        </h2>
        <WhatToBring />
      </section>
    </GuideShell>
  );
}
