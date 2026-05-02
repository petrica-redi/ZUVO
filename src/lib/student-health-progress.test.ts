/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, beforeEach } from "vitest";
import {
  addAcademyXp,
  getAcademyLevel,
  getCurrentStreak,
  getOverallCompletion,
  getStageCompletion,
  getWeeklyActivity,
  isStageQuizPassed,
  isStageUnlockedForPlay,
  readAcademyState,
  recordActivityToday,
  recordQuizPass,
  recordQuizScore,
  setCountryId,
  writeAcademyState,
} from "./student-health-progress";

beforeEach(() => {
  localStorage.clear();
});

describe("getAcademyLevel", () => {
  it("returns level 1 for zero XP", () => {
    const lvl = getAcademyLevel(0);
    expect(lvl.level).toBe(1);
    expect(lvl.progressPercent).toBe(0);
  });

  it("computes level breakpoints correctly", () => {
    expect(getAcademyLevel(99).level).toBe(1);
    expect(getAcademyLevel(100).level).toBe(2);
    expect(getAcademyLevel(450).level).toBe(5);
  });

  it("caps at level 10", () => {
    expect(getAcademyLevel(99999).level).toBe(10);
    expect(getAcademyLevel(99999).progressPercent).toBe(100);
  });

  it("rejects negative XP gracefully", () => {
    const lvl = getAcademyLevel(-50);
    expect(lvl.level).toBe(1);
    expect(lvl.xpInLevel).toBe(0);
  });

  it("computes mid-level progress", () => {
    const lvl = getAcademyLevel(150);
    expect(lvl.level).toBe(2);
    expect(lvl.progressPercent).toBe(50);
    expect(lvl.nextLevelXp).toBe(200);
  });
});

describe("XP awards & streaks", () => {
  it("addAcademyXp increases XP and records activity", () => {
    addAcademyXp(10);
    const state = readAcademyState();
    expect(state.xp).toBe(10);
    expect(state.activityDates.length).toBe(1);
    expect(state.lastActivityAt).not.toBeNull();
  });

  it("addAcademyXp clamps negative input to zero", () => {
    addAcademyXp(-50);
    expect(readAcademyState().xp).toBe(0);
  });

  it("getCurrentStreak returns 0 with no activity", () => {
    expect(getCurrentStreak()).toBe(0);
  });

  it("getCurrentStreak counts today as 1", () => {
    recordActivityToday();
    expect(getCurrentStreak()).toBe(1);
  });

  it("getCurrentStreak walks backwards through consecutive days", () => {
    const state = readAcademyState();
    const today = new Date();
    const dates: string[] = [];
    for (let i = 0; i < 5; i += 1) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }
    state.activityDates = dates;
    state.lastActivityAt = today.toISOString();
    writeAcademyState(state);
    expect(getCurrentStreak()).toBe(5);
  });

  it("getWeeklyActivity returns exactly 7 entries", () => {
    const week = getWeeklyActivity();
    expect(week).toHaveLength(7);
    week.forEach((day) => {
      expect(day).toHaveProperty("day");
      expect(day).toHaveProperty("active");
      expect(day).toHaveProperty("date");
    });
  });
});

describe("Stage progression", () => {
  it("local stage is always unlocked for play", () => {
    expect(isStageUnlockedForPlay("local")).toBe(true);
  });

  it("regional stage is locked until local quiz passes", () => {
    expect(isStageUnlockedForPlay("regional")).toBe(false);
    recordQuizPass("local", 80);
    expect(isStageUnlockedForPlay("regional")).toBe(true);
  });

  it("national stage requires regional quiz", () => {
    recordQuizPass("local", 80);
    expect(isStageUnlockedForPlay("national")).toBe(false);
    recordQuizPass("regional", 80);
    expect(isStageUnlockedForPlay("national")).toBe(true);
  });

  it("recordQuizPass awards 50 XP only on first pass", () => {
    recordQuizPass("local", 80);
    expect(readAcademyState().xp).toBe(50);
    recordQuizPass("local", 90);
    expect(readAcademyState().xp).toBe(50); // unchanged
  });

  it("recordQuizPass adds badge", () => {
    recordQuizPass("local", 80);
    expect(readAcademyState().badges).toContain("local");
  });

  it("recordQuizScore stores score without passing", () => {
    recordQuizScore("local", 60);
    const state = readAcademyState();
    expect(state.quizScores.local).toBe(60);
    expect(state.quizPassed.local).toBeUndefined();
    expect(isStageQuizPassed("local")).toBe(false);
  });

  it("clamps quiz scores to 0-100", () => {
    recordQuizScore("local", 150);
    expect(readAcademyState().quizScores.local).toBe(100);
    recordQuizScore("local", -30);
    expect(readAcademyState().quizScores.local).toBe(0);
  });
});

describe("Country selection", () => {
  it("stores and clears country id", () => {
    setCountryId("ro");
    expect(readAcademyState().countryId).toBe("ro");
    setCountryId(null);
    expect(readAcademyState().countryId).toBeNull();
  });
});

describe("State migration & resilience", () => {
  it("returns default state when localStorage is empty", () => {
    const state = readAcademyState();
    expect(state.xp).toBe(0);
    expect(state.version).toBe(2);
    expect(state.badges).toEqual([]);
  });

  it("returns default state for malformed JSON", () => {
    localStorage.setItem("sastipe_student_health", "{not valid json");
    const state = readAcademyState();
    expect(state.xp).toBe(0);
  });

  it("preserves unknown fields gracefully", () => {
    localStorage.setItem(
      "sastipe_student_health",
      JSON.stringify({ xp: 100, futureField: "ignored" }),
    );
    const state = readAcademyState();
    expect(state.xp).toBe(100);
  });
});

describe("Completion summaries", () => {
  it("returns 0/total when no modules completed", () => {
    const local = getStageCompletion("local");
    expect(local.completed).toBe(0);
    expect(local.total).toBeGreaterThan(0);
    expect(local.percent).toBe(0);
  });

  it("getOverallCompletion sums all stages", () => {
    const overall = getOverallCompletion();
    expect(overall.total).toBeGreaterThan(0);
    expect(overall.completed).toBeLessThanOrEqual(overall.total);
  });
});
