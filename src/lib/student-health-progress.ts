"use client";

import type { StageId, StudentModule } from "@/data/student-health";
import {
  getModulesByStage,
  getNextStage,
  STAGE_ORDER,
  STUDENT_HEALTH_PILLAR_ID,
} from "@/data/student-health";

const ACADEMY_KEY = "sastipe_student_health";
const LEGACY_PROGRESS_KEY = "sastipe_progress";
const ACADEMY_VERSION = 2;

export type StudentAcademyBadge = "local" | "regional" | "national";

export type StudentAcademyState = {
  // Schema version, allows safe forward-migration.
  version: number;
  xp: number;
  badges: StudentAcademyBadge[];
  quizPassed: Partial<Record<StageId, boolean>>;
  countryId: string | null;
  /** ISO date strings (YYYY-MM-DD) for days the user completed any lesson. */
  activityDates: string[];
  /** Last quiz score per stage (0-100). */
  quizScores: Partial<Record<StageId, number>>;
  /** Most recent ISO timestamp of academy activity. */
  lastActivityAt: string | null;
};

export const defaultAcademyState = (): StudentAcademyState => ({
  version: ACADEMY_VERSION,
  xp: 0,
  badges: [],
  quizPassed: {},
  countryId: null,
  activityDates: [],
  quizScores: {},
  lastActivityAt: null,
});

function localDayString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayKey(date = new Date()): string {
  return localDayString(date);
}

