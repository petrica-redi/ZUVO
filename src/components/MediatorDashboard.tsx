"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Activity, AlertTriangle, Footprints, Users } from "lucide-react";
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

function isThisMonth(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

/**
 * Top-level orchestrator for `/mediator`. County selector, tabbed workspace,
 * KPI indicators, training, and tools. Opens directly — no PIN gate.
 */
export function MediatorDashboard({ labels }: { labels: MediatorLabels }) {
  const locale = useLocale();
  const [tab, setTab] = useState<TabId>("overview");
  const workspace = useMediatorWorkspace(true);
  const summary = useMemo(() => {
    const people = new Set<string>();
    for (const visit of workspace.visits) if (visit.memberName) people.add(visit.memberName);
    for (const record of workspace.cases) if (record.name) people.add(record.name);

    return [
      {
        icon: Users,
        value: people.size,
        label: labels.communityMembers,
      },
      {
        icon: Footprints,
        value: workspace.visits.filter((visit) => isThisMonth(visit.visitDate)).length,
        label: labels.logsThisMonth,
      },
      {
        icon: AlertTriangle,
        value: workspace.cases.filter((record) => record.status !== "closed").length,
        label: labels.openCases,
      },
    ];
  }, [labels.communityMembers, labels.logsThisMonth, labels.openCases, workspace.cases, workspace.visits]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-5 md:px-8 md:pb-12">
      <section className="relative mb-6 overflow-hidden rounded-[2rem] bg-[#113D31] p-5 text-white shadow-[0_28px_80px_-44px_rgba(2,6,23,0.65)] md:p-8">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(circle at 18% 16%, rgba(255,255,255,0.2), transparent 28%), radial-gradient(circle at 88% 18%, rgba(0,56,168,0.28), transparent 30%), linear-gradient(135deg, #113D31 0%, #1B6B4B 52%, #40916C 100%)",
          }}
          aria-hidden
        />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/15" aria-hidden />
        <div className="absolute -bottom-20 left-8 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/80">
              <Activity className="h-3.5 w-3.5" strokeWidth={2.2} />
              ECI · POIDS · teren
            </div>
            <h1 className="font-editorial text-[clamp(2rem,1.25rem+3vw,3.75rem)] font-medium leading-[0.98] tracking-tight">
              {labels.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/84 md:text-lg">
              {labels.subtitle}
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">
              {labels.ecHint}
            </p>
          </div>

          <div className="space-y-3">
            <WorkspaceHeader
              labels={labels}
              countyCode={workspace.countyCode}
              onChangeCounty={(code) => workspace.update({ countyCode: code })}
              syncStatus={workspace.syncStatus}
            />
            <div className="grid grid-cols-3 gap-2">
              {summary.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/18 bg-white/12 p-3 text-center backdrop-blur-md"
                >
                  <Icon className="mx-auto mb-1 h-4 w-4 text-white/75" strokeWidth={2} />
                  <div className="font-display text-2xl font-extrabold leading-none">
                    {value}
                  </div>
                  <div className="mt-1 text-[9px] font-extrabold uppercase leading-tight tracking-wide text-white/68">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] p-3 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.45)] md:p-5">
        <WorkspaceTabs labels={labels} tab={tab} onChange={setTab} />

        <div className="rounded-[1.5rem] bg-[var(--color-surface-subtle)] p-3 md:p-5">
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
      </div>
    </div>
  );
}
