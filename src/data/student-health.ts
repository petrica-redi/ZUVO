/**
 * Student Health Academy — high school health literacy with staged progression.
 * Copy lives in messages/*.json under namespace `studentHealth`.
 */

import type { Tip } from "@/data/content";

export const STUDENT_HEALTH_PILLAR_ID = "student_health" as const;

export type StageId = "local" | "regional" | "national";

export const STAGE_ORDER: StageId[] = ["local", "regional", "national"];

export type VisualTheme = {
  accent: string;
  bg: string;
  fg: string;
  subject:
    | "emergency"
    | "care"
    | "water"
    | "shield"
    | "consent"
    | "airway"
    | "lab"
    | "vaccine"
    | "world"
    | "aid"
    | "myth"
    | "source"
    | "capstone";
};

function makeVisual(subject: VisualTheme["subject"], accent: string, bg: string, fg: string): VisualTheme {
  return { subject, accent, bg, fg };
}

export const ACADEMY_VISUAL = makeVisual("capstone", "#F59E0B", "#111827", "#FFFBEB");

function visual(subject: VisualTheme["subject"]): VisualTheme {
  const palette: Record<VisualTheme["subject"], Omit<VisualTheme, "subject">> = {
    emergency: { accent: "#EF4444", bg: "#FEF2F2", fg: "#7F1D1D" },
    care: { accent: "#DC2626", bg: "#FFF1F2", fg: "#881337" },
    water: { accent: "#0EA5E9", bg: "#ECFEFF", fg: "#164E63" },
    shield: { accent: "#0E8074", bg: "#EFFAF7", fg: "#0C443F" },
    consent: { accent: "#DB2777", bg: "#FDF2F8", fg: "#831843" },
    airway: { accent: "#F97316", bg: "#FFF7ED", fg: "#7C2D12" },
    lab: { accent: "#0891B2", bg: "#ECFEFF", fg: "#164E63" },
    vaccine: { accent: "#059669", bg: "#ECFDF5", fg: "#064E3B" },
    world: { accent: "#2563EB", bg: "#EFF6FF", fg: "#1E3A8A" },
    aid: { accent: "#B91C1C", bg: "#FEF2F2", fg: "#7F1D1D" },
    myth: { accent: "#7C3AED", bg: "#F5F3FF", fg: "#3B0764" },
    source: { accent: "#0F766E", bg: "#F0FDFA", fg: "#134E4A" },
    capstone: { accent: "#F59E0B", bg: "#FFFBEB", fg: "#78350F" },
  };

  return makeVisual(subject, palette[subject].accent, palette[subject].bg, palette[subject].fg);
}

export const STAGE_VISUALS: Record<StageId, VisualTheme> = {
  local: {
    accent: "#F59E0B",
    bg: "#FFF7ED",
    fg: "#7C2D12",
    subject: "shield",
  },
  regional: {
    accent: "#0EA5E9",
    bg: "#ECFEFF",
    fg: "#164E63",
    subject: "world",
  },
  national: {
    accent: "#7C3AED",
    bg: "#F5F3FF",
    fg: "#3B0764",
    subject: "capstone",
  },
};

export type ModuleSource = {
  /** Short label for source pill, e.g. "WHO". */
  label: string;
  /** Friendly title of the page being cited. */
  title: string;
  /** Full URL students can verify. */
  url: string;
};

export type ModuleReview = {
  /** ISO date string (YYYY-MM-DD) of the most recent clinical review. */
  reviewedAt: string;
  /** Role of the reviewer, e.g. "Licensed nurse, IFRC first-aid instructor". */
  reviewerRole: string;
  /** ISO date string when the next review is due. */
  nextReviewDue: string;
  /** True if the module has been pulled and should not be shown to students. */
  pulled?: boolean;
};

export type StudentModule = {
  id: string;
  stageId: StageId;
  emoji: string;
  visual: VisualTheme;
  titleKey: string;
  descriptionKey: string;
  tips: Tip[];
  factKey: string;
  actionKey: string;
  scenarioKey: string;
  challengeKey: string;
  durationMin: number;
  /** Concrete sources students can verify (high school health literacy). */
  sources: ModuleSource[];
  /** Clinical review metadata. See docs/CONTENT_REVIEW.md. */
  review: ModuleReview;
};

const TIER1_REVIEW: ModuleReview = {
  reviewedAt: "2026-04-15",
  reviewerRole: "Licensed first-aid instructor (IFRC-certified)",
  nextReviewDue: "2027-04-15",
};

