"use client";

import { useState } from "react";
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

/**
 * Top-level orchestrator for `/mediator`. County selector, four-tab workspace
 * (Inbox · Cases · Tasks · More), KPI indicators, training, and tools.
 */
export function MediatorDashboard({ labels }: { labels: MediatorLabels }) {
  const [tab, setTab] = useState<TabId>("inbox");
  const workspace = useMediatorWorkspace(true);
  const operations = useOperations(true);
  const crossBorder = useCrossBorder(true);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-[var(--color-text-primary)]">
        {labels.title}
      </h1>
      <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
        {labels.subtitle}
      </p>
      <p className="mb-3 text-xs text-[var(--color-text-muted)]">{labels.ecHint}</p>

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
