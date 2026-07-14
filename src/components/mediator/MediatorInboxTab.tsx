"use client";

import type { MediatorCase, MediatorVisit } from "@/lib/mediator/types";
import type { NavigationCase } from "@/lib/operations/types";
import type { MediatorLabels } from "./labels";
import { MediatorStartPanel } from "./MediatorStartPanel";
import { OverviewTab } from "./OverviewTab";
import { IntakeQueueTab } from "./IntakeQueueTab";
import { EscalationPanel } from "./EscalationPanel";
import { QualityPanel } from "./QualityPanel";

export function MediatorInboxTab({
  labels,
  visits,
  poidsCases,
  navCases,
  urgentCases,
  overdueTasks,
  tasksDueToday,
  onSaveVisit,
  onOpenCases,
  onOpenTasks,
  onOpenMoreSessions,
  onIntakeConverted,
  onEscalationResolved,
}: {
  labels: MediatorLabels;
  visits: MediatorVisit[];
  poidsCases: MediatorCase[];
  navCases: NavigationCase[];
  urgentCases: number;
  overdueTasks: number;
  tasksDueToday: number;
  onSaveVisit: (visit: MediatorVisit) => void;
  onOpenCases: () => void;
  onOpenTasks: () => void;
  onOpenMoreSessions: () => void;
  onIntakeConverted: () => void;
  onEscalationResolved: () => void;
}) {
  return (
    <>
      <MediatorStartPanel
        cases={navCases}
        onOpenCases={onOpenCases}
        onOpenTasks={onOpenTasks}
        onOpenHelp={() => {
          window.open("/help", "_blank", "noopener");
        }}
      />

      <IntakeQueueTab onConverted={onIntakeConverted} />

      <div className="my-6 border-t border-[var(--color-sage-200)]" />

      <EscalationPanel onResolved={onEscalationResolved} />

      <div className="my-6 border-t border-[var(--color-sage-200)]" />

      <OverviewTab
        labels={labels}
        visits={visits}
        cases={poidsCases}
        navCases={navCases}
        urgentCases={urgentCases}
        overdueTasks={overdueTasks}
        tasksDueToday={tasksDueToday}
        onSaveVisit={onSaveVisit}
        onGoToCases={onOpenCases}
        onGoToTasks={onOpenTasks}
        onGoToSessions={onOpenMoreSessions}
      />

      <QualityPanel
        title={labels.qualityTitle}
        subtitle={labels.qualitySubtitle}
        emptyMessage={labels.qualityEmpty}
        scanLabel={labels.qualityScan}
        resolveLabel={labels.qualityResolve}
        flagTypeLabels={{
          missing_outcome: labels.qualityFlag_missing_outcome,
          stale_case: labels.qualityFlag_stale_case,
          missing_consent: labels.qualityFlag_missing_consent,
          duplicate_entry: labels.qualityFlag_duplicate_entry,
          incomplete_barriers: labels.qualityFlag_incomplete_barriers,
          overdue_followup: labels.qualityFlag_overdue_followup,
          no_recent_contact: labels.qualityFlag_no_recent_contact,
        }}
        severityLabels={{
          info: labels.qualitySeverity_info,
          warning: labels.qualitySeverity_warning,
          critical: labels.qualitySeverity_critical,
        }}
        statusLabels={{
          open: labels.qualityStatus_open,
          acknowledged: labels.qualityStatus_acknowledged,
          resolved: labels.qualityStatus_resolved,
          dismissed: labels.qualityStatus_dismissed,
        }}
      />
    </>
  );
}
