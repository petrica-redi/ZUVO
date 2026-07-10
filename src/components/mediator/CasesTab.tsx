"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  CASE_CATEGORIES,
  CASE_STATUSES,
  HEALTH_FACILITATIONS,
  VULNERABILITY_TAGS,
  type CaseCategory,
  type CaseStatus,
  type HealthFacilitation,
  type MediatorCase,
  type VulnerabilityTag,
} from "@/lib/mediator/types";
import {
  CATEGORY_LABEL_KEYS,
  STATUS_LABEL_KEYS,
  type MediatorLabels,
} from "./labels";
import { EmptyState, FormCard, SaveButton, SectionTitle, fieldClass } from "./parts";

function toggle<T>(set: T[], value: T): T[] {
  return set.includes(value) ? set.filter((x) => x !== value) : [...set, value];
}

export function CasesTab({
  labels,
  cases,
  onSave,
}: {
  labels: MediatorLabels;
  cases: MediatorCase[];
  onSave: (record: MediatorCase) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CaseCategory>("health");
  const [status, setStatus] = useState<CaseStatus>("identified");
  const [notes, setNotes] = useState("");
  const [nextVisit, setNextVisit] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityTag[]>([]);
  const [facilitations, setFacilitations] = useState<HealthFacilitation[]>([]);
  const [saved, setSaved] = useState(false);

  const reset = () => {
    setName("");
    setNotes("");
    setNextVisit("");
    setCategory("health");
    setStatus("identified");
    setHouseholdSize("");
    setVulnerabilities([]);
    setFacilitations([]);
  };

  const submit = () => {
    if (!name.trim()) return;
    const now = new Date().toISOString();
    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      status,
      notes: notes.trim(),
      nextVisit,
      createdAt: now,
      updatedAt: now,
      householdSize: Number.parseInt(householdSize, 10) || undefined,
      vulnerabilities: vulnerabilities.length ? vulnerabilities : undefined,
      healthFacilitations: facilitations.length ? facilitations : undefined,
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
      <SectionTitle
        action={
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full bg-[var(--color-sage-700)] px-4 py-2 text-xs font-extrabold text-white shadow-[0_8px_20px_-12px_rgba(21,128,61,0.8)]"
          >
            {labels.newCase}
          </button>
        }
      >
        {labels.casesTitle}
      </SectionTitle>

      {open && (
        <FormCard>
          <input
            type="text"
            placeholder={labels.caseName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label={labels.caseName}
            className={`mb-3 ${fieldClass}`}
          />
          <div className="mb-3 grid grid-cols-2 gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CaseCategory)}
              aria-label={labels.caseCategory}
              className={fieldClass}
            >
              {CASE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {labels[CATEGORY_LABEL_KEYS[c]]}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CaseStatus)}
              aria-label={labels.caseStatus}
              className={fieldClass}
            >
              {CASE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {labels[STATUS_LABEL_KEYS[s]]}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <input
              type="date"
              value={nextVisit}
              onChange={(e) => setNextVisit(e.target.value)}
              aria-label={labels.nextVisit}
              className={fieldClass}
            />
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={50}
              placeholder={labels.householdSize}
              value={householdSize}
              onChange={(e) => setHouseholdSize(e.target.value)}
              aria-label={labels.householdSize}
              className={fieldClass}
            />
          </div>

          <fieldset className="mb-3 rounded-xl border border-[var(--color-border-subtle)] p-3">
            <legend className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
              {labels.vulnerabilityLabel}
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {VULNERABILITY_TAGS.map((v) => {
                const active = vulnerabilities.includes(v);
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVulnerabilities((s) => toggle(s, v))}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-bold transition-colors ${
                      active
                        ? "border-[var(--color-sage-600)] bg-[var(--color-sage-100)] text-[var(--color-sage-800)]"
                        : "border-[var(--color-border-default)] text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {labels[`vuln_${v}` as keyof MediatorLabels]}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mb-3 rounded-xl border border-[var(--color-border-subtle)] p-3">
            <legend className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
              {labels.healthFacilitationLabel}
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {HEALTH_FACILITATIONS.map((f) => {
                const active = facilitations.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFacilitations((s) => toggle(s, f))}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-bold transition-colors ${
                      active
                        ? "border-[var(--color-success-accent)] bg-[var(--color-success-bg)] text-[var(--color-success-text)]"
                        : "border-[var(--color-border-default)] text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {labels[`facilitation_${f}` as keyof MediatorLabels]}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <textarea
            placeholder={labels.caseNotes}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-label={labels.caseNotes}
            rows={3}
            className={`mb-3 ${fieldClass}`}
          />
          <SaveButton
            saved={saved}
            savedLabel={labels.caseSaved}
            saveLabel={labels.saveCase}
            disabled={!name.trim()}
            onClick={submit}
          />
        </FormCard>
      )}

      {cases.length === 0 ? (
        <EmptyState message={labels.noCases} />
      ) : (
        <ul className="flex flex-col gap-3">
          {cases.map((c) => (
            <li
              key={c.id}
              className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-[0_10px_35px_-24px_rgba(15,23,42,0.28)]"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <span className="font-bold text-[var(--color-text-primary)]">{c.name}</span>
                <span className="shrink-0 rounded-full bg-[var(--color-sage-100)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-sage-800)]">
                  {labels[STATUS_LABEL_KEYS[c.status]] ?? c.status}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                {labels[CATEGORY_LABEL_KEYS[c.category]] ?? c.category}
                {typeof c.householdSize === "number" && c.householdSize > 0 && (
                  <span> · {labels.householdSize}: {c.householdSize}</span>
                )}
              </p>
              {c.nextVisit && (
                <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                  <Calendar className="h-3 w-3" />
                  {labels.nextVisit}: {c.nextVisit}
                </p>
              )}
              {(c.vulnerabilities?.length ?? 0) > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.vulnerabilities!.map((v) => (
                    <span
                      key={v}
                      className="rounded-full bg-[var(--color-warning-bg)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-warning-text)]"
                    >
                      {labels[`vuln_${v}` as keyof MediatorLabels]}
                    </span>
                  ))}
                </div>
              )}
              {(c.healthFacilitations?.length ?? 0) > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {c.healthFacilitations!.map((f) => (
                    <span
                      key={f}
                      className="rounded-full bg-[var(--color-success-bg)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-success-text)]"
                    >
                      {labels[`facilitation_${f}` as keyof MediatorLabels]}
                    </span>
                  ))}
                </div>
              )}
              {c.notes && (
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{c.notes}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
