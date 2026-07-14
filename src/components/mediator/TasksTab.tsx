"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { TASK_TYPES } from "@/lib/operations/constants";
import type { OperationTask } from "@/lib/operations/types";
import type { CreateTaskInput } from "@/lib/operations/types";
import type { NavigationCase } from "@/lib/operations/types";
import { EmptyState, FormCard, SaveButton } from "./parts";

type Filter = "all" | "today" | "overdue";

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

  const filtered = useMemo(() => {
    const active = tasks.filter((t) => !["completed", "cancelled"].includes(t.status));
    if (filter === "today") return active.filter((t) => t.dueDate === today);
    if (filter === "overdue")
      return active.filter((t) => t.dueDate && t.dueDate < today);
    return active;
  }, [tasks, filter, today]);

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

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          {t("tasksTitle")}
        </h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full bg-[var(--color-sage-700)] px-4 py-2 text-xs font-extrabold text-white"
        >
          {t("addTask")}
        </button>
      </div>

      <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-[var(--color-surface-subtle)] p-1">
        {(["all", "today", "overdue"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`min-h-[40px] flex-1 rounded-lg px-2 py-2 text-[11px] font-extrabold ${
              filter === f
                ? "bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-1"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            {t(`filter_${f}`)}
          </button>
        ))}
      </div>

      {open && (
        <FormCard>
          <input
            type="text"
            placeholder={t("taskTitle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label={t("taskTitle")}
            className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
          />
          <div className="mb-3 grid grid-cols-2 gap-2">
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value as (typeof TASK_TYPES)[number])}
              aria-label={t("taskType")}
              className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
            >
              {TASK_TYPES.map((tt) => (
                <option key={tt} value={tt}>
                  {t(`taskType_${tt}`)}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label={t("dueDate")}
              className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
            />
          </div>
          {cases.length > 0 && (
            <select
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              aria-label={t("linkedCase")}
              className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
            >
              <option value="">{t("noLinkedCase")}</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} — {c.beneficiaryPseudonym}
                </option>
              ))}
            </select>
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
        <EmptyState message={t("noTasks")} />
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((task) => {
            const overdue = task.dueDate && task.dueDate < today;
            return (
              <li
                key={task.id}
                className="rounded-2xl bg-[var(--color-surface)] p-4 shadow-1"
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <span className="font-bold text-[var(--color-text-primary)]">
                    {task.title.startsWith("operations.") ? t(task.title.replace("operations.", "")) : task.title}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                      overdue
                        ? "bg-[var(--color-danger-bg)] text-[var(--color-danger-text)]"
                        : "bg-[var(--color-sage-100)] text-[var(--color-sage-800)]"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {t(`taskType_${task.taskType}`)}
                  {task.caseId && ` · ${caseLabel(task.caseId)}`}
                  {task.dueDate && ` · ${t("dueDate")}: ${task.dueDate}`}
                </p>
                {task.description && (
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {task.description}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => void onCompleteTask(task.id)}
                  className="mt-3 flex items-center gap-1 rounded-full border border-[var(--color-success-accent)] px-3 py-1.5 text-[11px] font-bold text-[var(--color-success-text)]"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
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
