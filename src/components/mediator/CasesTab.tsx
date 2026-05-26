"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  CASE_CATEGORIES,
  CASE_STATUSES,
  type CaseCategory,
  type CaseStatus,
  type MediatorCase,
} from "@/lib/mediator/types";
import {
  CATEGORY_LABEL_KEYS,
  STATUS_LABEL_KEYS,
  type MediatorLabels,
} from "./labels";
import { EmptyState, FormCard, SaveButton } from "./parts";

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
  const [saved, setSaved] = useState(false);

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
    });
    setSaved(true);
    setName("");
    setNotes("");
    setNextVisit("");
    setCategory("health");
    setStatus("identified");
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          {labels.casesTitle}
        </h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full bg-[var(--color-sage-700)] px-4 py-2 text-xs font-extrabold text-white"
        >
          {labels.newCase}
        </button>
      </div>

      {open && (
        <FormCard>
          <input
            type="text"
            placeholder={labels.caseName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label={labels.caseName}
            className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
          />
          <div className="mb-3 grid grid-cols-2 gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CaseCategory)}
              aria-label={labels.caseCategory}
              className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
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
              className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
            >
              {CASE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {labels[STATUS_LABEL_KEYS[s]]}
                </option>
              ))}
            </select>
          </div>
          <input
            type="date"
            value={nextVisit}
            onChange={(e) => setNextVisit(e.target.value)}
            aria-label={labels.nextVisit}
            className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
          />
          <textarea
            placeholder={labels.caseNotes}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-label={labels.caseNotes}
            rows={3}
            className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
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
        <ul className="flex flex-col gap-2">
          {cases.map((c) => (
            <li
              key={c.id}
              className="rounded-2xl bg-[var(--color-surface)] p-4 shadow-1"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <span className="font-bold text-[var(--color-text-primary)]">{c.name}</span>
                <span className="shrink-0 rounded-full bg-[var(--color-sage-100)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-sage-800)]">
                  {labels[STATUS_LABEL_KEYS[c.status]] ?? c.status}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                {labels[CATEGORY_LABEL_KEYS[c.category]] ?? c.category}
              </p>
              {c.nextVisit && (
                <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                  <Calendar className="h-3 w-3" />
                  {labels.nextVisit}: {c.nextVisit}
                </p>
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
