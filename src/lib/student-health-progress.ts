"use client";

import type { StageId } from "@/data/student-health";
import { getModulesByStage, STAGE_ORDER, STUDENT_HEALTH_PILLAR_ID } from "@/data/student-health";

const ACADEMY_KEY = "sastipe_student_health";
const LEGACY_PROGRESS_KEY = "sastipe_progress";

export type StudentAcademyBadge = "local" | "regional" | "national";

export type StudentAcademyState = {
  xp: number;
  badges: StudentAcademyBadge[];
  quizPassed: Partial<Record<StageId, boolean>>;
  countryId: string | null;
};

const defaultState = (): StudentAcademyState => ({
  xp: 0,
  badges: [],
  quizPassed: {},
  countryId: null,
});

export function readAcademyState(): StudentAcademyState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(ACADEMY_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<StudentAcademyState>;
    return {
      xp: typeof parsed.xp === "number" ? parsed.xp : 0,
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
      quizPassed: parsed.quizPassed && typeof parsed.quizPassed === "object" ? parsed.quizPassed : {},
      countryId: typeof parsed.countryId === "string" ? parsed.countryId : null,
    };
  } catch {
    return defaultState();
  }
}

export function writeAcademyState(state: StudentAcademyState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACADEMY_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("student-academy-update"));
}

export function setCountryId(countryId: string | null): void {
  const s = readAcademyState();
  s.countryId = countryId;
  writeAcademyState(s);
}

export function getCompletedModuleIdsFromLegacyProgress(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEGACY_PROGRESS_KEY);
    if (!raw) return [];
    const p = JSON.parse(raw) as Record<string, string>;
    const prefix = `${STUDENT_HEALTH_PILLAR_ID}:`;
    return Object.keys(p)
      .filter((k) => k.startsWith(prefix) && p[k] === "completed")
      .map((k) => k.slice(prefix.length));
  } catch {
    return [];
  }
}

export function allStageModulesCompleted(stage: StageId): boolean {
  const done = new Set(getCompletedModuleIdsFromLegacyProgress());
  const mods = getModulesByStage(stage);
  return mods.length > 0 && mods.every((m) => done.has(m.id));
}

export function isStageQuizPassed(stage: StageId): boolean {
  return Boolean(readAcademyState().quizPassed[stage]);
}

/** First stage always accessible; later stages need previous stage quiz passed. */
export function isStageUnlockedForPlay(stage: StageId): boolean {
  const idx = STAGE_ORDER.indexOf(stage);
  if (idx <= 0) return true;
  const prev = STAGE_ORDER[idx - 1];
  return isStageQuizPassed(prev);
}

export function recordQuizPass(stage: StageId): void {
  const s = readAcademyState();
  s.quizPassed[stage] = true;
  const badge = stage as StudentAcademyBadge;
  if (!s.badges.includes(badge)) s.badges.push(badge);
  s.xp += 50;
  writeAcademyState(s);
}

export function addAcademyXp(amount: number): void {
  const s = readAcademyState();
  s.xp += amount;
  writeAcademyState(s);
}

function anonHeaders(): { "Content-Type": string; "x-anonymous-id": string } {
  const anonId =
    typeof window !== "undefined"
      ? localStorage.getItem("sastipe_anon_id") ?? crypto.randomUUID()
      : crypto.randomUUID();
  if (typeof window !== "undefined") {
    localStorage.setItem("sastipe_anon_id", anonId);
  }
  return {
    "Content-Type": "application/json",
    "x-anonymous-id": anonId,
  };
}

/** Optional sync: mark a synthetic progress row for stage quiz completion. */
export function postProgressQuizComplete(stage: StageId): void {
  if (typeof window === "undefined") return;
  fetch("/api/progress", {
    method: "POST",
    headers: anonHeaders(),
    body: JSON.stringify({
      pillarId: STUDENT_HEALTH_PILLAR_ID,
      moduleId: `stage_quiz_${stage}`,
      status: "completed",
    }),
  }).catch(() => {});
}
