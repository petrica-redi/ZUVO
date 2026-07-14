"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { NavigationCase, OperationTask } from "@/lib/operations/types";
import type { CreateCaseInput, CreateTaskInput } from "@/lib/operations/types";
import {
  listLocalCases,
  listLocalTasks,
} from "@/lib/operations/local-store";
import {
  patchCaseStatus,
  patchTaskComplete,
  pushCase,
  pushTask,
  syncOperations,
  type OperationsSyncStatus,
} from "@/lib/operations/operations-client";

export type OperationsState = {
  cases: NavigationCase[];
  tasks: OperationTask[];
  syncStatus: OperationsSyncStatus;
  urgentCases: NavigationCase[];
  overdueTasks: OperationTask[];
  tasksDueToday: OperationTask[];
  createCase: (input: CreateCaseInput) => Promise<NavigationCase>;
  createTask: (input: CreateTaskInput) => Promise<OperationTask>;
  updateCaseStatus: (
    caseId: string,
    status: NavigationCase["status"],
  ) => Promise<void>;
  completeTask: (taskId: string, evidence?: string) => Promise<void>;
  refresh: () => void;
};

export function useOperations(enabled: boolean): OperationsState {
  const [cases, setCases] = useState<NavigationCase[]>([]);
  const [tasks, setTasks] = useState<OperationTask[]>([]);
  const [syncStatus, setSyncStatus] = useState<OperationsSyncStatus>("idle");

  const loadLocal = useCallback(() => {
    setCases(listLocalCases());
    setTasks(listLocalTasks());
  }, []);

  const refresh = useCallback(() => {
    if (!enabled) return;
    setSyncStatus("syncing");
    void syncOperations().then((result) => {
      setCases(result.cases);
      setTasks(result.tasks);
      setSyncStatus(result.status);
    });
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    loadLocal();
    refresh();
  }, [enabled, loadLocal, refresh]);

  const createCase = useCallback(async (input: CreateCaseInput) => {
    const navCase = await pushCase(input);
    setCases((prev) => [navCase, ...prev.filter((c) => c.id !== navCase.id)]);
    setTasks(listLocalTasks());
    return navCase;
  }, []);

  const createTask = useCallback(async (input: CreateTaskInput) => {
    const task = await pushTask(input);
    setTasks((prev) => [task, ...prev.filter((t) => t.id !== task.id)]);
    return task;
  }, []);

  const updateCaseStatus = useCallback(
    async (caseId: string, status: NavigationCase["status"]) => {
      const updated = await patchCaseStatus(caseId, status);
      if (updated) {
        setCases((prev) =>
          prev.map((c) => (c.id === caseId ? updated : c)),
        );
      }
    },
    [],
  );

  const completeTask = useCallback(async (taskId: string, evidence?: string) => {
    const updated = await patchTaskComplete(taskId, evidence);
    if (updated) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updated : t)),
      );
    }
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const urgentCases = useMemo(
    () =>
      cases.filter(
        (c) =>
          ["urgent", "emergency"].includes(c.urgency) &&
          !["completed", "closed_incomplete", "cancelled"].includes(c.status),
      ),
    [cases],
  );

  const overdueTasks = useMemo(
    () =>
      tasks.filter(
        (t) =>
          t.dueDate &&
          t.dueDate < today &&
          !["completed", "cancelled"].includes(t.status),
      ),
    [tasks, today],
  );

  const tasksDueToday = useMemo(
    () =>
      tasks.filter(
        (t) => t.dueDate === today && !["completed", "cancelled"].includes(t.status),
      ),
    [tasks, today],
  );

  return {
    cases,
    tasks,
    syncStatus,
    urgentCases,
    overdueTasks,
    tasksDueToday,
    createCase,
    createTask,
    updateCaseStatus,
    completeTask,
    refresh,
  };
}
