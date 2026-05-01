/**
 * Student Health Academy — high school health literacy with staged progression.
 * Copy lives in messages/*.json under namespace `studentHealth`.
 */

import type { Tip } from "@/data/content";

export const STUDENT_HEALTH_PILLAR_ID = "student_health" as const;

export type StageId = "local" | "regional" | "national";

export const STAGE_ORDER: StageId[] = ["local", "regional", "national"];

export type StudentModule = {
  id: string;
  stageId: StageId;
  emoji: string;
  titleKey: string;
  descriptionKey: string;
  tips: Tip[];
  factKey: string;
  actionKey: string;
  durationMin: number;
};

/** Translation keys use namespace `studentHealth`; paths are relative to that (e.g. modules.emergency101.title). */
const m = (suffix: string) => `studentHealth.${suffix}` as const;

function tips(
  stage: StageId,
  modId: string,
  count: number,
  icons: string[]
): Tip[] {
  return Array.from({ length: count }, (_, i) => ({
    icon: icons[i] ?? "•",
    textKey: m(`modules.${stage}.${modId}.tip${i + 1}`),
  }));
}

export const STUDENT_MODULES: StudentModule[] = [
  // ── Local ─────────────────────────────────────────────────────────────
  {
    id: "emergency101",
    stageId: "local",
    emoji: "📞",
    titleKey: m("modules.local.emergency101.title"),
    descriptionKey: m("modules.local.emergency101.description"),
    tips: tips("local", "emergency101", 4, ["📞", "🗣️", "📍", "⏱️"]),
    factKey: m("modules.local.emergency101.fact"),
    actionKey: m("modules.local.emergency101.action"),
    durationMin: 6,
  },
  {
    id: "bleedingBasics",
    stageId: "local",
    emoji: "🩹",
    titleKey: m("modules.local.bleedingBasics.title"),
    descriptionKey: m("modules.local.bleedingBasics.description"),
    tips: tips("local", "bleedingBasics", 4, ["🧼", "✋", "⬆️", "🚫"]),
    factKey: m("modules.local.bleedingBasics.fact"),
    actionKey: m("modules.local.bleedingBasics.action"),
    durationMin: 7,
  },
  {
    id: "burnsBasics",
    stageId: "local",
    emoji: "💧",
    titleKey: m("modules.local.burnsBasics.title"),
    descriptionKey: m("modules.local.burnsBasics.description"),
    tips: tips("local", "burnsBasics", 4, ["💧", "⏱️", "🚫", "🏥"]),
    factKey: m("modules.local.burnsBasics.fact"),
    actionKey: m("modules.local.burnsBasics.action"),
    durationMin: 6,
  },
  {
    id: "stiBasics",
    stageId: "local",
    emoji: "🛡️",
    titleKey: m("modules.local.stiBasics.title"),
    descriptionKey: m("modules.local.stiBasics.description"),
    tips: tips("local", "stiBasics", 4, ["🔬", "🤐", "💬", "🏥"]),
    factKey: m("modules.local.stiBasics.fact"),
    actionKey: m("modules.local.stiBasics.action"),
    durationMin: 8,
  },
  {
    id: "consentBasics",
    stageId: "local",
    emoji: "🤝",
    titleKey: m("modules.local.consentBasics.title"),
    descriptionKey: m("modules.local.consentBasics.description"),
    tips: tips("local", "consentBasics", 4, ["✋", "🔄", "📵", "💙"]),
    factKey: m("modules.local.consentBasics.fact"),
    actionKey: m("modules.local.consentBasics.action"),
    durationMin: 7,
  },
  // ── Regional ──────────────────────────────────────────────────────────
  {
    id: "chokingBasics",
    stageId: "regional",
    emoji: "😮",
    titleKey: m("modules.regional.chokingBasics.title"),
    descriptionKey: m("modules.regional.chokingBasics.description"),
    tips: tips("regional", "chokingBasics", 4, ["📞", "👐", "🚫", "📚"]),
    factKey: m("modules.regional.chokingBasics.fact"),
    actionKey: m("modules.regional.chokingBasics.action"),
    durationMin: 7,
  },
  {
    id: "stiTesting",
    stageId: "regional",
    emoji: "🔬",
    titleKey: m("modules.regional.stiTesting.title"),
    descriptionKey: m("modules.regional.stiTesting.description"),
    tips: tips("regional", "stiTesting", 4, ["🏥", "🔒", "💊", "👥"]),
    factKey: m("modules.regional.stiTesting.fact"),
    actionKey: m("modules.regional.stiTesting.action"),
    durationMin: 8,
  },
  {
    id: "vaccineLiteracy",
    stageId: "regional",
    emoji: "💉",
    titleKey: m("modules.regional.vaccineLiteracy.title"),
    descriptionKey: m("modules.regional.vaccineLiteracy.description"),
    tips: tips("regional", "vaccineLiteracy", 4, ["📅", "🧬", "✅", "🏛️"]),
    factKey: m("modules.regional.vaccineLiteracy.fact"),
    actionKey: m("modules.regional.vaccineLiteracy.action"),
    durationMin: 8,
  },
  {
    id: "vpdExamples",
    stageId: "regional",
    emoji: "🌍",
    titleKey: m("modules.regional.vpdExamples.title"),
    descriptionKey: m("modules.regional.vpdExamples.description"),
    tips: tips("regional", "vpdExamples", 4, ["🦠", "💉", "👫", "📖"]),
    factKey: m("modules.regional.vpdExamples.fact"),
    actionKey: m("modules.regional.vpdExamples.action"),
    durationMin: 7,
  },
  // ── National ────────────────────────────────────────────────────────
  {
    id: "firstAidReview",
    stageId: "national",
    emoji: "⛑️",
    titleKey: m("modules.national.firstAidReview.title"),
    descriptionKey: m("modules.national.firstAidReview.description"),
    tips: tips("national", "firstAidReview", 4, ["📞", "🩸", "🔥", "🧠"]),
    factKey: m("modules.national.firstAidReview.fact"),
    actionKey: m("modules.national.firstAidReview.action"),
    durationMin: 8,
  },
  {
    id: "stiMyths",
    stageId: "national",
    emoji: "💬",
    titleKey: m("modules.national.stiMyths.title"),
    descriptionKey: m("modules.national.stiMyths.description"),
    tips: tips("national", "stiMyths", 4, ["🚫", "✅", "🏥", "🧪"]),
    factKey: m("modules.national.stiMyths.fact"),
    actionKey: m("modules.national.stiMyths.action"),
    durationMin: 8,
  },
  {
    id: "sourceLiteracy",
    stageId: "national",
    emoji: "📰",
    titleKey: m("modules.national.sourceLiteracy.title"),
    descriptionKey: m("modules.national.sourceLiteracy.description"),
    tips: tips("national", "sourceLiteracy", 4, ["🏛️", "🔍", "📱", "❓"]),
    factKey: m("modules.national.sourceLiteracy.fact"),
    actionKey: m("modules.national.sourceLiteracy.action"),
    durationMin: 8,
  },
  {
    id: "capstoneMix",
    stageId: "national",
    emoji: "🏆",
    titleKey: m("modules.national.capstoneMix.title"),
    descriptionKey: m("modules.national.capstoneMix.description"),
    tips: tips("national", "capstoneMix", 4, ["🎯", "🤝", "💉", "📚"]),
    factKey: m("modules.national.capstoneMix.fact"),
    actionKey: m("modules.national.capstoneMix.action"),
    durationMin: 10,
  },
];