const TIER2_REVIEW: ModuleReview = {
  reviewedAt: "2026-04-15",
  reviewerRole: "Sexual-health clinician with youth-clinic practice",
  nextReviewDue: "2027-04-15",
};

const TIER3_REVIEW: ModuleReview = {
  reviewedAt: "2026-04-15",
  reviewerRole: "Public-health professional",
  nextReviewDue: "2027-04-15",
};

const TIER4_REVIEW: ModuleReview = {
  reviewedAt: "2026-04-15",
  reviewerRole: "Health-literacy curriculum designer",
  nextReviewDue: "2028-04-15",
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

const SOURCE_WHO_FIRST_AID: ModuleSource = {
  label: "WHO",
  title: "World Health Organization — first aid guidance",
  url: "https://www.who.int/health-topics/emergencies",
};
const SOURCE_RED_CROSS: ModuleSource = {
  label: "IFRC",
  title: "International Federation of Red Cross — first aid guidelines",
  url: "https://www.ifrc.org/our-work/disasters-climate-and-crises/first-aid",
};
const SOURCE_EUROPA_112: ModuleSource = {
  label: "EU 112",
  title: "European Emergency Number Association — 112 facts",
  url: "https://eena.org/knowledge-hub/the-emergency-number-112",
};
const SOURCE_WHO_BURNS: ModuleSource = {
  label: "WHO",
  title: "World Health Organization — burns fact sheet",
  url: "https://www.who.int/news-room/fact-sheets/detail/burns",
};
const SOURCE_WHO_STI: ModuleSource = {
  label: "WHO",
  title: "World Health Organization — sexually transmitted infections (STIs)",
  url: "https://www.who.int/news-room/fact-sheets/detail/sexually-transmitted-infections-(stis)",
};
const SOURCE_CDC_STI: ModuleSource = {
  label: "CDC",
  title: "US CDC — STI prevention",
  url: "https://www.cdc.gov/sti/prevention/index.html",
};
const SOURCE_UNESCO_CSE: ModuleSource = {
  label: "UNESCO",
  title: "UNESCO — comprehensive sexuality education",
  url: "https://www.unesco.org/en/health-education/cse",
};
const SOURCE_WHO_VACCINES: ModuleSource = {
  label: "WHO",
  title: "World Health Organization — vaccines and immunization",
  url: "https://www.who.int/health-topics/vaccines-and-immunization",
};
const SOURCE_WHO_MEASLES: ModuleSource = {
  label: "WHO",
  title: "World Health Organization — measles fact sheet",
  url: "https://www.who.int/news-room/fact-sheets/detail/measles",
};
const SOURCE_WHO_HPV: ModuleSource = {
  label: "WHO",
  title: "World Health Organization — HPV and cervical cancer",
  url: "https://www.who.int/news-room/fact-sheets/detail/cervical-cancer",
};
const SOURCE_HEALTH_LITERACY: ModuleSource = {
  label: "WHO",
  title: "World Health Organization — health literacy",
  url: "https://www.who.int/teams/health-promotion/enhanced-wellbeing/ninth-global-conference/health-literacy",
};
const SOURCE_NIH_MEDIA: ModuleSource = {
  label: "NIH",
  title: "US NIH — evaluating online health information",
  url: "https://www.nih.gov/health-information/your-healthiest-self-wellness-toolkits",
};

export const STUDENT_MODULES: StudentModule[] = [
  // ── Local ─────────────────────────────────────────────────────────────
  {
    id: "emergency101",
    visual: visual("emergency"),
    stageId: "local",
    emoji: "📞",
    ...moduleKeys("local", "emergency101"),
    tips: tips("local", "emergency101", 4, ["📞", "🗣️", "📍", "⏱️"]),
    durationMin: 6,
    review: TIER1_REVIEW,
    sources: [SOURCE_EUROPA_112, SOURCE_RED_CROSS],
  },
  {
    id: "bleedingBasics",
    visual: visual("care"),
    stageId: "local",
    emoji: "🩹",
    ...moduleKeys("local", "bleedingBasics"),
    tips: tips("local", "bleedingBasics", 4, ["🧼", "✋", "⬆️", "🚫"]),
    durationMin: 7,
    review: TIER1_REVIEW,
    sources: [SOURCE_RED_CROSS, SOURCE_WHO_FIRST_AID],
  },
  {
    id: "burnsBasics",
    visual: visual("water"),
    stageId: "local",
    emoji: "💧",
    ...moduleKeys("local", "burnsBasics"),
    tips: tips("local", "burnsBasics", 4, ["💧", "⏱️", "🚫", "🏥"]),
    durationMin: 6,
    review: TIER1_REVIEW,
    sources: [SOURCE_WHO_BURNS, SOURCE_RED_CROSS],
  },
  {
    id: "stiBasics",
    visual: visual("shield"),
    stageId: "local",
    emoji: "🛡️",
    ...moduleKeys("local", "stiBasics"),
    tips: tips("local", "stiBasics", 4, ["🔬", "🤐", "💬", "🏥"]),
    durationMin: 8,
    review: TIER2_REVIEW,
    sources: [SOURCE_WHO_STI, SOURCE_CDC_STI],
  },
  {
    id: "consentBasics",
    visual: visual("consent"),
    stageId: "local",
    emoji: "🤝",
    ...moduleKeys("local", "consentBasics"),
    tips: tips("local", "consentBasics", 4, ["✋", "🔄", "📵", "💙"]),
    durationMin: 7,
    review: TIER2_REVIEW,
    sources: [SOURCE_UNESCO_CSE],
  },
  // ── Regional ──────────────────────────────────────────────────────────
  {
    id: "chokingBasics",
    visual: visual("airway"),
    stageId: "regional",
    emoji: "😮",
    ...moduleKeys("regional", "chokingBasics"),
    tips: tips("regional", "chokingBasics", 4, ["📞", "👐", "🚫", "📚"]),
    durationMin: 7,
    review: TIER1_REVIEW,
    sources: [SOURCE_RED_CROSS, SOURCE_WHO_FIRST_AID],
  },
  {
    id: "stiTesting",
    visual: visual("lab"),
    stageId: "regional",
    emoji: "🔬",
    ...moduleKeys("regional", "stiTesting"),
    tips: tips("regional", "stiTesting", 4, ["🏥", "🔒", "💊", "👥"]),
    durationMin: 8,
    review: TIER2_REVIEW,
    sources: [SOURCE_WHO_STI, SOURCE_CDC_STI],
  },
  {
    id: "vaccineLiteracy",
    visual: visual("vaccine"),
    stageId: "regional",
    emoji: "💉",
    ...moduleKeys("regional", "vaccineLiteracy"),
    tips: tips("regional", "vaccineLiteracy", 4, ["📅", "🧬", "✅", "🏛️"]),
    durationMin: 8,
    review: TIER3_REVIEW,
    sources: [SOURCE_WHO_VACCINES],
  },
  {
    id: "vpdExamples",
    visual: visual("world"),
    stageId: "regional",
    emoji: "🌍",
    ...moduleKeys("regional", "vpdExamples"),
    tips: tips("regional", "vpdExamples", 4, ["🦠", "💉", "👫", "📖"]),
    durationMin: 7,
    review: TIER3_REVIEW,
    sources: [SOURCE_WHO_MEASLES, SOURCE_WHO_HPV],
  },
  // ── National ────────────────────────────────────────────────────────
  {
    id: "firstAidReview",
    visual: visual("aid"),
    stageId: "national",
    emoji: "⛑️",
    ...moduleKeys("national", "firstAidReview"),
    tips: tips("national", "firstAidReview", 4, ["📞", "🩸", "🔥", "🧠"]),
    durationMin: 8,
    review: TIER1_REVIEW,
    sources: [SOURCE_RED_CROSS, SOURCE_WHO_FIRST_AID],
  },
  {
    id: "stiMyths",
    visual: visual("myth"),
    stageId: "national",
    emoji: "💬",
    ...moduleKeys("national", "stiMyths"),
    tips: tips("national", "stiMyths", 4, ["🚫", "✅", "🏥", "🧪"]),
    durationMin: 8,
    review: TIER2_REVIEW,
    sources: [SOURCE_WHO_STI, SOURCE_CDC_STI],
  },
  {
    id: "sourceLiteracy",
    visual: visual("source"),
    stageId: "national",
    emoji: "📰",
    ...moduleKeys("national", "sourceLiteracy"),
    tips: tips("national", "sourceLiteracy", 4, ["🏛️", "🔍", "📱", "❓"]),
    durationMin: 8,
    review: TIER4_REVIEW,
    sources: [SOURCE_HEALTH_LITERACY, SOURCE_NIH_MEDIA],
  },
  {
    id: "capstoneMix",
    visual: visual("capstone"),
    stageId: "national",
    emoji: "🏆",
    ...moduleKeys("national", "capstoneMix"),
    tips: tips("national", "capstoneMix", 4, ["🎯", "🤝", "💉", "📚"]),
    durationMin: 10,
    review: TIER4_REVIEW,
    sources: [SOURCE_HEALTH_LITERACY, SOURCE_WHO_VACCINES, SOURCE_WHO_STI],
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
  color: "#0D685F",
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
