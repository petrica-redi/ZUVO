"use client";

import { useState, useEffect } from "react";
import {
  Users,
  ClipboardList,
  AlertTriangle,
  Footprints,
  Activity,
  FileText,
  Phone,
  Download,
  Check,
  Lock,
} from "lucide-react";

type Labels = Record<string, string>;

// UI-only convenience gate. The *real* mediator authorisation happens on
// every protected server endpoint via the Supabase user-role check. We
// verify the PIN through `/api/mediator/pin-check` so the value never
// ships in the client bundle.
const ACCESS_KEY = "sastipe_mediator_access";

export function MediatorDashboard({ labels }: { labels: Labels }) {
  const [hasAccess, setHasAccess] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(ACCESS_KEY) === "true";
  });
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitName, setVisitName] = useState("");
  const [visitNotes, setVisitNotes] = useState("");
  const [visitSaved, setVisitSaved] = useState(false);
  const [visits, setVisits] = useState<Array<{id: string, memberName: string, notes: string, visitDate: string}>>([]);

  useEffect(() => {
    if (hasAccess) {
      try {
        const stored = JSON.parse(localStorage.getItem("sastipe_mediator_visits") || "[]");
        queueMicrotask(() => setVisits(stored));
      } catch {
        queueMicrotask(() => setVisits([]));
      }
    }
  }, [hasAccess]);

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

    const newVisit = {
      id: crypto.randomUUID(),
      memberName: visitName,
      notes: visitNotes,
      visitDate: new Date().toISOString()
    };
    
    const updatedVisits = [newVisit, ...visits];
    setVisits(updatedVisits);
    localStorage.setItem("sastipe_mediator_visits", JSON.stringify(updatedVisits));

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

  // ── Access gate ───────────────────────────────────────────────────────
  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center py-12">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <Lock className="h-8 w-8 text-[#C0392B]" />
        </div>
        <h1 className="mb-1 text-xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mb-6 text-sm text-gray-500">{labels.accessCodeHint}</p>

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
            className="rounded-xl border border-gray-200 bg-white p-4 text-center text-2xl tracking-[0.5em] shadow-sm focus:border-[#C0392B] focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20"
          />
          {error && <p className="text-center text-sm text-red-500">{labels.accessCodeError}</p>}
          <button
            onClick={handleAccess}
            disabled={code.length < 4}
            className="rounded-xl bg-[#C0392B] p-4 text-base font-semibold text-white shadow-lg transition-all active:scale-[0.97] disabled:bg-gray-300"
          >
            {labels.accessCodeSubmit}
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">{labels.title}</h1>
      <p className="mb-6 text-sm text-gray-500">{labels.subtitle}</p>

      {/* Stats grid */}
      <div className="mb-6 grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center rounded-2xl bg-[var(--color-surface)] p-4 shadow-1">
          <Users className="lucide mb-1 h-5 w-5 text-[var(--color-info-accent)]" strokeWidth={1.85} />
          <span className="font-display text-xl font-extrabold text-[var(--color-text-primary)]">
            {new Set(visits.map((v) => v.memberName)).size}
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)]">{labels.communityMembers}</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-[var(--color-surface)] p-4 shadow-1">
          <ClipboardList className="lucide mb-1 h-5 w-5 text-[var(--color-success-accent)]" strokeWidth={1.85} />
          <span className="font-display text-xl font-extrabold text-[var(--color-text-primary)]">
            {visits.filter((v) => new Date(v.visitDate).getMonth() === new Date().getMonth()).length}
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)]">{labels.logsThisMonth}</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-[var(--color-surface)] p-4 shadow-1">
          <AlertTriangle className="lucide mb-1 h-5 w-5 text-[var(--color-warning-accent)]" strokeWidth={1.85} />
          <span className="font-display text-xl font-extrabold text-[var(--color-text-primary)]">0</span>
          <span className="text-[10px] text-[var(--color-text-muted)]">{labels.alertsActive}</span>
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
        {labels.quickActions}
      </h2>
      <div className="mb-6 flex flex-col gap-2">
        <button
          onClick={() => setShowVisitForm(!showVisitForm)}
          className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition-all active:scale-[0.99]"
        >
          <Footprints className="h-5 w-5 text-[#C0392B]" />
          <span className="flex-1 text-left text-sm font-semibold text-gray-800">{labels.logVisit}</span>
        </button>
        <button className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition-all active:scale-[0.99]">
          <Activity className="h-5 w-5 text-green-500" />
          <span className="flex-1 text-left text-sm font-semibold text-gray-800">{labels.recordHealth}</span>
        </button>
        <button className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition-all active:scale-[0.99]">
          <FileText className="h-5 w-5 text-blue-500" />
          <span className="flex-1 text-left text-sm font-semibold text-gray-800">{labels.viewReports}</span>
        </button>
      </div>

      {/* Visit form */}
      {showVisitForm && (
        <div className="mb-6 rounded-2xl border-2 border-[#C0392B]/20 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-bold text-gray-900">{labels.logVisit}</h3>
          <input
            type="text"
            placeholder={labels.memberName}
            value={visitName}
            onChange={(e) => setVisitName(e.target.value)}
            aria-label="Community member name"
            className="mb-3 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-[#C0392B] focus:outline-none"
          />
          <textarea
            placeholder={labels.notes}
            value={visitNotes}
            onChange={(e) => setVisitNotes(e.target.value)}
            aria-label="Visit notes"
            rows={3}
            className="mb-3 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-[#C0392B] focus:outline-none"
          />
          <button
            onClick={handleSaveVisit}
            disabled={!visitName.trim()}
            className={`flex w-full items-center justify-center gap-2 rounded-xl p-3 text-sm font-semibold text-white transition-all active:scale-[0.97] ${
              visitSaved ? "bg-green-500" : "bg-[#C0392B] disabled:bg-gray-300"
            }`}
          >
            {visitSaved ? (
              <>
                <Check className="h-4 w-4" />
                {labels.visitSaved}
              </>
            ) : (
              labels.saveVisit
            )}
          </button>
        </div>
      )}

      {/* Recent Activity */}
      <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
        {labels.recentActivity}
      </h2>
      <div className="mb-6 flex flex-col gap-2">
        {visits.length === 0 ? (
          <div className="rounded-2xl bg-[var(--color-surface)] p-6 text-center text-sm text-[var(--color-text-muted)] shadow-1">
            {labels.noActivity}
          </div>
        ) : (
          visits.map((visit) => (
            <div key={visit.id} className="rounded-2xl bg-[var(--color-surface)] p-4 shadow-1">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-bold text-[var(--color-text-primary)]">{visit.memberName}</span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {new Date(visit.visitDate).toLocaleDateString()}
                </span>
              </div>
              {visit.notes && <p className="text-sm text-[var(--color-text-secondary)]">{visit.notes}</p>}
            </div>
          ))
        )}
      </div>

      {/* Resources */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
        {labels.resources}
      </h2>
      <div className="flex flex-col gap-2">
        <button className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition-all active:scale-[0.99]">
          <Phone className="h-5 w-5 text-purple-500" />
          <span className="flex-1 text-left text-sm font-semibold text-gray-800">{labels.contactSupport}</span>
        </button>
        <button className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition-all active:scale-[0.99]">
          <Download className="h-5 w-5 text-gray-500" />
          <span className="flex-1 text-left text-sm font-semibold text-gray-800">{labels.downloadGuide}</span>
        </button>
      </div>
    </div>
  );
}
