"use client";

import { useState } from "react";
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

// Simple access gate — mediators enter a 4-digit code to access the dashboard.
// In production this would be Supabase auth with role check.
const ACCESS_CODE = "2026";
const ACCESS_KEY = "sastipe_mediator_access";

export function MediatorDashboard({ labels }: { labels: Labels }) {
  const [hasAccess, setHasAccess] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(ACCESS_KEY) === "true";
  });
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitName, setVisitName] = useState("");
  const [visitNotes, setVisitNotes] = useState("");
  const [visitSaved, setVisitSaved] = useState(false);

  const handleAccess = () => {
    if (code === ACCESS_CODE) {
      localStorage.setItem(ACCESS_KEY, "true");
      setHasAccess(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleSaveVisit = async () => {
    const anonId = localStorage.getItem("sastipe_anon_id") ?? crypto.randomUUID();
    localStorage.setItem("sastipe_anon_id", anonId);

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
        <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm">
          <Users className="mb-1 h-5 w-5 text-blue-500" />
          <span className="text-xl font-bold text-gray-900">—</span>
          <span className="text-[10px] text-gray-500">{labels.communityMembers}</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm">
          <ClipboardList className="mb-1 h-5 w-5 text-green-500" />
          <span className="text-xl font-bold text-gray-900">—</span>
          <span className="text-[10px] text-gray-500">{labels.logsThisMonth}</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm">
          <AlertTriangle className="mb-1 h-5 w-5 text-amber-500" />
          <span className="text-xl font-bold text-gray-900">0</span>
          <span className="text-[10px] text-gray-500">{labels.alertsActive}</span>
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
            className="mb-3 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-[#C0392B] focus:outline-none"
          />
          <textarea
            placeholder={labels.notes}
            value={visitNotes}
            onChange={(e) => setVisitNotes(e.target.value)}
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
