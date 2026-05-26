"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { CasesTab } from "@/components/mediator/CasesTab";
import { IndicatorsTab } from "@/components/mediator/IndicatorsTab";
import type { MediatorLabels } from "@/components/mediator/labels";
import { OverviewTab } from "@/components/mediator/OverviewTab";
import { SessionsTab } from "@/components/mediator/SessionsTab";
import { ToolsTab } from "@/components/mediator/ToolsTab";
import { TrainingTab } from "@/components/mediator/TrainingTab";
import { useMediatorWorkspace } from "@/components/mediator/useMediatorWorkspace";
import { WorkspaceHeader } from "@/components/mediator/WorkspaceHeader";
import { WorkspaceTabs, type TabId } from "@/components/mediator/WorkspaceTabs";

/**
 * Top-level orchestrator for `/mediator`. County selector, tabbed workspace,
 * KPI indicators, training, and tools. Opens directly — no PIN gate.
 */
export function MediatorDashboard({ labels }: { labels: MediatorLabels }) {
  const locale = useLocale();
  const [tab, setTab] = useState<TabId>("overview");
  const workspace = useMediatorWorkspace(true);

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

      {tab === "overview" && (
        <OverviewTab
          labels={labels}
          visits={workspace.visits}
          cases={workspace.cases}
          onSaveVisit={(visit) =>
            workspace.update({ visits: [visit, ...workspace.visits] })
          }
          onGoToCases={() => setTab("cases")}
          onGoToSessions={() => setTab("sessions")}
        />
      )}

      {tab === "cases" && (
        <CasesTab
          labels={labels}
          cases={workspace.cases}
          onSave={(record) =>
            workspace.update({ cases: [record, ...workspace.cases] })
          }
        />
      )}

      {tab === "sessions" && (
        <SessionsTab
          labels={labels}
          sessions={workspace.sessions}
          onSave={(record) =>
            workspace.update({ sessions: [record, ...workspace.sessions] })
          }
        />
      )}

      {tab === "indicators" && (
        <IndicatorsTab
          labels={labels}
          cases={workspace.cases}
          visits={workspace.visits}
          sessions={workspace.sessions}
        />
      )}

      {tab === "training" && (
        <TrainingTab
          labels={labels}
          training={workspace.training}
          onToggleModule={(moduleId, completed) => {
            const without = workspace.training.filter(
              (p) => p.moduleId !== moduleId,
            );
            workspace.update({
              training: completed
                ? [{ moduleId, completedAt: new Date().toISOString() }, ...without]
                : without,
            });
          }}
        />
      )}

      {tab === "tools" && (
        <ToolsTab
          labels={labels}
          locale={locale}
          countyCode={workspace.countyCode}
          cases={workspace.cases}
          visits={workspace.visits}
          sessions={workspace.sessions}
        />
      )}
    </div>
  );
}
