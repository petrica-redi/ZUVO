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
} {
  const safeXp = Math.max(0, xp);
  const level = Math.min(10, Math.floor(safeXp / 100) + 1);
  const nextLevelXp = level >= 10 ? safeXp : level * 100;
  const levelStartXp = (level - 1) * 100;
  const progressPercent =
    level >= 10 ? 100 : Math.round(((safeXp - levelStartXp) / 100) * 100);

  return { level, nextLevelXp, progressPercent };
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

export function recordQuizPass(stage: StageId): void {
  const s = readAcademyState();
  const alreadyPassed = Boolean(s.quizPassed[stage]);
  s.quizPassed[stage] = true;
  const badge = stage as StudentAcademyBadge;
  if (!s.badges.includes(badge)) s.badges.push(badge);
  if (!alreadyPassed) s.xp += 50;
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
