"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AlertTriangle,
  ClipboardList,
  FolderOpen,
  Footprints,
  ListTodo,
  Presentation,
  Users,
} from "lucide-react";
import type { MediatorCase, MediatorVisit } from "@/lib/mediator/types";
import type { NavigationCase } from "@/lib/operations/types";
import type { MediatorLabels } from "./labels";
import {
  STATUS_LABEL_KEYS,
  URGENCY_LABEL_KEYS,
} from "@/lib/operations/constants";
import {
  StatusBadge,
  caseStatusTone,
  urgencyTone,
} from "@/components/operations/StatusBadge";
import { TimelineStrip } from "@/components/operations/TimelineStrip";
import { ActionRow, FormCard, SaveButton, StatCard } from "./parts";

function isThisMonth(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function OverviewTab({
  labels,
  visits,
  cases,
  navCases,
  urgentCases,
  overdueTasks,
  tasksDueToday,
  onSaveVisit,
  onGoToCases,
  onGoToTasks,
  onGoToSessions,
}: {
  labels: MediatorLabels;
  visits: MediatorVisit[];
  cases: MediatorCase[];
  navCases: NavigationCase[];
  urgentCases: number;
  overdueTasks: number;
  tasksDueToday: number;
  onSaveVisit: (visit: MediatorVisit) => void;
  onGoToCases: () => void;
  onGoToTasks: () => void;
  onGoToSessions: () => void;
}) {
  const t = useTranslations("operations");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const phaseLabels = {
    intake: t("timelineIntake"),
    assess: t("timelineAssess"),
    access: t("timelineAccess"),
    coordination: t("timelineCoordination"),
    resolved: t("timelineResolved"),
  };

  const openCases = useMemo(
    () =>
      navCases.filter(
        (c) => !["completed", "closed_incomplete", "cancelled"].includes(c.status),
      ).length,
    [navCases],
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

  const priorityNavCases = useMemo(
    () =>
      navCases
        .filter(
          (c) =>
            !["completed", "closed_incomplete", "cancelled"].includes(c.status) &&
            (c.urgency === "urgent" ||
              c.urgency === "emergency" ||
              c.urgency === "priority"),
        )
        .slice(0, 3),
    [navCases],
  );

  const fieldClass =
    "min-h-[44px] w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-sage-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-200)]";

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

      {(urgentCases > 0 || overdueTasks > 0 || tasksDueToday > 0) && (
        <div
          className="mb-6 rounded-2xl border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] p-4 shadow-1"
          role="status"
        >
          <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[var(--color-warning-text)]">
            {t("attentionNeeded")}
          </p>
          <div className="flex flex-wrap gap-2">
            {urgentCases > 0 && (
              <button
                type="button"
                onClick={onGoToCases}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[var(--color-warning-border)] bg-[var(--color-surface)] px-3 py-2 text-left transition-transform active:scale-[0.98]"
              >
                <StatusBadge
                  label={String(urgentCases)}
                  tone="danger"
                  size="sm"
                />
                <span className="text-xs font-semibold text-[var(--color-warning-text)]">
                  {labels.urgentCases}
                </span>
              </button>
            )}
            {tasksDueToday > 0 && (
              <button
                type="button"
                onClick={onGoToTasks}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[var(--color-warning-border)] bg-[var(--color-surface)] px-3 py-2 text-left transition-transform active:scale-[0.98]"
              >
                <StatusBadge
                  label={String(tasksDueToday)}
                  tone="info"
                  size="sm"
                />
                <span className="text-xs font-semibold text-[var(--color-warning-text)]">
                  {labels.tasksDueToday}
                </span>
              </button>
            )}
            {overdueTasks > 0 && (
              <button
                type="button"
                onClick={onGoToTasks}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[var(--color-warning-border)] bg-[var(--color-surface)] px-3 py-2 text-left transition-transform active:scale-[0.98]"
              >
                <StatusBadge
                  label={String(overdueTasks)}
                  tone="danger"
                  size="sm"
                />
                <span className="text-xs font-semibold text-[var(--color-warning-text)]">
                  {labels.overdueTasks}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {priorityNavCases.length > 0 && (
        <>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
            <FolderOpen className="h-4 w-4" aria-hidden />
            {t("priorityCasesTitle")}
          </h2>
          <ul className="mb-6 flex flex-col gap-2">
            {priorityNavCases.map((c) => (
              <li
                key={c.id}
                className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-1"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-bold text-[var(--color-text-primary)]">
                      {c.beneficiaryPseudonym}
                    </span>
                    <p className="font-mono text-[10px] text-[var(--color-text-muted)]">
                      {c.caseNumber}
                    </p>
                  </div>
                  <StatusBadge
                    label={t(
                      URGENCY_LABEL_KEYS[c.urgency].replace("operations.", ""),
                    )}
                    tone={urgencyTone(c.urgency)}
                    size="sm"
                  />
                </div>
                <TimelineStrip
                  status={c.status}
                  phaseLabels={phaseLabels}
                  ariaLabel={t("timelineAriaLabel")}
                  className="mb-2"
                />
                <StatusBadge
                  label={t(
                    STATUS_LABEL_KEYS[c.status].replace("operations.", ""),
                  )}
                  tone={caseStatusTone(c.status)}
                  size="sm"
                />
              </li>
            ))}
          </ul>
        </>
      )}

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
          icon={ListTodo}
          label={labels.tabTasks}
          onClick={onGoToTasks}
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
          <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
            {labels.memberName}
          </label>
          <input
            type="text"
            placeholder={labels.memberName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label={labels.memberName}
            className={`mb-3 ${fieldClass}`}
          />
          <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
            {labels.notes}
          </label>
          <textarea
            placeholder={labels.notes}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-label={labels.notes}
            rows={3}
            className={`mb-4 ${fieldClass} min-h-[88px]`}
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

      <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
        <ClipboardList className="h-4 w-4" aria-hidden />
        {labels.recentActivity}
      </h2>
      {visits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-sage-200)] bg-[var(--color-surface)] p-8 text-center shadow-1">
          <Footprints
            className="mx-auto mb-3 h-10 w-10 text-[var(--color-sage-400)]"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-sm text-[var(--color-text-muted)]">
            {labels.noActivity}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {visits.slice(0, 10).map((v) => (
            <li
              key={v.id}
              className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-1"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-bold text-[var(--color-text-primary)]">
                  {v.memberName}
                </span>
                <time
                  dateTime={v.visitDate}
                  className="text-xs text-[var(--color-text-muted)]"
                >
                  {new Date(v.visitDate).toLocaleDateString()}
                </time>
              </div>
              {v.notes && (
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {v.notes}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
