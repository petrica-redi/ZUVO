"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";
import {
  BARRIER_SLUGS,
  CASE_STATUSES,
  CASE_URGENCIES,
  CATEGORY_SLUGS,
  STATUS_LABEL_KEYS,
  URGENCY_LABEL_KEYS,
  type BarrierSlug,
  type CaseStatus,
  type CaseUrgency,
  type CategorySlug,
} from "@/lib/operations/constants";
import type { NavigationCase } from "@/lib/operations/types";
import type { CreateCaseInput } from "@/lib/operations/types";
import { suggestTasksForBarriers } from "@/lib/operations/barrier-suggestions";
import { getDefaultMunicipality } from "@/lib/operations/operations-client";
import { EmptyState, FormCard, SaveButton } from "./parts";

function toggle<T>(set: T[], value: T): T[] {
  return set.includes(value) ? set.filter((x) => x !== value) : [...set, value];
}

function urgencyTone(urgency: CaseUrgency): string {
  if (urgency === "emergency") return "bg-[var(--color-danger-bg)] text-[var(--color-danger-text)]";
  if (urgency === "urgent") return "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]";
  if (urgency === "priority") return "bg-[var(--color-info-bg)] text-[var(--color-info-text)]";
  return "bg-[var(--color-sage-100)] text-[var(--color-sage-800)]";
}