export function readAcademyState(): StudentAcademyState {
  if (typeof window === "undefined") return defaultAcademyState();
  try {
    const raw = localStorage.getItem(ACADEMY_KEY);
    if (!raw) return defaultAcademyState();
    const parsed = JSON.parse(raw) as Partial<StudentAcademyState>;
    return {
      version: typeof parsed.version === "number" ? parsed.version : ACADEMY_VERSION,
      xp: typeof parsed.xp === "number" ? parsed.xp : 0,
      badges: Array.isArray(parsed.badges) ? (parsed.badges as StudentAcademyBadge[]) : [],
      quizPassed:
        parsed.quizPassed && typeof parsed.quizPassed === "object" ? parsed.quizPassed : {},
      countryId: typeof parsed.countryId === "string" ? parsed.countryId : null,
      activityDates: Array.isArray(parsed.activityDates)
        ? parsed.activityDates.filter((d) => typeof d === "string")
        : [],
      quizScores:
        parsed.quizScores && typeof parsed.quizScores === "object" ? parsed.quizScores : {},
      lastActivityAt: typeof parsed.lastActivityAt === "string" ? parsed.lastActivityAt : null,
    };
  } catch {
    return defaultAcademyState();
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

export function getCompletedModuleIdSet(): Set<string> {
  return new Set(getCompletedModuleIdsFromLegacyProgress());
}

export function getStageCompletion(stage: StageId): {
  completed: number;
  total: number;
  percent: number;
} {
  const done = getCompletedModuleIdSet();
  const mods = getModulesByStage(stage);
  const completed = mods.filter((m) => done.has(m.id)).length;
  const total = mods.length;
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function getOverallCompletion(): {
  completed: number;
  total: number;
  percent: number;
} {
  const stages = STAGE_ORDER.map(getStageCompletion);
  const completed = stages.reduce((sum, stage) => sum + stage.completed, 0);
  const total = stages.reduce((sum, stage) => sum + stage.total, 0);
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function getAcademyLevel(xp: number): {
  level: number;
  nextLevelXp: number;
  progressPercent: number;
  xpInLevel: number;
  xpForLevel: number;
} {
  const safeXp = Math.max(0, xp);
  const level = Math.min(10, Math.floor(safeXp / 100) + 1);
  const levelStartXp = (level - 1) * 100;
  const nextLevelXp = level >= 10 ? safeXp : level * 100;
  const xpInLevel = safeXp - levelStartXp;
  const xpForLevel = level >= 10 ? Math.max(1, xpInLevel) : 100;
  const progressPercent =
    level >= 10 ? 100 : Math.round((xpInLevel / xpForLevel) * 100);

  return { level, nextLevelXp, progressPercent, xpInLevel, xpForLevel };
}

export type AcademyNextStep =
  | { type: "lesson"; stage: StageId; module: StudentModule; href: string }
  | { type: "quiz"; stage: StageId; href: string }
  | { type: "complete"; href: string };

export function getAcademyNextStep(): AcademyNextStep {
  const done = getCompletedModuleIdSet();

  for (const stage of STAGE_ORDER) {
    if (!isStageUnlockedForPlay(stage)) {
      continue;
    }

    const firstIncomplete = getModulesByStage(stage).find((m) => !done.has(m.id));
    if (firstIncomplete) {
      return {
        type: "lesson",
        stage,
        module: firstIncomplete,
        href: `/students/${stage}/${firstIncomplete.id}`,
      };
    }

    if (!isStageQuizPassed(stage)) {
      return {
        type: "quiz",
        stage,
        href: `/students/quiz/${stage}`,
      };
    }
  }

  return { type: "complete", href: "/students" };
}

export function getLessonNextStep(stage: StageId, moduleId: string): AcademyNextStep {
  const done = getCompletedModuleIdSet();
  const modules = getModulesByStage(stage);
  const currentIndex = modules.findIndex((m) => m.id === moduleId);
  const nextIncomplete = modules
    .slice(Math.max(0, currentIndex + 1))
    .find((m) => !done.has(m.id));

  if (nextIncomplete) {
    return {
      type: "lesson",
      stage,
      module: nextIncomplete,
      href: `/students/${stage}/${nextIncomplete.id}`,
    };
  }

  if (allStageModulesCompleted(stage) && !isStageQuizPassed(stage)) {
    return {
      type: "quiz",
      stage,
      href: `/students/quiz/${stage}`,
    };
  }

  const nextStage = getNextStage(stage);
  if (nextStage && isStageUnlockedForPlay(nextStage)) {
    const firstModule = getModulesByStage(nextStage)[0];
    if (firstModule) {
      return {
        type: "lesson",
        stage: nextStage,
        module: firstModule,
        href: `/students/${nextStage}/${firstModule.id}`,
      };
    }
  }

  return getAcademyNextStep();
}

export function allStageModulesCompleted(stage: StageId): boolean {
  const completion = getStageCompletion(stage);
  return completion.total > 0 && completion.completed === completion.total;
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

export function recordQuizPass(stage: StageId, score?: number): void {
  const s = readAcademyState();
  const alreadyPassed = Boolean(s.quizPassed[stage]);
  s.quizPassed[stage] = true;
  if (typeof score === "number") {
    s.quizScores[stage] = Math.max(0, Math.min(100, Math.round(score)));
  }
  const badge = stage as StudentAcademyBadge;
  if (!s.badges.includes(badge)) s.badges.push(badge);
  if (!alreadyPassed) s.xp += 50;
  recordActivityInternal(s);
  writeAcademyState(s);
}

export function recordQuizScore(stage: StageId, score: number): void {
  const s = readAcademyState();
  s.quizScores[stage] = Math.max(0, Math.min(100, Math.round(score)));
  recordActivityInternal(s);
  writeAcademyState(s);
}

export function addAcademyXp(amount: number): void {
  const s = readAcademyState();
  s.xp += Math.max(0, Math.floor(amount));
  recordActivityInternal(s);
  writeAcademyState(s);
}

function recordActivityInternal(s: StudentAcademyState, now = new Date()) {
  const day = todayKey(now);
  if (!s.activityDates.includes(day)) {
    s.activityDates = [...s.activityDates, day].slice(-90);
  }
  s.lastActivityAt = now.toISOString();
}

export function recordActivityToday(): void {
  const s = readAcademyState();
  recordActivityInternal(s);
  writeAcademyState(s);
}

export function getCurrentStreak(now = new Date()): number {
  const s = readAcademyState();
  if (s.activityDates.length === 0) return 0;
  const set = new Set(s.activityDates);
  let streak = 0;
  const cursor = new Date(now);
  // Start from today; if today not in set but yesterday is, allow yesterday as first link.
  for (let i = 0; i < 90; i += 1) {
    const key = todayKey(cursor);
    if (set.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (i === 0) {
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function getWeeklyActivity(now = new Date()): { day: string; active: boolean; date: string }[] {
  const s = readAcademyState();
  const set = new Set(s.activityDates);
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const out: { day: string; active: boolean; date: string }[] = [];
  // Build last 7 days ending today (oldest first)
  for (let offset = 6; offset >= 0; offset -= 1) {
    const d = new Date(now);
    d.setDate(d.getDate() - offset);
    const key = todayKey(d);
    out.push({ day: days[d.getDay()] ?? "", active: set.has(key), date: key });
  }
  return out;
}

function anonHeaders(): { "Content-Type": string; "x-anonymous-id": string } {
  const generate = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      try {
        return crypto.randomUUID();
      } catch {
        /* fall through */
      }
    }
    return `anon-${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
  };
  const anonId =
    typeof window !== "undefined"
      ? localStorage.getItem("sastipe_anon_id") ?? generate()
      : generate();
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
