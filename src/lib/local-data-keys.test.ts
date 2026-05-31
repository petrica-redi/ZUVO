/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, beforeEach } from "vitest";
import {
  LOCAL_EXPORT_SCHEMA_VERSION,
  clearAllLocalAppData,
  exportLocalAppData,
} from "./local-data-keys";

beforeEach(() => {
  localStorage.clear();
});

describe("exportLocalAppData", () => {
  it("returns an empty bundle when nothing is stored", () => {
    const bundle = exportLocalAppData();
    expect(bundle.source).toBe("device");
    expect(bundle.schemaVersion).toBe(LOCAL_EXPORT_SCHEMA_VERSION);
    expect(typeof bundle.exportedAt).toBe("string");
    expect(bundle.data).toEqual({});
  });

  it("includes family and health-log data that the simple export used to omit", () => {
    localStorage.setItem("zuvo_family", JSON.stringify([{ name: "Ana" }]));
    localStorage.setItem(
      "zuvo_health_logs",
      JSON.stringify([{ date: "2026-05-31", mood: 4 }]),
    );

    const { data } = exportLocalAppData();
    expect(data["zuvo_family"]).toEqual([{ name: "Ana" }]);
    expect(data["zuvo_health_logs"]).toEqual([{ date: "2026-05-31", mood: 4 }]);
  });

  it("parses JSON values and keeps non-JSON values as raw strings", () => {
    localStorage.setItem("sastipe_progress", JSON.stringify({ "a:b": "completed" }));
    localStorage.setItem("sastipe_theme", "dark");

    const { data } = exportLocalAppData();
    expect(data["sastipe_progress"]).toEqual({ "a:b": "completed" });
    expect(data["sastipe_theme"]).toBe("dark");
  });

  it("captures prefix-matched keys like Field Lab notes", () => {
    localStorage.setItem(
      "sastipe_student_field_lab:water",
      JSON.stringify({ note: "drink more" }),
    );

    const { data } = exportLocalAppData();
    expect(data["sastipe_student_field_lab:water"]).toEqual({ note: "drink more" });
  });

  it("omits keys that are not app-owned", () => {
    localStorage.setItem("some_third_party_key", "value");

    const { data } = exportLocalAppData();
    expect(data).not.toHaveProperty("some_third_party_key");
  });

  it("exports every key that clearAllLocalAppData would wipe", () => {
    localStorage.setItem("sastipe_progress", JSON.stringify({ x: 1 }));
    localStorage.setItem("zuvo_family", JSON.stringify([1]));
    localStorage.setItem(
      "sastipe_student_field_lab:notes",
      JSON.stringify({ a: 1 }),
    );

    const exportedKeys = Object.keys(exportLocalAppData().data).length;
    const removed = clearAllLocalAppData();
    expect(exportedKeys).toBe(removed);
    expect(exportLocalAppData().data).toEqual({});
  });
});
