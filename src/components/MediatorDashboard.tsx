"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { OperationalCasesTab } from "@/components/mediator/OperationalCasesTab";
import { TasksTab } from "@/components/mediator/TasksTab";
import type { MediatorLabels } from "@/components/mediator/labels";
import { MediatorCommandRail } from "@/components/mediator/MediatorCommandRail";
import { MediatorInboxTab } from "@/components/mediator/MediatorInboxTab";
import { MediatorMoreTab } from "@/components/mediator/MediatorMoreTab";
import { useMediatorWorkspace } from "@/components/mediator/useMediatorWorkspace";
import { useCrossBorder } from "@/components/mediator/useCrossBorder";
import { useOperations } from "@/components/mediator/useOperations";
import { WorkspaceHeader } from "@/components/mediator/WorkspaceHeader";
import { WorkspaceTabs, type TabId } from "@/components/mediator/WorkspaceTabs";
import { FieldSessionBanner } from "@/components/field/FieldSessionBanner";
import { MyShiftHome } from "@/components/field/MyShiftHome";
import { ConsentCaseWizard, type ConsentCaseDraft } from "@/components/field/ConsentCaseWizard";
import { DoctorVisitPack } from "@/components/field/DoctorVisitPack";
import { bindFieldWorkspace } from "@/lib/mediator/workspace-client";
import type { FieldRole } from "@/lib/field/types";
import {
  inferCountryFromRegion,
  regionLabel,
  type FieldCountry,
} from "@/lib/field/geography";
import { auditClientEvent } from "@/lib/field/client-audit";

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
  countryCode?: FieldCountry;
  staffRole?: string;
};

/**
 * Field OS orchestrator — My Shift first, consent-gated cases, RO/IT geography.
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
  const [consentOpen, setConsentOpen] = useState(false);
  const [countryCode, setCountryCode] = useState<FieldCountry>(() => {
    if (fieldSession?.countryCode) return fieldSession.countryCode;
    if (fieldSession?.countyCode) return inferCountryFromRegion(fieldSession.countyCode);
    return "RO";
  });
  const [regionCode, setRegionCode] = useState(fieldSession?.countyCode ?? "");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldSession?.countyCode, bound]);

  const role = fieldSession?.role ?? "mediator";
  const showDoctorPack =
    fieldSession?.staffRole === "doctor" || role === "case_manager" || role === "supervisor";

  const geoLabel = useMemo(
    () => (regionCode ? regionLabel(countryCode, regionCode) : ""),
    [countryCode, regionCode],
  );

  async function handleConsentCase(draft: ConsentCaseDraft) {
    await operations.createCase({
      beneficiaryPseudonym: draft.beneficiaryLabel,
      countryCode,
      municipalityCode: regionCode || undefined,
      preferredLanguage: countryCode === "IT" ? "it" : "ro",
      consentStatus: "granted",
      source: "mediator_dashboard",
      categorySlug:
        draft.purpose === "literacy"
          ? "medication_access"
          : draft.purpose === "referral"
            ? "gp_registration"
            : "other",
      mainProblem: draft.notes || draft.purpose,
      urgency: "priority",
      notes: draft.notes,
      barriers: [],
    });
    auditClientEvent("field.case_opened_with_consent", {
      purpose: draft.purpose,
      country: countryCode,
      region: regionCode,
    });
    setTab("cases");
  }

  return (
    <div className="mediator-shell">
      {fieldSession ? (
        <FieldSessionBanner
          displayName={fieldSession.displayName}
          role={fieldSession.role}
          countyCode={regionCode || fieldSession.countyCode}
          workspaceId={fieldSession.workspaceId}
        />
      ) : null}

      <MediatorCommandRail />

      <MyShiftHome
        role={role}
        displayName={fieldSession?.displayName ?? labels.title}
        countryCode={countryCode}
        regionCode={regionCode}
        urgentCount={operations.urgentCases.length}
        tasksDue={operations.tasksDueToday.length + operations.overdueTasks.length}
        onOpenTab={setTab}
        onOpenConsentCase={() => setConsentOpen(true)}
      />

      {(workspace.syncStatus === "offline" || workspace.syncStatus === "error") && (
        <div
          className="mb-4 rounded-2xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950"
          role="status"
        >
          {labels.syncOfflineBanner}
        </div>
      )}

      <WorkspaceHeader
        labels={labels}
        countryCode={countryCode}
        regionCode={regionCode}
        onChangeCountry={(code) => {
          setCountryCode(code);
          setRegionCode("");
        }}
        onChangeRegion={(code) => {
          setRegionCode(code);
          workspace.update({ countyCode: code });
        }}
        syncStatus={workspace.syncStatus}
      />

      {showDoctorPack ? (
        <DoctorVisitPack
          cases={operations.cases}
          regionLabel={geoLabel}
          countryCode={countryCode}
        />
      ) : null}

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
          countyCode={regionCode || workspace.countyCode}
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

      <ConsentCaseWizard
        open={consentOpen}
        onClose={() => setConsentOpen(false)}
        onConfirm={handleConsentCase}
      />
    </div>
  );
}
