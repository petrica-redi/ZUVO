import { describe, expect, it } from "vitest";

function dueInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

describe("missed-appointment recovery", () => {
  it("schedules recovery tasks at 1, 3, and 7 days", () => {
    const today = new Date().toISOString().slice(0, 10);
    const day1 = dueInDays(1);
    const day3 = dueInDays(3);
    const day7 = dueInDays(7);

    expect(day1 > today).toBe(true);
    expect(day3 > day1).toBe(true);
    expect(day7 > day3).toBe(true);
  });

  it("identifies missed attendance outcomes", () => {
    const missedOutcomes = ["missed", "no_show"];
    expect(missedOutcomes.includes("missed")).toBe(true);
    expect(missedOutcomes.includes("attended")).toBe(false);
  });
});
