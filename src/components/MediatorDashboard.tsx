"use client";

import { useState, useEffect, useMemo } from "react";
import { Link } from "@/navigation";
import {
  Users,
  ClipboardList,
  AlertTriangle,
  Footprints,
  FileText,
  Phone,
  Download,
  Check,
  Lock,
  FolderOpen,
  Presentation,
  Wrench,
  ChevronRight,
  Calendar,
} from "lucide-react";

type Labels = Record<string, string>;

type TabId = "overview" | "cases" | "sessions" | "tools";

type Visit = {
  id: string;
  memberName: string;
  notes: string;
  visitDate: string;
};

type CaseRecord = {
  id: string;
  name: string;
  category: string;
  status: string;
  notes: string;
  nextVisit: string;
  createdAt: string;
  updatedAt: string;
};

type SessionRecord = {
  id: string;
  title: string;
  topic: string;
  location: string;
  attendees: string;
  notes: string;
  sessionDate: string;
};

const ACCESS_KEY = "sastipe_mediator_access";
const VISITS_KEY = "sastipe_mediator_visits";
const CASES_KEY = "sastipe_mediator_cases";
const SESSIONS_KEY = "sastipe_mediator_sessions";

const CASE_CATEGORIES = ["health", "social", "education", "rights"] as const;
const CASE_STATUSES = [
  "identified",
  "assessment",
  "plan",
  "monitoring",
  "closed",
] as const;

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function isThisMonth(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function MediatorDashboard({ labels }: { labels: Labels }) {
  const [hasAccess, setHasAccess] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(ACCESS_KEY) === "true";
  });
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [tab, setTab] = useState<TabId>("overview");

  const [visits, setVisits] = useState<Visit[]>([]);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitName, setVisitName] = useState("");
  const [visitNotes, setVisitNotes] = useState("");
  const [visitSaved, setVisitSaved] = useState(false);

  const [showCaseForm, setShowCaseForm] = useState(false);
  const [caseName, setCaseName] = useState("");
  const [caseCategory, setCaseCategory] = useState<string>("health");
  const [caseStatus, setCaseStatus] = useState<string>("identified");
  const [caseNotes, setCaseNotes] = useState("");
  const [caseNextVisit, setCaseNextVisit] = useState("");
  const [caseSaved, setCaseSaved] = useState(false);

  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionTopic, setSessionTopic] = useState("");
  const [sessionLocation, setSessionLocation] = useState("");
  const [sessionAttendees, setSessionAttendees] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [sessionSaved, setSessionSaved] = useState(false);

  useEffect(() => {
    if (!hasAccess) return;
    queueMicrotask(() => {
      setVisits(loadJson<Visit[]>(VISITS_KEY, []));
      setCases(loadJson<CaseRecord[]>(CASES_KEY, []));
      setSessions(loadJson<SessionRecord[]>(SESSIONS_KEY, []));
    });
  }, [hasAccess]);

  const openCases = useMemo(
    () => cases.filter((c) => c.status !== "closed").length,
    [cases],
  );
  const visitsThisMonth = useMemo(
    () => visits.filter((v) => isThisMonth(v.visitDate)).length,
    [visits],
  );
  const sessionsThisMonth = useMemo(
    () => sessions.filter((s) => isThisMonth(s.sessionDate)).length,
    [sessions],
  );
  const peopleFollowed = useMemo(() => {
    const names = new Set([
      ...visits.map((v) => v.memberName),
      ...cases.map((c) => c.name),
    ]);
    return names.size;
  }, [visits, cases]);

  const categoryLabel = (key: string) => {
    const map: Record<string, string> = {
      health: labels.categoryHealth,
      social: labels.categorySocial,
      education: labels.categoryEducation,
      rights: labels.categoryRights,
    };
    return map[key] ?? key;
  };

  const statusLabel = (key: string) => {
    const map: Record<string, string> = {
      identified: labels.statusIdentified,
      assessment: labels.statusAssessment,
      plan: labels.statusPlan,
      monitoring: labels.statusMonitoring,
      closed: labels.statusClosed,
    };
    return map[key] ?? key;
  };

  const handleAccess = async () => {
    if (verifying) return;
    setVerifying(true);
    setError(false);
    try {
      const res = await fetch("/api/mediator/pin-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        localStorage.setItem(ACCESS_KEY, "true");
        setHasAccess(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setVerifying(false);
    }
  };

  const handleSaveVisit = async () => {
    const anonId = localStorage.getItem("sastipe_anon_id") ?? crypto.randomUUID();
    localStorage.setItem("sastipe_anon_id", anonId);

    const newVisit: Visit = {
      id: crypto.randomUUID(),
      memberName: visitName,
      notes: visitNotes,
      visitDate: new Date().toISOString(),
    };

    const updated = [newVisit, ...visits];
    setVisits(updated);
    localStorage.setItem(VISITS_KEY, JSON.stringify(updated));

    await fetch("/api/mediator/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-anonymous-id": anonId },
      body: JSON.stringify({ memberName: visitName, notes: visitNotes }),
    }).catch(() => {});

    setVisitSaved(true);
    setVisitName("");
    setVisitNotes("");
    setTimeout(() => {
      setVisitSaved(false);
      setShowVisitForm(false);
    }, 1500);
  };

  const handleSaveCase = () => {
    const now = new Date().toISOString();
    const record: CaseRecord = {
      id: crypto.randomUUID(),
      name: caseName.trim(),
      category: caseCategory,
      status: caseStatus,
      notes: caseNotes,
      nextVisit: caseNextVisit,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [record, ...cases];
    setCases(updated);
    localStorage.setItem(CASES_KEY, JSON.stringify(updated));
    setCaseSaved(true);
    setCaseName("");
    setCaseNotes("");
    setCaseNextVisit("");
    setCaseCategory("health");
    setCaseStatus("identified");
    setTimeout(() => {
      setCaseSaved(false);
      setShowCaseForm(false);
    }, 1500);
  };

  const handleSaveSession = () => {
    const record: SessionRecord = {
      id: crypto.randomUUID(),
      title: sessionTitle.trim(),
      topic: sessionTopic,
      location: sessionLocation,
      attendees: sessionAttendees,
      notes: sessionNotes,
      sessionDate: new Date().toISOString(),
    };
    const updated = [record, ...sessions];
    setSessions(updated);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    setSessionSaved(true);
    setSessionTitle("");
    setSessionTopic("");
    setSessionLocation("");
    setSessionAttendees("");
    setSessionNotes("");
    setTimeout(() => {
      setSessionSaved(false);
      setShowSessionForm(false);
    }, 1500);
  };

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center py-12">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-sage-50)]">
          <Lock className="h-8 w-8 text-[var(--color-sage-700)]" />
        </div>
        <h1 className="mb-1 text-xl font-bold text-[var(--color-text-primary)]">{labels.title}</h1>
        <p className="mb-2 max-w-sm text-center text-sm text-[var(--color-text-secondary)]">
          {labels.accessCodeHint}
        </p>
        <p className="mb-6 max-w-md text-center text-xs text-[var(--color-text-muted)]">{labels.ecHint}</p>

        <div className="flex w-full max-w-xs flex-col gap-3">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder={labels.accessCodePlaceholder}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface)] p-4 text-center text-2xl tracking-[0.5em] shadow-1 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
          />
          {error && (
            <p className="text-center text-sm text-[var(--color-danger-text)]">{labels.accessCodeError}</p>
          )}
          <button
            onClick={handleAccess}
            disabled={code.length < 4 || verifying}
            className="rounded-xl bg-[var(--color-sage-700)] p-4 text-base font-semibold text-white shadow-lg transition-all active:scale-[0.97] disabled:bg-[var(--color-border-strong)]"
          >
            {labels.accessCodeSubmit}
          </button>
        </div>
      </div>
    );
  }

  const tabs: { id: TabId; label: string; icon: typeof Users }[] = [
    { id: "overview", label: labels.tabDashboard, icon: ClipboardList },
    { id: "cases", label: labels.tabCases, icon: FolderOpen },
    { id: "sessions", label: labels.tabSessions, icon: Presentation },
    { id: "tools", label: labels.tabTools, icon: Wrench },
  ];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-[var(--color-text-primary)]">{labels.title}</h1>
      <p className="mb-2 text-sm text-[var(--color-text-secondary)]">{labels.subtitle}</p>
      <p className="mb-5 text-xs text-[var(--color-text-muted)]">{labels.ecHint}</p>

      <div
        className="mb-6 flex gap-1 overflow-x-auto rounded-2xl bg-[var(--color-surface-subtle)] p-1"
        role="tablist"
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex min-h-[44px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-2.5 text-[11px] font-extrabold transition-colors ${
              tab === id
                ? "bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-1"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div className="mb-6 grid grid-cols-3 gap-2">
            <StatCard
              icon={Users}
              value={String(peopleFollowed)}
              label={labels.communityMembers}
              color="info"
            />
            <StatCard
              icon={Footprints}
              value={String(visitsThisMonth)}
              label={labels.logsThisMonth}
              color="success"
            />
            <StatCard
              icon={AlertTriangle}
              value={String(openCases)}
              label={labels.openCases}
              color="warning"
            />
          </div>

          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            {labels.quickActions}
          </h2>
          <div className="mb-6 flex flex-col gap-2">
            <ActionButton
              icon={Footprints}
              label={labels.logVisit}
              onClick={() => {
                setTab("overview");
                setShowVisitForm(!showVisitForm);
              }}
            />
            <ActionButton
              icon={FolderOpen}
              label={labels.newCase}
              onClick={() => {
                setTab("cases");
                setShowCaseForm(true);
              }}
            />
            <ActionButton
              icon={Presentation}
              label={labels.newSession}
              onClick={() => {
                setTab("sessions");
                setShowSessionForm(true);
              }}
            />
          </div>

          {showVisitForm && (
            <VisitForm
              labels={labels}
              visitName={visitName}
              visitNotes={visitNotes}
              visitSaved={visitSaved}
              onNameChange={setVisitName}
              onNotesChange={setVisitNotes}
              onSave={handleSaveVisit}
            />
          )}

          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
            {labels.recentActivity}
          </h2>
          <ActivityList visits={visits} emptyLabel={labels.noActivity} />
        </>
      )}

      {tab === "cases" && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{labels.casesTitle}</h2>
            <button
              type="button"
              onClick={() => setShowCaseForm(!showCaseForm)}
              className="rounded-full bg-[var(--color-sage-700)] px-4 py-2 text-xs font-extrabold text-white"
            >
              {labels.newCase}
            </button>
          </div>

          {showCaseForm && (
            <div className="mb-6 rounded-2xl border border-[var(--color-sage-200)] bg-[var(--color-surface)] p-5 shadow-1">
              <input
                type="text"
                placeholder={labels.caseName}
                value={caseName}
                onChange={(e) => setCaseName(e.target.value)}
                className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
              />
              <div className="mb-3 grid grid-cols-2 gap-2">
                <select
                  value={caseCategory}
                  onChange={(e) => setCaseCategory(e.target.value)}
                  className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
                  aria-label={labels.caseCategory}
                >
                  {CASE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {categoryLabel(c)}
                    </option>
                  ))}
                </select>
                <select
                  value={caseStatus}
                  onChange={(e) => setCaseStatus(e.target.value)}
                  className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
                  aria-label={labels.caseStatus}
                >
                  {CASE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="date"
                value={caseNextVisit}
                onChange={(e) => setCaseNextVisit(e.target.value)}
                className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
                aria-label={labels.nextVisit}
              />
              <textarea
                placeholder={labels.caseNotes}
                value={caseNotes}
                onChange={(e) => setCaseNotes(e.target.value)}
                rows={3}
                className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
              />
              <SaveButton
                saved={caseSaved}
                savedLabel={labels.caseSaved}
                saveLabel={labels.saveCase}
                disabled={!caseName.trim()}
                onClick={handleSaveCase}
              />
            </div>
          )}

          {cases.length === 0 ? (
            <EmptyState message={labels.noCases} />
          ) : (
            <ul className="flex flex-col gap-2">
              {cases.map((c) => (
                <li key={c.id} className="rounded-2xl bg-[var(--color-surface)] p-4 shadow-1">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <span className="font-bold text-[var(--color-text-primary)]">{c.name}</span>
                    <span className="shrink-0 rounded-full bg-[var(--color-sage-100)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-sage-800)]">
                      {statusLabel(c.status)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">{categoryLabel(c.category)}</p>
                  {c.nextVisit && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                      <Calendar className="h-3 w-3" />
                      {labels.nextVisit}: {c.nextVisit}
                    </p>
                  )}
                  {c.notes && (
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{c.notes}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {tab === "sessions" && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{labels.sessionsTitle}</h2>
            <span className="text-xs text-[var(--color-text-muted)]">
              {labels.sessionsThisMonth}: {sessionsThisMonth}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowSessionForm(!showSessionForm)}
            className="mb-4 w-full rounded-xl bg-[var(--color-sage-700)] py-3 text-sm font-extrabold text-white"
          >
            {labels.newSession}
          </button>

          {showSessionForm && (
            <div className="mb-6 rounded-2xl border border-[var(--color-sage-200)] bg-[var(--color-surface)] p-5 shadow-1">
              <input
                type="text"
                placeholder={labels.sessionTitle}
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
              />
              <input
                type="text"
                placeholder={labels.sessionTopic}
                value={sessionTopic}
                onChange={(e) => setSessionTopic(e.target.value)}
                className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
              />
              <input
                type="text"
                placeholder={labels.sessionLocation}
                value={sessionLocation}
                onChange={(e) => setSessionLocation(e.target.value)}
                className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder={labels.sessionAttendees}
                value={sessionAttendees}
                onChange={(e) => setSessionAttendees(e.target.value)}
                className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
              />
              <textarea
                placeholder={labels.sessionNotes}
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                rows={3}
                className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
              />
              <SaveButton
                saved={sessionSaved}
                savedLabel={labels.sessionSaved}
                saveLabel={labels.saveSession}
                disabled={!sessionTitle.trim()}
                onClick={handleSaveSession}
              />
            </div>
          )}

          {sessions.length === 0 ? (
            <EmptyState message={labels.noSessions} />
          ) : (
            <ul className="flex flex-col gap-2">
              {sessions.map((s) => (
                <li key={s.id} className="rounded-2xl bg-[var(--color-surface)] p-4 shadow-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-bold text-[var(--color-text-primary)]">{s.title}</span>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {new Date(s.sessionDate).toLocaleDateString()}
                    </span>
                  </div>
                  {s.topic && <p className="text-sm text-[var(--color-text-secondary)]">{s.topic}</p>}
                  {s.location && (
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">{s.location}</p>
                  )}
                  {s.attendees && (
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {labels.sessionAttendees}: {s.attendees}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {tab === "tools" && (
        <>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            {labels.toolsTitle}
          </h2>
          <div className="mb-6 flex flex-col gap-2">
            <ToolLink href="/scan" label={labels.toolsScan} />
            <ToolLink href="/vaccines" label={labels.toolsVaccines} />
            <ToolLink href="/rights" label={labels.toolsRights} />
            <ToolLink href="/explain" label={labels.toolsExplain} />
            <ToolLink href="/chat" label={labels.toolsChat} />
          </div>

          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            {labels.resources}
          </h2>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] p-4 shadow-1"
            >
              <Phone className="h-5 w-5 text-purple-500" />
              <span className="flex-1 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                {labels.contactSupport}
              </span>
            </button>
            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] p-4 shadow-1"
            >
              <Download className="h-5 w-5 text-[var(--color-text-muted)]" />
              <span className="flex-1 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                {labels.downloadGuide}
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof Users;
  value: string;
  label: string;
  color: "info" | "success" | "warning";
}) {
  const iconClass =
    color === "info"
      ? "text-[var(--color-info-accent)]"
      : color === "success"
        ? "text-[var(--color-success-accent)]"
        : "text-[var(--color-warning-accent)]";

  return (
    <div className="flex flex-col items-center rounded-2xl bg-[var(--color-surface)] p-4 shadow-1">
      <Icon className={`mb-1 h-5 w-5 ${iconClass}`} strokeWidth={1.85} />
      <span className="font-display text-xl font-extrabold text-[var(--color-text-primary)]">{value}</span>
      <span className="text-center text-[10px] text-[var(--color-text-muted)]">{label}</span>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Footprints;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] p-4 shadow-1 transition-all active:scale-[0.99]"
    >
      <Icon className="h-5 w-5 text-[var(--color-sage-700)]" />
      <span className="flex-1 text-left text-sm font-semibold text-[var(--color-text-primary)]">{label}</span>
    </button>
  );
}

function VisitForm({
  labels,
  visitName,
  visitNotes,
  visitSaved,
  onNameChange,
  onNotesChange,
  onSave,
}: {
  labels: Labels;
  visitName: string;
  visitNotes: string;
  visitSaved: boolean;
  onNameChange: (v: string) => void;
  onNotesChange: (v: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="mb-6 rounded-2xl border border-[var(--color-sage-200)] bg-[var(--color-surface)] p-5 shadow-1">
      <h3 className="mb-3 text-base font-bold text-[var(--color-text-primary)]">{labels.logVisit}</h3>
      <input
        type="text"
        placeholder={labels.memberName}
        value={visitName}
        onChange={(e) => onNameChange(e.target.value)}
        aria-label={labels.memberName}
        className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
      />
      <textarea
        placeholder={labels.notes}
        value={visitNotes}
        onChange={(e) => onNotesChange(e.target.value)}
        aria-label={labels.notes}
        rows={3}
        className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
      />
      <SaveButton
        saved={visitSaved}
        savedLabel={labels.visitSaved}
        saveLabel={labels.saveVisit}
        disabled={!visitName.trim()}
        onClick={onSave}
      />
    </div>
  );
}

function SaveButton({
  saved,
  savedLabel,
  saveLabel,
  disabled,
  onClick,
}: {
  saved: boolean;
  savedLabel: string;
  saveLabel: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-xl p-3 text-sm font-semibold text-white transition-all active:scale-[0.97] ${
        saved ? "bg-[var(--color-success-accent)]" : "bg-[var(--color-sage-700)] disabled:bg-[var(--color-border-strong)]"
      }`}
    >
      {saved ? (
        <>
          <Check className="h-4 w-4" />
          {savedLabel}
        </>
      ) : (
        saveLabel
      )}
    </button>
  );
}

function ActivityList({ visits, emptyLabel }: { visits: Visit[]; emptyLabel: string }) {
  if (visits.length === 0) {
    return <EmptyState message={emptyLabel} />;
  }
  return (
    <div className="mb-6 flex flex-col gap-2">
      {visits.map((visit) => (
        <div key={visit.id} className="rounded-2xl bg-[var(--color-surface)] p-4 shadow-1">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-bold text-[var(--color-text-primary)]">{visit.memberName}</span>
            <span className="text-xs text-[var(--color-text-muted)]">
              {new Date(visit.visitDate).toLocaleDateString()}
            </span>
          </div>
          {visit.notes && <p className="text-sm text-[var(--color-text-secondary)]">{visit.notes}</p>}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-[var(--color-surface)] p-6 text-center text-sm text-[var(--color-text-muted)] shadow-1">
      {message}
    </div>
  );
}

function ToolLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] p-4 shadow-1 transition-all active:scale-[0.99]"
    >
      <FileText className="h-5 w-5 text-[var(--color-accent-text)]" />
      <span className="flex-1 text-left text-sm font-semibold text-[var(--color-text-primary)]">{label}</span>
      <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
    </Link>
  );
}
