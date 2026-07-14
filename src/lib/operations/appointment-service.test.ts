import { describe, expect, it } from "vitest";
import { ATTENDANCE_OUTCOMES, APPOINTMENT_STATUSES } from "./constants";

/** Maps attendance outcome to appointment status — mirrors appointment-service logic */
function appointmentStatusForOutcome(outcome: string): string {
  if (outcome === "attended" || outcome === "partial") return "completed";
  if (outcome === "missed" || outcome === "no_show") return "missed";
  return "cancelled";
}

describe("attendance follow-up workflow", () => {
  it("covers all attendance outcomes", () => {
    for (const outcome of ATTENDANCE_OUTCOMES) {
      const status = appointmentStatusForOutcome(outcome);
      expect(APPOINTMENT_STATUSES).toContain(status);
    }
  });

  it("marks attended and partial as completed", () => {
    expect(appointmentStatusForOutcome("attended")).toBe("completed");
    expect(appointmentStatusForOutcome("partial")).toBe("completed");
  });

  it("marks missed and no_show as missed for recovery tasks", () => {
    expect(appointmentStatusForOutcome("missed")).toBe("missed");
    expect(appointmentStatusForOutcome("no_show")).toBe("missed");
  });

  it("marks cancellations as cancelled", () => {
    expect(appointmentStatusForOutcome("cancelled_provider")).toBe("cancelled");
    expect(appointmentStatusForOutcome("cancelled_beneficiary")).toBe("cancelled");
    expect(appointmentStatusForOutcome("rescheduled")).toBe("cancelled");
  });
});
