"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, ClipboardList, Plus } from "lucide-react";
import { TASK_TYPES } from "@/lib/operations/constants";
import type { OperationTask } from "@/lib/operations/types";
import type { CreateTaskInput } from "@/lib/operations/types";
import type { NavigationCase } from "@/lib/operations/types";
import {
  StatusBadge,
  taskStatusTone,
} from "@/components/operations/StatusBadge";
import { FormCard, SaveButton } from "./parts";

type Filter = "all" | "today" | "overdue";

const fieldClass =
  "min-h-[44px] w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-sage-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-200)]";

export function TasksTab({
  tasks,
  cases,
  onCreateTask,
  onCompleteTask,
}: {
  tasks: OperationTask[];
  cases: NavigationCase[];
  onCreateTask: (input: CreateTaskInput) => Promise<OperationTask>;
  onCompleteTask: (taskId: string) => Promise<void>;
}) {
  const t = useTranslations("operations");
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState<(typeof TASK_TYPES)[number]>("call_beneficiary");
  const [caseId, setCaseId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saved, setSaved] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const activeTasks = useMemo(
    () => tasks.filter((task) => !["completed", "cancelled"].includes(task.status)),
    [tasks],
  );

  const counts = useMemo(
    () => ({
      all: activeTasks.length,
      today: activeTasks.filter((task) => task.dueDate === today).length,
      overdue: activeTasks.filter((task) => task.dueDate && task.dueDate < today)
        .length,
    }),
    [activeTasks, today],
  );

  const filtered = useMemo(() => {
    if (filter === "today") return activeTasks.filter((task) => task.dueDate === today);
    if (filter === "overdue")
      return activeTasks.filter((task) => task.dueDate && task.dueDate < today);
    return activeTasks;
  }, [activeTasks, filter, today]);

  const submit = async () => {
    if (!title.trim()) return;
    await onCreateTask({
      title: title.trim(),
      taskType,
      caseId: caseId || undefined,
      dueDate: dueDate || undefined,
    });
    setSaved(true);
    setTitle("");
    setCaseId("");
    setDueDate("");
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 1500);
  };

  const caseLabel = (id?: string) => {
    if (!id) return null;
    const c = cases.find((x) => x.id === id);
    return c ? `${c.caseNumber} — ${c.beneficiaryPseudonym}` : id.slice(0, 8);
  };

  const taskStatusLabel = (status: OperationTask["status"]) =>
    t(`taskStatus_${status}`);

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            {t("tasksTitle")}
          </h2>
          {activeTasks.length > 0 && (
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              {t("tasksActiveCount", { count: activeTasks.length })}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[var(--color-sage-700)] px-4 py-2.5 text-xs font-extrabold text-white shadow-1 transition-transform active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {t("addTask")}
        </button>
      </div>

      <div
        className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-[var(--color-surface-subtle)] p-1"
        role="tablist"
        aria-label={t("tasksTitle")}
      >
        {(["all", "today", "overdue"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-extrabold transition-colors ${
              filter === f
                ? "bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-1"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            {t(`filter_${f}`)}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                filter === f
                  ? "bg-[var(--color-sage-100)] text-[var(--color-sage-800)]"
                  : "bg-[var(--color-border-subtle)] text-[var(--color-text-muted)]"
              }`}
            >
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {open && (
        <FormCard>
          <h3 className="mb-4 text-base font-bold text-[var(--color-text-primary)]">
            {t("addTask")}
          </h3>
          <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
            {t("taskTitle")}
          </label>
          <input
            type="text"
            placeholder={t("taskTitle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label={t("taskTitle")}
            className={`mb-3 ${fieldClass}`}
          />
          <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
                {t("taskType")}
              </label>
              <select
                value={taskType}
                onChange={(e) =>
                  setTaskType(e.target.value as (typeof TASK_TYPES)[number])
                }
                aria-label={t("taskType")}
                className={fieldClass}
              >
                {TASK_TYPES.map((tt) => (
                  <option key={tt} value={tt}>
                    {t(`taskType_${tt}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
                {t("dueDate")}
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                aria-label={t("dueDate")}
                className={fieldClass}
              />
            </div>
          </div>
          {cases.length > 0 && (
            <>
              <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
                {t("linkedCase")}
              </label>
              <select
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                aria-label={t("linkedCase")}
                className={`mb-4 ${fieldClass}`}
              >
                <option value="">{t("noLinkedCase")}</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.caseNumber} — {c.beneficiaryPseudonym}
                  </option>
                ))}
              </select>
            </>
          )}
          <SaveButton
            saved={saved}
            savedLabel={t("taskSaved")}
            saveLabel={t("saveTask")}
            disabled={!title.trim()}
            onClick={() => void submit()}
          />
        </FormCard>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-sage-200)] bg-[var(--color-surface)] p-8 text-center shadow-1">
          <ClipboardList
            className="mx-auto mb-3 h-10 w-10 text-[var(--color-sage-400)]"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="mb-1 text-sm font-semibold text-[var(--color-text-primary)]">
            {filter === "overdue"
              ? t("emptyTasksOverdueTitle")
              : filter === "today"
                ? t("emptyTasksTodayTitle")
                : t("emptyTasksTitle")}
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">{t("noTasks")}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((task) => {
            const overdue = Boolean(task.dueDate && task.dueDate < today);
            const dueToday = task.dueDate === today;
            return (
              <li
                key={task.id}
                className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-1"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <span className="font-bold leading-snug text-[var(--color-text-primary)]">
                    {task.title.startsWith("operations.")
                      ? t(task.title.replace("operations.", ""))
                      : task.title}
                  </span>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusBadge
                      label={taskStatusLabel(task.status)}
                      tone={taskStatusTone(task.status, overdue)}
                      size="sm"
                    />
                    {overdue && (
                      <StatusBadge
                        label={t("filter_overdue")}
                        tone="danger"
                        size="sm"
                      />
                    )}
                    {dueToday && !overdue && (
                      <StatusBadge
                        label={t("filter_today")}
                        tone="warning"
                        size="sm"
                      />
                    )}
                  </div>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {t(`taskType_${task.taskType}`)}
                  {task.caseId && ` · ${caseLabel(task.caseId)}`}
                  {task.dueDate && ` · ${t("dueDate")}: ${task.dueDate}`}
                </p>
                {task.description && (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {task.description}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => void onCompleteTask(task.id)}
                  className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--color-success-accent)] bg-[var(--color-success-bg)] px-4 py-2.5 text-xs font-bold text-[var(--color-success-text)] transition-transform active:scale-[0.98]"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  {t("completeTask")}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