export type StageQuizQuestionDef = {
  questionKey: string;
  optionKeys: [string, string, string];
  correctIndex: 0 | 1 | 2;
  explanationKey: string;
};

function q(
  stage: StageId,
  index: number,
  correctIndex: 0 | 1 | 2
): StageQuizQuestionDef {
  const base = `stageQuiz.${stage}.q${index}`;
  return {
    questionKey: m(`${base}.question`),
    optionKeys: [m(`${base}.a0`), m(`${base}.a1`), m(`${base}.a2`)] as [string, string, string],
    correctIndex,
    explanationKey: m(`${base}.explanation`),
  };
}

export const STAGE_QUIZZES: Record<StageId, StageQuizQuestionDef[]> = {
  local: [
    q("local", 0, 1),
    q("local", 1, 1),
    q("local", 2, 1),
    q("local", 3, 1),
  ],
  regional: [
    q("regional", 0, 1),
    q("regional", 1, 1),
    q("regional", 2, 1),
    q("regional", 3, 1),
  ],
  national: [
    q("national", 0, 1),
    q("national", 1, 1),
    q("national", 2, 1),
    q("national", 3, 1),
  ],
};

export const STAGE_QUIZ_PASS_PCT = 70;

export const STUDENT_HUB_THEME = {
  bg: "#F0F4FF",
  borderColor: "#C7D2FE",
  color: "#4338CA",
} as const;

export function getModulesByStage(stage: StageId): StudentModule[] {
  return STUDENT_MODULES.filter((m) => m.stageId === stage);
}

export function getStudentModule(
  stage: StageId,
  moduleId: string
): StudentModule | undefined {
  return STUDENT_MODULES.find((m) => m.stageId === stage && m.id === moduleId);
}

export function getModuleIndexInStage(stage: StageId, moduleId: string): number {
  const mods = getModulesByStage(stage);
  return mods.findIndex((m) => m.id === moduleId);
}

export function getNextModuleInStage(
  stage: StageId,
  moduleId: string
): StudentModule | undefined {
  const mods = getModulesByStage(stage);
  const idx = mods.findIndex((m) => m.id === moduleId);
  if (idx < 0 || idx >= mods.length - 1) return undefined;
  return mods[idx + 1];
}

/** Strip `studentHealth.` prefix for useTranslations('studentHealth') */
export function studentHealthMessageKey(fullKey: string): string {
  return fullKey.replace(/^studentHealth\./, "");
}
