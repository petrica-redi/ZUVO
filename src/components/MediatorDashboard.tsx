"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SurfaceBanner } from "@/components/ui/SurfaceBanner";
import { OperationalCasesTab } from "@/components/mediator/OperationalCasesTab";
import { TasksTab } from "@/components/mediator/TasksTab";
import type { MediatorLabels } from "@/components/mediator/labels";
import { MediatorInboxTab } from "@/components/mediator/MediatorInboxTab";
import { MediatorMoreTab } from "@/components/mediator/MediatorMoreTab";
import { useMediatorWorkspace } from "@/components/mediator/useMediatorWorkspace";
import { useCrossBorder } from "@/components/mediator/useCrossBorder";
import { useOperations } from "@/components/mediator/useOperations";
import { WorkspaceHeader } from "@/components/mediator/WorkspaceHeader";
import { WorkspaceTabs, type TabId } from "@/components/mediator/WorkspaceTabs";
import { bindFieldWorkspace } from "@/lib/mediator/workspace-client";
import type { FieldRole } from "@/lib/field/types";

function tabFromQuery(value: string | null): TabId {
  if (value === "cases" || value === "tasks" || value === "more" || value === "inbox") {
    return value;
  }
  return "inbox";
}

type FieldSessionProp = {
  displayName: string;
  role: FieldRole;
  workspaceId: string;
  countyCode: string;
};

/**
 * Top-level orchestrator for `/mediator`. County selector, four-tab workspace
 * (Inbox · Cases · Tasks · More), KPI indicators, training, and tools.
 */
export function MediatorDashboard({
  labels,
  fieldSession = null,
}: {
  labels: MediatorLabels;
  fieldSession?: FieldSessionProp | null;
}) {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<TabId>(() => tabFromQuery(searchParams.get("tab")));
  const [bound, setBound] = useState(!fieldSession);

  useEffect(() => {
    setTab(tabFromQuery(searchParams.get("tab")));
  }, [searchParams]);

  useEffect(() => {
    if (!fieldSession) {
      setBound(true);
      return;
    }
    bindFieldWorkspace(fieldSession.workspaceId, fieldSession.countyCode);
    setBound(true);
  }, [fieldSession]);

  const workspace = useMediatorWorkspace(bound);
  const operations = useOperations(bound);
  const crossBorder = useCrossBorder(bound);

  useEffect(() => {
    if (fieldSession?.countyCode && !workspace.countyCode) {
      workspace.update({ countyCode: fieldSession.countyCode });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bind once when session present
  }, [fieldSession?.countyCode, bound]);

  return (
    <div>
      <SurfaceBanner
        surface="mediator"
        eyebrow={labels.title}
        title={labels.title}
        lead={labels.subtitle}
        compact
      />
      <p className="mb-3 text-xs text-[var(--color-text-muted)]">{labels.ecHint}</p>

      {(workspace.syncStatus === "offline" || workspace.syncStatus === "error") && (
        <div
          className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950"
          role="status"
        >
          {labels.syncOfflineBanner}
        </div>
      )}

      <WorkspaceHeader
        labels={labels}
        countyCode={workspace.countyCode}
        onChangeCounty={(code) => workspace.update({ countyCode: code })}
        syncStatus={workspace.syncStatus}
      />

      <WorkspaceTabs labels={labels} tab={tab} onChange={setTab} />

      {tab === "inbox" && (
        <MediatorInboxTab
          labels={labels}
          visits={workspace.visits}
          poidsCases={workspace.cases}
          navCases={operations.cases}
          urgentCases={operations.urgentCases.length}
          overdueTasks={operations.overdueTasks.length}
          tasksDueToday={operations.tasksDueToday.length}
          onSaveVisit={(visit) =>
            workspace.update({ visits: [visit, ...workspace.visits] })
          }
          onOpenCases={() => setTab("cases")}
          onOpenTasks={() => setTab("tasks")}
          onOpenMoreSessions={() => setTab("more")}
          onIntakeConverted={() => operations.refresh()}
          onEscalationResolved={() => operations.refresh()}
        />
      )}

      {tab === "cases" && (
        <OperationalCasesTab
          cases={operations.cases}
          referrals={operations.referrals}
          appointments={operations.appointments}
          onCreateCase={operations.createCase}
          onUpdateStatus={operations.updateCaseStatus}
          onCreateReferral={operations.createReferral}
          onCreateAppointment={operations.createAppointment}
          onConfirmAppointment={operations.confirmAppointment}
          onRecordAttendance={operations.recordAttendance}
          onRefreshProviderData={operations.refreshProviderData}
        />
      )}

      {tab === "tasks" && (
        <TasksTab
          tasks={operations.tasks}
          cases={operations.cases}
          onCreateTask={operations.createTask}
          onCompleteTask={operations.completeTask}
        />
      )}

      {tab === "more" && (
        <MediatorMoreTab
          labels={labels}
          countyCode={workspace.countyCode}
          poidsCases={workspace.cases}
          visits={workspace.visits}
          sessions={workspace.sessions}
          training={workspace.training}
          navCases={operations.cases}
          crossBorder={crossBorder}
          onSavePoidsCase={(record) =>
            workspace.update({ cases: [record, ...workspace.cases] })
          }
          onSaveSession={(record) =>
            workspace.update({ sessions: [record, ...workspace.sessions] })
          }
          onToggleTraining={(moduleId, completed) => {
            const without = workspace.training.filter((p) => p.moduleId !== moduleId);
            workspace.update({
              training: completed
                ? [{ moduleId, completedAt: new Date().toISOString() }, ...without]
                : without,
            });
          }}
        />
      )}
    </div>
  );
}
