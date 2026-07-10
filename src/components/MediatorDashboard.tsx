"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  AlertTriangle,
  ArrowLeft,
  Cloud,
  Footprints,
  HeartPulse,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "@/navigation";
import { LanguagePicker } from "@/components/LanguagePicker";
import { LogoWordmark } from "@/components/Logo";
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

  const renderTab = () => {
    if (tab === "overview") {
      return (
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
      );
    }

    if (tab === "cases") {
      return (
        <CasesTab
          labels={labels}
          cases={workspace.cases}
          onSave={(record) =>
            workspace.update({ cases: [record, ...workspace.cases] })
          }
        />
      );
    }

    if (tab === "sessions") {
      return (
        <SessionsTab
          labels={labels}
          sessions={workspace.sessions}
          onSave={(record) =>
            workspace.update({ sessions: [record, ...workspace.sessions] })
          }
        />
      );
    }

    if (tab === "indicators") {
      return (
        <IndicatorsTab
          labels={labels}
          cases={workspace.cases}
          visits={workspace.visits}
          sessions={workspace.sessions}
        />
      );
    }

    if (tab === "training") {
      return (
        <TrainingTab
          labels={labels}
          training={workspace.training}
          onToggleModule={(moduleId, completed) => {
            const without = workspace.training.filter((p) => p.moduleId !== moduleId);
            workspace.update({
              training: completed
                ? [{ moduleId, completedAt: new Date().toISOString() }, ...without]
                : without,
            });
          }}
        />
      );
    }

    return (
      <ToolsTab
        labels={labels}
        locale={locale}
        countyCode={workspace.countyCode}
        cases={workspace.cases}
        visits={workspace.visits}
        sessions={workspace.sessions}
      />
    );
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#F4F1EA] text-[#17231F]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 8% 8%, rgba(0,56,168,0.16), transparent 26%), radial-gradient(circle at 92% 0%, rgba(200,16,46,0.12), transparent 28%), radial-gradient(circle at 72% 88%, rgba(0,107,63,0.18), transparent 34%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18,60,49,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(18,60,49,0.04) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="relative mx-auto grid max-w-[1440px] gap-5 px-4 py-4 md:px-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-7 lg:py-6">
        <aside className="lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)]">
          <div className="relative flex h-full flex-col overflow-hidden rounded-[2.25rem] bg-[#0F342B] p-4 text-white shadow-[0_32px_90px_-46px_rgba(2,6,23,0.85)]">
            <div
              aria-hidden
              className="absolute inset-0 opacity-90"
              style={{
                background:
                  "radial-gradient(circle at 30% 0%, rgba(255,255,255,0.18), transparent 32%), radial-gradient(circle at 105% 18%, rgba(0,56,168,0.32), transparent 30%), linear-gradient(160deg, #0B261F 0%, #123C31 48%, #006B3F 100%)",
              }}
            />
            <div className="absolute -right-20 -top-16 h-48 w-48 rounded-full border border-white/10" aria-hidden />
            <div className="absolute bottom-24 left-[-80px] h-56 w-56 rounded-full bg-[#0038A8]/25 blur-3xl" aria-hidden />

            <div className="relative mb-8 flex items-center justify-between gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs font-extrabold text-white/82 transition hover:bg-white/14"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </Link>
              <div className="[&_button]:border-white/20 [&_button]:bg-white/10 [&_button]:text-white">
                <LanguagePicker variant="landing" />
              </div>
            </div>

            <div className="relative mb-7">
              <div className="mb-5 inline-flex rounded-2xl bg-white px-2.5 py-2 shadow-[0_18px_35px_-24px_rgba(2,6,23,0.8)]">
                <LogoWordmark iconSize={28} />
              </div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/68">
                <Sparkles className="h-3.5 w-3.5" />
                ECI · POIDS · 2000 comunități
              </div>
              <h1 className="font-editorial text-[2.45rem] font-medium leading-[0.94] tracking-[-0.04em]">
                {labels.title}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/72">{labels.subtitle}</p>
            </div>

            <div className="relative mb-5">
              <WorkspaceHeader
                labels={labels}
                countyCode={workspace.countyCode}
                onChangeCounty={(code) => workspace.update({ countyCode: code })}
                syncStatus={workspace.syncStatus}
              />
            </div>

            <div className="relative mb-6 grid grid-cols-3 gap-2">
              {summary.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="rounded-[1.35rem] border border-white/12 bg-white/[0.09] p-3 backdrop-blur"
                >
                  <Icon className="mb-2 h-4 w-4 text-white/66" strokeWidth={2} />
                  <div className="font-display text-2xl font-black leading-none">{value}</div>
                  <div className="mt-1 text-[8.5px] font-black uppercase leading-tight tracking-[0.12em] text-white/52">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative min-h-0 flex-1 overflow-y-auto pr-1">
              <WorkspaceTabs labels={labels} tab={tab} onChange={setTab} variant="desktop" />
            </div>

            <a
              href="tel:112"
              className="relative mt-5 inline-flex items-center justify-center gap-2 rounded-2xl border border-[#FAD3D3] bg-white px-4 py-3 text-xs font-black text-[#B91C1C] shadow-[0_18px_42px_-24px_rgba(2,6,23,0.75)]"
            >
              <Phone className="h-4 w-4" />
              Urgență? Sună la 112
            </a>
          </div>
        </aside>

        <div className="min-w-0">
          <section className="mb-5 overflow-hidden rounded-[2.25rem] border border-black/[0.06] bg-white/76 p-4 shadow-[0_28px_90px_-60px_rgba(15,23,42,0.55)] backdrop-blur-xl md:p-6 lg:p-7">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-center">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#123C31] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                    <HeartPulse className="h-3.5 w-3.5" />
                    Command center
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#006B3F]/15 bg-[#006B3F]/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#006B3F]">
                    <Cloud className="h-3.5 w-3.5" />
                    offline + cloud sync
                  </span>
                </div>
                <h2 className="font-editorial text-[clamp(2rem,1.4rem+2vw,4.25rem)] font-medium leading-[0.95] tracking-[-0.045em] text-[#12231E]">
                  Teren, cazuri, raportare — într-un spațiu clar.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5B665F]">
                  {labels.ecHint}
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[1.75rem] bg-[#123C31] p-4 text-white">
                <div className="absolute inset-y-0 right-0 w-1/2 bg-[#0038A8]/22" aria-hidden />
                <div className="relative">
                  <div className="mb-5 flex items-center justify-between">
                    <ShieldCheck className="h-8 w-8 text-white/82" />
                    <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/70">
                      live
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {summary.map(({ value, label }) => (
                      <div key={label}>
                        <div className="font-display text-3xl font-black leading-none">{value}</div>
                        <div className="mt-1 text-[9px] font-black uppercase leading-tight tracking-[0.12em] text-white/55">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <WorkspaceTabs labels={labels} tab={tab} onChange={setTab} variant="mobile" />

          <section className="rounded-[2.25rem] border border-black/[0.06] bg-white/88 p-3 shadow-[0_28px_90px_-58px_rgba(15,23,42,0.5)] backdrop-blur-xl md:p-5 lg:p-7">
            <div className="rounded-[1.65rem] bg-[#F8F6F0] p-3 ring-1 ring-black/[0.035] md:p-5">
              {renderTab()}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
