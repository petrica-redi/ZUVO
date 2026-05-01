export type EmergencyRedFlag = {
  id:
    | "chest_pain"
    | "breathing"
    | "heavy_bleeding"
    | "stroke"
    | "suicide"
    | "severe_allergy"
    | "unconscious"
    | "child_not_breathing";
  pattern: RegExp;
  title: string;
  instruction: string;
};

export const EMERGENCY_REDFLAGS: EmergencyRedFlag[] = [
  {
    id: "chest_pain",
    pattern: /\b(chest pain|pressure in (my|the) chest|tight chest|pain in (my|the) chest)\b/i,
    title: "Possible chest emergency",
    instruction: "Call 112 or go to emergency care now, especially if there is shortness of breath, sweating, nausea, weakness, or pain spreading to the arm, jaw, back, or neck.",
  },
  {
    id: "breathing",
    pattern: /\b(can'?t breathe|cannot breathe|difficulty breathing|short(ness)? of breath|struggling to breathe|gasping)\b/i,
    title: "Breathing emergency",
    instruction: "Call 112 now. Sit upright, loosen tight clothing, and do not wait to see if it passes.",
  },
  {
    id: "heavy_bleeding",
    pattern: /\b(heavy bleeding|bleeding heavily|blood is pouring|spurting blood|won'?t stop bleeding)\b/i,
    title: "Heavy bleeding",
    instruction: "Call 112 now. Press firmly on the wound with the cleanest cloth available and keep pressure on it until help arrives.",
  },
  {
    id: "stroke",
    pattern: /\b(face droop|slurred speech|one side weak|sudden weakness|stroke|can'?t move one side)\b/i,
    title: "Possible stroke",
    instruction: "Call 112 immediately. Note the time symptoms started. Do not give food, drink, or medicine unless emergency services tell you to.",
  },
  {
    id: "suicide",
    pattern: /\b(kill myself|suicide|want to die|end my life|hurt myself|self[- ]harm)\b/i,
    title: "Immediate mental health danger",
    instruction: "Call emergency services now or contact a crisis line immediately. Stay with the person if it is safe and remove medicines, weapons, or other immediate dangers.",
  },
  {
    id: "severe_allergy",
    pattern: /\b(anaphylaxis|severe allergic|throat swelling|tongue swelling|lips swelling|hives.*breath|allergic.*breath)\b/i,
    title: "Severe allergic reaction",
    instruction: "Call 112 now. Use an epinephrine auto-injector if one is available and prescribed, then seek emergency care.",
  },
  {
    id: "unconscious",
    pattern: /\b(unconscious|passed out and won'?t wake|not responding|collapsed and not responding)\b/i,
    title: "Unresponsive person",
    instruction: "Call 112 immediately. Check breathing if you know how, keep the airway clear, and follow dispatcher instructions.",
  },
  {
    id: "child_not_breathing",
    pattern: /\b(child|baby|infant).*\b(not breathing|can'?t breathe|cannot breathe|blue lips|turning blue)\b/i,
    title: "Child breathing emergency",
    instruction: "Call 112 now. Follow dispatcher instructions immediately.",
  },
];

export function detectEmergencyRedFlag(text: string): EmergencyRedFlag | null {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return null;
  return EMERGENCY_REDFLAGS.find((flag) => flag.pattern.test(normalized)) ?? null;
}

export const detectRedFlag = detectEmergencyRedFlag;

export function buildEmergencySummary(flag: EmergencyRedFlag) {
  return {
    severity: "red" as const,
    title: flag.title,
    assessment:
      "This description contains a red-flag symptom that can be life-threatening. This app cannot safely assess this online.",
    immediateAction: flag.instruction,
    whatToDo: flag.instruction,
    watchFor: "Do not wait for symptoms to improve. If emergency services are available, call now.",
    homeCare: [],
    warningSignsToEscalate: ["This is already an emergency red flag."],
    commonCauses: [],
    preventionTips: [],
    doctorVisitSummary: `Emergency red flag detected: ${flag.title}. ${flag.instruction}`,
  };
}

export function redFlagSymptomResult(flag: EmergencyRedFlag) {
  const summary = buildEmergencySummary(flag);
  return {
    severity: summary.severity,
    title: summary.title,
    assessment: summary.assessment,
    immediateAction: summary.immediateAction,
    homeCare: summary.homeCare,
    warningSignsToEscalate: summary.warningSignsToEscalate,
    commonCauses: summary.commonCauses,
    preventionTips: summary.preventionTips,
  };
}

export function buildEmergencyConsultSummary(flag: EmergencyRedFlag) {
  const summary = buildEmergencySummary(flag);
  return {
    stage: "summary" as const,
    severity: summary.severity,
    title: summary.title,
    assessment: summary.assessment,
    whatToDo: summary.whatToDo,
    watchFor: summary.watchFor,
    homeRemedies: undefined,
    doctorVisitSummary: summary.doctorVisitSummary,
  };
}
