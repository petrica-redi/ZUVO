"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  NavigationCase,
  OperationTask,
  Referral,
  Appointment,
} from "@/lib/operations/types";
import type {
  CreateCaseInput,
  CreateTaskInput,
  CreateReferralInput,
  CreateAppointmentInput,
} from "@/lib/operations/types";
import type { AttendanceOutcome } from "@/lib/operations/constants";
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
  fetchReferrals,
  fetchAppointments,
  pushReferral,
  pushAppointment,
  patchAppointmentConfirm,
  pushAttendance,
  type OperationsSyncStatus,
} from "@/lib/operations/operations-client";

export type OperationsState = {
  cases: NavigationCase[];
  tasks: OperationTask[];
  referrals: Referral[];
  appointments: Appointment[];
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
  createReferral: (input: CreateReferralInput) => Promise<Referral | null>;
  createAppointment: (input: CreateAppointmentInput) => Promise<Appointment | null>;
  confirmAppointment: (appointmentId: string) => Promise<void>;
  recordAttendance: (
    appointmentId: string,
    outcome: AttendanceOutcome,
    followUpRequired: boolean,
    notes?: string,
  ) => Promise<void>;
  refresh: () => void;
  refreshProviderData: (caseId?: string) => Promise<void>;
};

function initialOperationsState(enabled: boolean) {
  if (!enabled || typeof window === "undefined") {
    return { cases: [] as NavigationCase[], tasks: [] as OperationTask[] };
  }
  return { cases: listLocalCases(), tasks: listLocalTasks() };
}

export function useOperations(enabled: boolean): OperationsState {
  const [cases, setCases] = useState<NavigationCase[]>(
    () => initialOperationsState(enabled).cases,
  );
  const [tasks, setTasks] = useState<OperationTask[]>(
    () => initialOperationsState(enabled).tasks,
  );
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [syncStatus, setSyncStatus] = useState<OperationsSyncStatus>("idle");

  const refreshProviderData = useCallback(async (caseId?: string) => {
    const [r, a] = await Promise.all([
      fetchReferrals(caseId),
      fetchAppointments(caseId),
    ]);
    if (!caseId) {
      setReferrals(r);
      setAppointments(a);
    } else {
      setReferrals((prev) => {
        const others = prev.filter((x) => x.caseId !== caseId);
        return [...r, ...others];
      });
      setAppointments((prev) => {
        const others = prev.filter((x) => x.caseId !== caseId);
        return [...a, ...others];
      });
    }
  }, []);

  const refresh = useCallback(() => {
    if (!enabled) return;
    setSyncStatus("syncing");
    void syncOperations().then((result) => {
      setCases(result.cases);
      setTasks(result.tasks);
      setSyncStatus(result.status);
    });
    void refreshProviderData();
  }, [enabled, refreshProviderData]);

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [enabled, refresh]);

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

  const createReferral = useCallback(async (input: CreateReferralInput) => {
    const referral = await pushReferral(input);
    if (referral) {
      setReferrals((prev) => [referral, ...prev.filter((r) => r.id !== referral.id)]);
      await refreshProviderData(input.caseId);
    }
    return referral;
  }, [refreshProviderData]);

  const createAppointment = useCallback(async (input: CreateAppointmentInput) => {
    const appointment = await pushAppointment(input);
    if (appointment) {
      setAppointments((prev) => [
        appointment,
        ...prev.filter((a) => a.id !== appointment.id),
      ]);
      await refreshProviderData(input.caseId);
    }
    return appointment;
  }, [refreshProviderData]);

  const confirmAppointment = useCallback(async (appointmentId: string) => {
    await patchAppointmentConfirm(appointmentId);
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId ? { ...a, status: "confirmed" } : a,
      ),
    );
  }, []);

  const recordAttendance = useCallback(
    async (
      appointmentId: string,
      outcome: AttendanceOutcome,
      followUpRequired: boolean,
      notes?: string,
    ) => {
      await pushAttendance(appointmentId, outcome, followUpRequired, notes);
      const status =
        outcome === "attended" || outcome === "partial"
          ? "completed"
          : outcome === "missed" || outcome === "no_show"
            ? "missed"
            : "cancelled";
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status } : a)),
      );
    },
    [],
  );

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
    referrals,
    appointments,
    syncStatus,
    urgentCases,
    overdueTasks,
    tasksDueToday,
    createCase,
    createTask,
    updateCaseStatus,
    completeTask,
    createReferral,
    createAppointment,
    confirmAppointment,
    recordAttendance,
    refresh,
    refreshProviderData,
  };
}
