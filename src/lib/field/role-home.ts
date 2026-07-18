import type { FieldRole } from "./types";

export type ShiftActionId = "case" | "literacy" | "refer" | "inbox" | "pack";

export type ShiftAction = {
  id: ShiftActionId;
  /** i18n key under fieldOs.* */
  titleKey: string;
  leadKey: string;
  href?: string;
  tab?: "inbox" | "cases" | "tasks" | "more";
  tone: "primary" | "secondary" | "accent";
};

/**
 * Role-aware “My shift” actions — three taps, minimum training.
 * Mediator/nurse focus on case → literacy → refer.
 * Doctor focuses on referral inbox + visit pack.
 * Supervisor focuses on triage queue + team load.
 */
export function shiftActionsForRole(role: FieldRole): ShiftAction[] {
  if (role === "supervisor" || role === "case_manager") {
    return [
      {
        id: "inbox",
        titleKey: "actionInboxTitle",
        leadKey: "actionInboxLead",
        tab: "inbox",
        tone: "primary",
      },
      {
        id: "case",
        titleKey: "actionCasesTitle",
        leadKey: "actionCasesLead",
        tab: "cases",
        tone: "secondary",
      },
      {
        id: "refer",
        titleKey: "actionEscalateTitle",
        leadKey: "actionEscalateLead",
        tab: "inbox",
        tone: "accent",
      },
    ];
  }

  // nurse + mediator (and doctor mapped to mediator field role)
  return [
    {
      id: "case",
      titleKey: "actionCaseTitle",
      leadKey: "actionCaseLead",
      tab: "cases",
      tone: "primary",
    },
    {
      id: "literacy",
      titleKey: "actionLiteracyTitle",
      leadKey: "actionLiteracyLead",
      href: "/explain",
      tone: "secondary",
    },
    {
      id: "refer",
      titleKey: "actionReferTitle",
      leadKey: "actionReferLead",
      tab: "cases",
      tone: "accent",
    },
  ];
}

export function roleGreetingKey(role: FieldRole): string {
  if (role === "nurse") return "greetingNurse";
  if (role === "case_manager") return "greetingManager";
  if (role === "supervisor") return "greetingSupervisor";
  return "greetingMediator";
}