export function OperationalCasesTab({
  cases,
  onCreateCase,
  onUpdateStatus,
}: {
  cases: NavigationCase[];
  onCreateCase: (input: CreateCaseInput) => Promise<NavigationCase>;
  onUpdateStatus: (caseId: string, status: CaseStatus) => Promise<void>;
}) {
  const t = useTranslations("operations");
  const [open, setOpen] = useState(false);
  const [pseudonym, setPseudonym] = useState("");
  const [category, setCategory] = useState<CategorySlug>("other");
  const [mainProblem, setMainProblem] = useState("");
  const [urgency, setUrgency] = useState<CaseUrgency>("routine");
  const [notes, setNotes] = useState("");
  const [barriers, setBarriers] = useState<BarrierSlug[]>([]);
  const [barrierNotes, setBarrierNotes] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [saved, setSaved] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const reset = () => {
    setPseudonym("");
    setCategory("other");
    setMainProblem("");
    setUrgency("routine");
    setNotes("");
    setBarriers([]);
    setBarrierNotes("");
    setTargetDate("");
    setSuggestions([]);
  };

  const onBarriersChange = (next: BarrierSlug[]) => {
    setBarriers(next);
    const tasks = suggestTasksForBarriers(next);
    setSuggestions(tasks.map((task) => t(`taskType_${task}`)));
  };

  const submit = async () => {
    if (!pseudonym.trim() || !mainProblem.trim()) return;
    await onCreateCase({
      beneficiaryPseudonym: pseudonym.trim(),
      categorySlug: category,
      mainProblem: mainProblem.trim(),
      urgency,
      notes: notes.trim(),
      barriers,
      barrierNotes: barrierNotes.trim() || undefined,
      targetDate: targetDate || undefined,
      municipalityCode: getDefaultMunicipality(),
      source: "mediator_dashboard",
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
      reset();
    }, 1500);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          {t("casesTitle")}
        </h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full bg-[var(--color-sage-700)] px-4 py-2 text-xs font-extrabold text-white"
        >
          {t("openCase")}
        </button>
      </div>

      {open && (
        <FormCard>
          <input
            type="text"
            placeholder={t("beneficiaryPseudonym")}
            value={pseudonym}
            onChange={(e) => setPseudonym(e.target.value)}
            aria-label={t("beneficiaryPseudonym")}
            className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
          />
          <div className="mb-3 grid grid-cols-2 gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategorySlug)}
              aria-label={t("category")}
              className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
            >
              {CATEGORY_SLUGS.map((c) => (
                <option key={c} value={c}>
                  {t(`category_${c}`)}
                </option>
              ))}
            </select>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as CaseUrgency)}
              aria-label={t("urgency")}
              className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
            >
              {CASE_URGENCIES.map((u) => (
                <option key={u} value={u}>
                  {t(URGENCY_LABEL_KEYS[u].replace("operations.", ""))}
                </option>
              ))}
            </select>
          </div>

          {urgency === "emergency" && (
            <div
              role="alert"
              className="mb-3 flex items-start gap-2 rounded-xl border border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] p-3 text-sm text-[var(--color-danger-text)]"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{t("emergencyWarning")}</p>
            </div>
          )}

          <input
            type="text"
            placeholder={t("mainProblem")}
            value={mainProblem}
            onChange={(e) => setMainProblem(e.target.value)}
            aria-label={t("mainProblem")}
            className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
          />

          <fieldset className="mb-3 rounded-xl border border-[var(--color-border-subtle)] p-3">
            <legend className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
              {t("barriersLabel")}
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {BARRIER_SLUGS.map((b) => {
                const active = barriers.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => onBarriersChange(toggle(barriers, b))}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-bold transition-colors ${
                      active
                        ? "border-[var(--color-sage-600)] bg-[var(--color-sage-100)] text-[var(--color-sage-800)]"
                        : "border-[var(--color-border-default)] text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {t(`barrier_${b}`)}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {suggestions.length > 0 && (
            <p className="mb-3 text-xs text-[var(--color-text-secondary)]">
              {t("suggestedActions")}: {suggestions.join(", ")}
            </p>
          )}

          <textarea
            placeholder={t("barrierNotes")}
            value={barrierNotes}
            onChange={(e) => setBarrierNotes(e.target.value)}
            aria-label={t("barrierNotes")}
            rows={2}
            className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
          />

          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            aria-label={t("targetDate")}
            className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
          />

          <textarea
            placeholder={t("notes")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-label={t("notes")}
            rows={3}
            className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
          />

          <SaveButton
            saved={saved}
            savedLabel={t("caseSaved")}
            saveLabel={t("saveCase")}
            disabled={!pseudonym.trim() || !mainProblem.trim()}
            onClick={() => void submit()}
          />
        </FormCard>
      )}

      {cases.length === 0 ? (
        <EmptyState message={t("noCases")} />
      ) : (
        <ul className="flex flex-col gap-2">
          {cases.map((c) => (
            <li
              key={c.id}
              className="rounded-2xl bg-[var(--color-surface)] p-4 shadow-1"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-[var(--color-text-primary)]">
                    {c.beneficiaryPseudonym}
                  </span>
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    {c.caseNumber}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${urgencyTone(c.urgency)}`}
                >
                  {t(URGENCY_LABEL_KEYS[c.urgency].replace("operations.", ""))}
                </span>
              </div>

              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--color-sage-100)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-sage-800)]">
                  {t(STATUS_LABEL_KEYS[c.status].replace("operations.", ""))}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {t(`category_${c.categorySlug}`)}
                </span>
              </div>

              <p className="text-sm text-[var(--color-text-secondary)]">{c.mainProblem}</p>

              {c.urgency === "emergency" && (
                <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-[var(--color-danger-text)]">
                  <AlertTriangle className="h-3 w-3" />
                  {t("emergencyWarning")}
                </p>
              )}

              {c.nextAction && (
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  {t("nextAction")}: {c.nextAction.startsWith("operations.") ? t(c.nextAction.replace("operations.", "")) : c.nextAction}
                </p>
              )}

              {(c.barriers?.length ?? 0) > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.barriers.map((b) => (
                    <span
                      key={b}
                      className="rounded-full bg-[var(--color-warning-bg)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-warning-text)]"
                    >
                      {t(`barrier_${b}`)}
                    </span>
                  ))}
                </div>
              )}

              {c.status !== "completed" && c.status !== "cancelled" && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {CASE_STATUSES.filter((s) => s !== c.status).slice(0, 4).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void onUpdateStatus(c.id, s)}
                      className="rounded-full border border-[var(--color-border-default)] px-2 py-1 text-[10px] font-bold text-[var(--color-text-secondary)]"
                    >
                      → {t(STATUS_LABEL_KEYS[s].replace("operations.", ""))}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
