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
import {
  ActionRow,
  EmptyState,
  FormCard,
  SaveButton,
  SectionTitle,
  StatCard,
  fieldClass,
} from "./parts";

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
    if (!name.trim()) return;
    onSaveVisit({
      id: crypto.randomUUID(),
      memberName: name.trim(),
      notes: notes.trim(),
      visitDate: new Date().toISOString(),
    });
    setSaved(true);
    setName("");
    setNotes("");
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

      <SectionTitle>{labels.quickActions}</SectionTitle>
      <div className="mb-6 grid gap-2 md:grid-cols-3">
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
          <h3 className="mb-3 text-base font-bold text-[var(--color-text-primary)]">
            {labels.logVisit}
          </h3>
          <input
            type="text"
            placeholder={labels.memberName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label={labels.memberName}
            className={`mb-3 ${fieldClass}`}
          />
          <textarea
            placeholder={labels.notes}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-label={labels.notes}
            rows={3}
            className={`mb-3 ${fieldClass}`}
          />
          <SaveButton
            saved={saved}
            savedLabel={labels.visitSaved}
            saveLabel={labels.saveVisit}
            disabled={!name.trim()}
            onClick={submit}
          />
        </FormCard>
      )}

      <SectionTitle>
        <span className="inline-flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          {labels.recentActivity}
        </span>
      </SectionTitle>
      {visits.length === 0 ? (
        <EmptyState message={labels.noActivity} />
      ) : (
        <ul className="flex flex-col gap-3">
          {visits.slice(0, 10).map((v) => (
            <li
              key={v.id}
              className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-[0_10px_35px_-24px_rgba(15,23,42,0.28)]"
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
