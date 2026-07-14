"use client";

import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";
import { ConsultationFlow } from "@/components/ConsultationFlow";
import { ClinicianQueue } from "@/components/clinician/ClinicianQueue";

export function ConsultWorkspace({ locale }: { locale: string }) {
  const { demoMode, personaId } = useDemoPersona();

  if (demoMode && personaId === "doctor") {
    return <ClinicianQueue locale={locale} />;
  }

  return (
    <div className="px-5 py-6">
      <ConsultationFlow locale={locale} />
    </div>
  );
}
