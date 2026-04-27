"use client";

import { useState, useEffect } from "react";
import { Check, Droplets, Footprints, Dumbbell, BedDouble } from "lucide-react";
import { getOrCreateClientAnonId } from "@/lib/client-anon-id";

type Labels = {
  title: string;
  subtitle: string;
  moodTitle: string;
  moodGreat: string;
  moodGood: string;
  moodOkay: string;
  moodLow: string;
  moodBad: string;
  waterTitle: string;
  waterSubtitle: string;
  waterGoal: string;
  activityTitle: string;
  activityWalk: string;
  activityExercise: string;
  activityRest: string;
  saveCheckin: string;
  savedSuccess: string;
  streakDays: string;
  loggedToday: string;
  noLogsYet: string;
};

const MOODS = [
  { value: 5, emoji: "😊", key: "moodGreat" as const, color: "#16A34A" },
  { value: 4, emoji: "🙂", key: "moodGood" as const, color: "#65A30D" },
  { value: 3, emoji: "😐", key: "moodOkay" as const, color: "#EAB308" },
  { value: 2, emoji: "😔", key: "moodLow" as const, color: "#F97316" },
  { value: 1, emoji: "😢", key: "moodBad" as const, color: "#DC2626" },
];

const STORAGE_KEY = "sastipe_checkin";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getCheckinHistory(): Record<string, { mood: number; water: number; activity: string }> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function DailyCheckin({ labels }: { labels: Labels }) {
  const [mood, setMood] = useState<number | null>(null);
  const [water, setWater] = useState(0);
  const [activity, setActivity] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [todayDone, setTodayDone] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage on mount */
    const history = getCheckinHistory();
    const today = history[getTodayKey()];
    if (today) {
      setMood(today.mood);
      setWater(today.water);
      setActivity(today.activity);
      setTodayDone(true);
    }

    // Calculate streak
    let s = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (history[key]) {
        s++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    setStreak(s);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const handleSave = () => {
    if (mood === null) return;
    const history = getCheckinHistory();
    history[getTodayKey()] = { mood, water, activity: activity ?? "rest" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

    // Fire-and-forget API calls
    const anonId = getOrCreateClientAnonId();
    const headers = { "Content-Type": "application/json", "x-anonymous-id": anonId };

    fetch("/api/health-log", {
      method: "POST",
      headers,
      body: JSON.stringify({ type: "mood", value: mood, unit: "scale" }),
    }).catch(() => {});

    if (water > 0) {
      fetch("/api/health-log", {
        method: "POST",
        headers,
        body: JSON.stringify({ type: "water", value: water, unit: "glasses" }),
      }).catch(() => {});
    }

    if (activity) {
      fetch("/api/health-log", {
        method: "POST",
        headers,
        body: JSON.stringify({ type: "activity", value: 1, unit: activity }),
      }).catch(() => {});
    }

    setSaved(true);
    setTodayDone(true);
    setStreak((s) => s + (s === 0 || !getCheckinHistory()[getTodayKey()] ? 1 : 0));
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      {/* Header */}
      <h1 className="mb-1 text-2xl font-bold text-gray-900">{labels.title}</h1>
      <p className="mb-6 text-sm text-gray-500">{labels.subtitle}</p>

      {/* Streak badge */}
      {streak > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
          <span className="text-2xl">🔥</span>
          <div>
            <span className="text-lg font-bold text-amber-700">{streak}</span>
            <span className="ml-1 text-sm text-amber-600">{labels.streakDays}</span>
          </div>
          {todayDone && (
            <span className="ml-auto rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              ✓ {labels.loggedToday}
            </span>
          )}
        </div>
      )}

      {/* Mood */}
      <section className="mb-6">
        <h2 className="mb-3 text-base font-bold text-gray-800">{labels.moodTitle}</h2>
        <div className="flex justify-between gap-2">
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border-2 p-3 transition-all ${
                mood === m.value
                  ? "scale-105 shadow-md"
                  : "border-transparent bg-white shadow-sm"
              }`}
              style={mood === m.value ? { borderColor: m.color, backgroundColor: `${m.color}10` } : {}}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[10px] font-medium text-gray-500">{labels[m.key]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Water intake */}
      <section className="mb-6">
        <h2 className="mb-1 text-base font-bold text-gray-800">{labels.waterTitle}</h2>
        <p className="mb-3 text-xs text-gray-400">{labels.waterSubtitle} · {labels.waterGoal}</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
            <button
              key={g}
              onClick={() => setWater(g)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                g <= water
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-blue-300 shadow-sm ring-1 ring-gray-100"
              }`}
            >
              <Droplets className="h-4 w-4" />
            </button>
          ))}
        </div>
      </section>

      {/* Activity */}
      <section className="mb-8">
        <h2 className="mb-3 text-base font-bold text-gray-800">{labels.activityTitle}</h2>
        <div className="flex gap-2">
          {[
            { id: "walk", icon: Footprints, label: labels.activityWalk, color: "#16A34A" },
            { id: "exercise", icon: Dumbbell, label: labels.activityExercise, color: "#2563EB" },
            { id: "rest", icon: BedDouble, label: labels.activityRest, color: "#9333EA" },
          ].map((a) => (
            <button
              key={a.id}
              onClick={() => setActivity(a.id)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border-2 p-3 transition-all ${
                activity === a.id
                  ? "scale-105 shadow-md"
                  : "border-transparent bg-white shadow-sm"
              }`}
              style={activity === a.id ? { borderColor: a.color, backgroundColor: `${a.color}10` } : {}}
            >
              <a.icon className="h-5 w-5" style={{ color: activity === a.id ? a.color : "#9CA3AF" }} />
              <span className="text-xs font-medium text-gray-600">{a.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={mood === null}
        className={`flex w-full items-center justify-center gap-2 rounded-2xl p-4 text-base font-semibold text-white shadow-lg transition-all active:scale-[0.97] ${
          mood === null ? "bg-gray-300" : saved ? "bg-green-500" : "bg-brand-600"
        }`}
        style={mood !== null && !saved ? { backgroundColor: "#C0392B" } : {}}
      >
        {saved ? (
          <>
            <Check className="h-5 w-5" />
            {labels.savedSuccess}
          </>
        ) : (
          labels.saveCheckin
        )}
      </button>
    </div>
  );
}
