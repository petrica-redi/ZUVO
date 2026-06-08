"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ClipboardList,
  FolderOpen,
  Footprints,
  Presentation,
  Users,
} from "lucide-react";
import type { MediatorCase, MediatorVisit } from "@/lib/mediator/types";
import type { MediatorLabels } from "./labels";
import { ActionRow, EmptyState, FormCard, SaveButton, StatCard } from "./parts";

function isThisMonth(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function OverviewTab({
  labels,
  visits,
  cases,
  onSaveVisit,
  onGoToCases,
  onGoToSessions,
}: {
  labels: MediatorLabels;
  visits: MediatorVisit[];
  cases: MediatorCase[];
  onSaveVisit: (visit: MediatorVisit) => void;
  onGoToCases: () => void;
  onGoToSessions: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [consentAttested, setConsentAttested] = useState(false);

  const openCases = useMemo(
    () => cases.filter((c) => c.status !== "closed").length,
    [cases],
  );
  const visitsThisMonth = useMemo(
    () => visits.filter((v) => isThisMonth(v.visitDate)).length,
    [visits],
  );
  const peopleFollowed = useMemo(() => {
    const names = new Set<string>();
    for (const v of visits) if (v.memberName) names.add(v.memberName);
    for (const c of cases) if (c.name) names.add(c.name);
    return names.size;
  }, [visits, cases]);

  const submit = () => {
    if (!name.trim() || !consentAttested) return;
    onSaveVisit({
      id: crypto.randomUUID(),
      memberName: name.trim(),
      notes: notes.trim(),
      visitDate: new Date().toISOString(),
    });
    setSaved(true);
    setName("");
    setNotes("");
    setConsentAttested(false);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <div className="mb-6 grid grid-cols-3 gap-2">
        <StatCard
          icon={Users}
          value={String(peopleFollowed)}
          label={labels.communityMembers}
          tone="info"
        />
        <StatCard
          icon={Footprints}
          value={String(visitsThisMonth)}
          label={labels.logsThisMonth}
          tone="success"
        />
        <StatCard
          icon={AlertTriangle}
          value={String(openCases)}
          label={labels.openCases}
          tone="warning"
        />
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        {labels.quickActions}
      </h2>
      <div className="mb-6 flex flex-col gap-2">
        <ActionRow
          icon={Footprints}
          label={labels.logVisit}
          onClick={() => setOpen((v) => !v)}
        />
        <ActionRow
          icon={FolderOpen}
          label={labels.newCase}
          onClick={onGoToCases}
        />
        <ActionRow
          icon={Presentation}
          label={labels.newSession}
          onClick={onGoToSessions}
        />
      </div>

      {open && (
        <FormCard>
          <h3 className="mb-2 text-base font-bold text-[var(--color-text-primary)]">
            {labels.logVisit}
          </h3>
          {/* Data minimisation reminder — Mediator Operating Policy s.4 */}
          <p className="mb-3 text-xs text-[var(--color-text-muted)] leading-relaxed">
            {labels.dataMinimisationNote}
          </p>
          <input
            type="text"
            placeholder={labels.memberName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label={labels.memberName}
            className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
          />
          <textarea
            placeholder={labels.notes}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-label={labels.notes}
            rows={3}
            className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
          />
          {/* Consent attestation — Mediator Operating Policy s.3.3 */}
          <label className="mb-3 flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={consentAttested}
              onChange={(e) => setConsentAttested(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-[var(--color-border-default)]"
            />
            <span className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              {labels.consentAttestation}
            </span>
          </label>
          <SaveButton
            saved={saved}
            savedLabel={labels.visitSaved}
            saveLabel={labels.saveVisit}
            disabled={!name.trim() || !consentAttested}
            onClick={submit}
          />
        </FormCard>
      )}

      <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
        <ClipboardList className="h-4 w-4" />
        {labels.recentActivity}
      </h2>
      {visits.length === 0 ? (
        <EmptyState message={labels.noActivity} />
      ) : (
        <ul className="flex flex-col gap-2">
          {visits.slice(0, 10).map((v) => (
            <li
              key={v.id}
              className="rounded-2xl bg-[var(--color-surface)] p-4 shadow-1"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-bold text-[var(--color-text-primary)]">
                  {v.memberName}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {new Date(v.visitDate).toLocaleDateString()}
                </span>
              </div>
              {v.notes && (
                <p className="text-sm text-[var(--color-text-secondary)]">{v.notes}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
