import { BadgeCheck } from "lucide-react";
import { useT } from "@/i18n/LangContext";
import { GuidePage } from "@/components/guide/GuidePage";
import { RegistrationSteps, WhatToBring } from "@/components/guide/GuideParts";
import { Todo } from "@/components/ui/Todo";

/** Registration & What to Bring (§5.5). */
export function Component() {
  const t = useT();
  return (
    <GuidePage path="/patient-guide/registration/">
      <section aria-labelledby="reg-steps" className="space-y-6">
        <h2 id="reg-steps" className="h2">
          {t("guide.registrationTitle")}
        </h2>
        <RegistrationSteps />
        <p className="flex items-start gap-2 text-ink-900">
          <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-success-700" aria-hidden />
          All services are offered completely free of charge to every individual, without discrimination based on caste, creed, religion, or economic status.
        </p>
      </section>
      <section aria-labelledby="reg-bring" className="space-y-6">
        <h2 id="reg-bring" className="h2">
          {t("guide.whatToBring")}
        </h2>
        <WhatToBring />
      </section>
      <Todo id="registration-confirm">Confirm the registration steps and the “what to bring” list match the hospital’s actual process.</Todo>
    </GuidePage>
  );
}
