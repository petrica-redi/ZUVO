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
  scenarioKey: string;
  challengeKey: string;
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

function moduleKeys(stage: StageId, modId: string) {
  return {
    titleKey: m(`modules.${stage}.${modId}.title`),
    descriptionKey: m(`modules.${stage}.${modId}.description`),
    factKey: m(`modules.${stage}.${modId}.fact`),
    actionKey: m(`modules.${stage}.${modId}.action`),
    scenarioKey: m(`modules.${stage}.${modId}.scenario`),
    challengeKey: m(`modules.${stage}.${modId}.challenge`),
  };
}

export const STUDENT_MODULES: StudentModule[] = [
  // ── Local ─────────────────────────────────────────────────────────────
  {
    id: "emergency101",
    stageId: "local",
    emoji: "📞",
    ...moduleKeys("local", "emergency101"),
    tips: tips("local", "emergency101", 4, ["📞", "🗣️", "📍", "⏱️"]),
    durationMin: 6,
  },
  {
    id: "bleedingBasics",
    stageId: "local",
    emoji: "🩹",
    ...moduleKeys("local", "bleedingBasics"),
    tips: tips("local", "bleedingBasics", 4, ["🧼", "✋", "⬆️", "🚫"]),
    durationMin: 7,
  },
  {
    id: "burnsBasics",
    stageId: "local",
    emoji: "💧",
    ...moduleKeys("local", "burnsBasics"),
    tips: tips("local", "burnsBasics", 4, ["💧", "⏱️", "🚫", "🏥"]),
    durationMin: 6,
  },
  {
    id: "stiBasics",
    stageId: "local",
    emoji: "🛡️",
    ...moduleKeys("local", "stiBasics"),
    tips: tips("local", "stiBasics", 4, ["🔬", "🤐", "💬", "🏥"]),
    durationMin: 8,
  },
  {
    id: "consentBasics",
    stageId: "local",
    emoji: "🤝",
    ...moduleKeys("local", "consentBasics"),
    tips: tips("local", "consentBasics", 4, ["✋", "🔄", "📵", "💙"]),
    durationMin: 7,
  },
  // ── Regional ──────────────────────────────────────────────────────────
  {
    id: "chokingBasics",
    stageId: "regional",
    emoji: "😮",
    ...moduleKeys("regional", "chokingBasics"),
    tips: tips("regional", "chokingBasics", 4, ["📞", "👐", "🚫", "📚"]),
    durationMin: 7,
  },
  {
    id: "stiTesting",
    stageId: "regional",
    emoji: "🔬",
    ...moduleKeys("regional", "stiTesting"),
    tips: tips("regional", "stiTesting", 4, ["🏥", "🔒", "💊", "👥"]),
    durationMin: 8,
  },
  {
    id: "vaccineLiteracy",
    stageId: "regional",
    emoji: "💉",
    ...moduleKeys("regional", "vaccineLiteracy"),
    tips: tips("regional", "vaccineLiteracy", 4, ["📅", "🧬", "✅", "🏛️"]),
    durationMin: 8,
  },
  {
    id: "vpdExamples",
    stageId: "regional",
    emoji: "🌍",
    ...moduleKeys("regional", "vpdExamples"),
    tips: tips("regional", "vpdExamples", 4, ["🦠", "💉", "👫", "📖"]),
    durationMin: 7,
  },
  // ── National ────────────────────────────────────────────────────────
  {
    id: "firstAidReview",
    stageId: "national",
    emoji: "⛑️",
    ...moduleKeys("national", "firstAidReview"),
    tips: tips("national", "firstAidReview", 4, ["📞", "🩸", "🔥", "🧠"]),
    durationMin: 8,
  },
  {
    id: "stiMyths",
    stageId: "national",
    emoji: "💬",
    ...moduleKeys("national", "stiMyths"),
    tips: tips("national", "stiMyths", 4, ["🚫", "✅", "🏥", "🧪"]),
    durationMin: 8,
  },
  {
    id: "sourceLiteracy",
    stageId: "national",
    emoji: "📰",
    ...moduleKeys("national", "sourceLiteracy"),
    tips: tips("national", "sourceLiteracy", 4, ["🏛️", "🔍", "📱", "❓"]),
    durationMin: 8,
  },
  {
    id: "capstoneMix",
    stageId: "national",
    emoji: "🏆",
    ...moduleKeys("national", "capstoneMix"),
    tips: tips("national", "capstoneMix", 4, ["🎯", "🤝", "💉", "📚"]),
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

export function getNextStage(stage: StageId): StageId | undefined {
  const index = STAGE_ORDER.indexOf(stage);
  if (index < 0) return undefined;
  return STAGE_ORDER[index + 1];
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

export function getPreviousModuleInStage(
  stage: StageId,
  moduleId: string
): StudentModule | undefined {
  const mods = getModulesByStage(stage);
  const idx = mods.findIndex((m) => m.id === moduleId);
  if (idx <= 0) return undefined;
  return mods[idx - 1];
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
