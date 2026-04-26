"use client";

import { useState, useEffect } from "react";
import { User, Globe, BookOpen, Activity, Flame, Download, Trash2, Info, Shield, Mail } from "lucide-react";

type Labels = Record<string, string>;

const PROGRESS_KEY = "sastipe_progress";
const CHECKIN_KEY = "sastipe_checkin";

export function ProfileView({ labels }: { labels: Labels }) {
  const [modulesCompleted, setModulesCompleted] = useState(0);
  const [pillarsStarted, setPillarsStarted] = useState(0);
  const [streak, setStreak] = useState(0);
  const [clearConfirm, setClearConfirm] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate stats from localStorage on mount */
    // Count progress
    try {
      const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}");
      const completed = Object.values(progress).filter((v) => v === "completed").length;
      const pillars = new Set(
        Object.keys(progress)
          .filter((k) => progress[k] === "completed")
          .map((k) => k.split(":")[0])
      );
      setModulesCompleted(completed);
      setPillarsStarted(pillars.size);
    } catch {
      /* empty */
    }

    // Count streak
    try {
      const history = JSON.parse(localStorage.getItem(CHECKIN_KEY) ?? "{}");
      let s = 0;
      const d = new Date();
      while (true) {
        if (history[d.toISOString().slice(0, 10)]) {
          s++;
          d.setDate(d.getDate() - 1);
        } else break;
      }
      setStreak(s);
    } catch {
      /* empty */
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const handleClear = () => {
    if (!clearConfirm) {
      setClearConfirm(true);
      return;
    }
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(CHECKIN_KEY);
    localStorage.removeItem("sastipe_anon_id");
    setModulesCompleted(0);
    setPillarsStarted(0);
    setStreak(0);
    setClearConfirm(false);
  };

  const handleExport = () => {
    const data = {
      progress: JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}"),
      checkins: JSON.parse(localStorage.getItem(CHECKIN_KEY) ?? "{}"),
      exported: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sastipe-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* User card */}
      <div className="mb-6 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <User className="h-7 w-7 text-gray-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{labels.guestUser}</h1>
          <p className="text-sm text-gray-500">{labels.guestSubtitle}</p>
        </div>
      </div>

      {/* Progress stats */}
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
        <BookOpen className="h-4 w-4" />
        {labels.learningProgress}
      </h2>

      {modulesCompleted === 0 ? (
        <div className="mb-6 rounded-2xl bg-white p-5 text-center shadow-sm">
          <p className="text-sm text-gray-500">{labels.progressNone}</p>
          <p className="mt-1 text-sm text-gray-400">{labels.progressStart}</p>
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm">
            <BookOpen className="mb-1 h-5 w-5 text-blue-500" />
            <span className="text-xl font-bold text-gray-900">{pillarsStarted}</span>
            <span className="text-[10px] text-gray-500">{labels.pillarsStarted}</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm">
            <Activity className="mb-1 h-5 w-5 text-green-500" />
            <span className="text-xl font-bold text-gray-900">{modulesCompleted}</span>
            <span className="text-[10px] text-gray-500">{labels.modulesCompleted}</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm">
            <Flame className="mb-1 h-5 w-5 text-orange-500" />
            <span className="text-xl font-bold text-gray-900">{streak}</span>
            <span className="text-[10px] text-gray-500">{labels.trackingStreak}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleExport}
          className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition-all active:scale-[0.99]"
        >
          <Download className="h-5 w-5 text-blue-500" />
          <div className="flex-1 text-left">
            <span className="text-sm font-semibold text-gray-800">{labels.exportData}</span>
            <p className="text-xs text-gray-400">{labels.exportDescription}</p>
          </div>
        </button>

        <button
          onClick={handleClear}
          className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition-all active:scale-[0.99]"
        >
          <Trash2 className="h-5 w-5 text-red-500" />
          <span className="flex-1 text-left text-sm font-semibold text-gray-800">
            {clearConfirm ? labels.clearDataConfirm : labels.clearData}
          </span>
        </button>
      </div>

      {/* About */}
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
          <Info className="h-4 w-4" />
          {labels.aboutTitle}
        </h2>
        <p className="mb-3 text-xs leading-relaxed text-gray-500">{labels.aboutText}</p>
        <div className="flex gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {labels.privacyPolicy}
          </span>
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {labels.contactUs}
          </span>
        </div>
        <p className="mt-2 text-[10px] text-gray-300">{labels.version} 1.0.0</p>
      </div>
    </div>
  );
}
