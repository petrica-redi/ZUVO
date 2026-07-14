/**
 * Barrier → suggested non-clinical workflow actions.
 * These are navigation recommendations, not medical advice.
 */

import type { BarrierSlug, TaskType } from "./constants";

export const BARRIER_SUGGESTIONS: Record<BarrierSlug, TaskType[]> = {
  no_gp: ["find_provider", "book_appointment"],
  no_insurance: ["check_entitlement", "prepare_documents"],
  missing_documents: ["prepare_documents", "call_beneficiary"],
  language: ["arrange_interpretation", "call_beneficiary"],
  digital_literacy: ["call_beneficiary", "accompany_patient"],
  transport: ["arrange_transport", "book_appointment"],
  childcare: ["call_beneficiary", "schedule_followup"],
  mobility: ["arrange_transport", "accompany_patient"],
  financial: ["check_entitlement", "call_clinic"],
  discrimination: ["call_beneficiary", "find_provider"],
  fear_trust: ["call_beneficiary", "obtain_consent"],
  negative_experience: ["call_beneficiary", "find_provider"],
  missed_appointment: ["send_reminder", "book_appointment"],
  unstable_housing: ["prepare_documents", "check_entitlement"],
  cross_border: ["prepare_documents", "check_entitlement"],
  no_phone_internet: ["call_beneficiary", "accompany_patient"],
  medication_understanding: ["call_beneficiary", "schedule_followup"],
  other: ["call_beneficiary"],
};

export function suggestTasksForBarriers(barriers: BarrierSlug[]): TaskType[] {
  const seen = new Set<TaskType>();
  for (const b of barriers) {
    for (const t of BARRIER_SUGGESTIONS[b] ?? []) seen.add(t);
  }
  return [...seen];
}

export function suggestNextAction(barriers: BarrierSlug[]): string {
  const tasks = suggestTasksForBarriers(barriers);
  if (tasks.includes("find_provider")) return "operations.nextActionFindProvider";
  if (tasks.includes("check_entitlement")) return "operations.nextActionCheckEntitlement";
  if (tasks.includes("obtain_consent")) return "operations.nextActionObtainConsent";
  if (tasks.includes("book_appointment")) return "operations.nextActionBookAppointment";
  return "operations.nextActionAssess";
}
