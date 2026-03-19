"use client";

import { useState, useEffect } from "react";
import {
  Plus, User, Baby, Heart, Trash2, ChevronRight,
  Syringe, Activity, Calendar, X,
} from "lucide-react";

type FamilyMember = {
  id: string;
  name: string;
  relationship: "self" | "child" | "spouse" | "parent" | "other";
  age: number;
  gender: "male" | "female" | "other";
  isPregnant?: boolean;
  dueDate?: string;
  notes?: string;
};

type HealthEntry = {
  id: string;
  memberId: string;
  type: "mood" | "water" | "activity" | "weight" | "note";
  value: number;
  note?: string;
  date: string;
};

const STORAGE_KEY = "zuvo_family";
const HEALTH_KEY = "zuvo_health_logs";

const RELATIONSHIP_ICONS: Record<string, typeof User> = {
  self: User,
  child: Baby,
  spouse: Heart,
  parent: User,
  other: User,
};

const RELATIONSHIP_LABELS: Record<string, string> = {
  self: "Me",
  child: "Child",
  spouse: "Spouse",
  parent: "Parent",
  other: "Other",
};

const AVATARS = ["👤", "👩", "👨", "👧", "👦", "👶", "👵", "👴", "🤰"];

function getMembers(): FamilyMember[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

function saveMembers(members: FamilyMember[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

function getHealthLogs(): HealthEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HEALTH_KEY) || "[]");
  } catch { return []; }
}

function saveHealthLogs(logs: HealthEntry[]) {
  localStorage.setItem(HEALTH_KEY, JSON.stringify(logs));
}

export function FamilyHub() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [healthLogs, setHealthLogs] = useState<HealthEntry[]>([]);
  const [showLogForm, setShowLogForm] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formRelationship, setFormRelationship] = useState<FamilyMember["relationship"]>("child");
  const [formAge, setFormAge] = useState("");
  const [formGender, setFormGender] = useState<FamilyMember["gender"]>("female");
  const [formPregnant, setFormPregnant] = useState(false);

  // Health log form
  const [logType, setLogType] = useState<HealthEntry["type"]>("mood");
  const [logValue, setLogValue] = useState(3);
  const [logNote, setLogNote] = useState("");

  useEffect(() => {
    setMembers(getMembers());
    setHealthLogs(getHealthLogs());
  }, []);

  const addMember = () => {
    if (!formName.trim()) return;
    const member: FamilyMember = {
      id: crypto.randomUUID(),
      name: formName.trim(),
      relationship: formRelationship,
      age: Number(formAge) || 0,
      gender: formGender,
      isPregnant: formPregnant,
    };
    const updated = [...members, member];
    setMembers(updated);
    saveMembers(updated);
    setShowAddForm(false);
    setFormName("");
    setFormAge("");
    setFormPregnant(false);
  };

  const removeMember = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    saveMembers(updated);
    if (selectedMember?.id === id) setSelectedMember(null);
  };

  const addHealthLog = () => {
    if (!selectedMember) return;
    const entry: HealthEntry = {
      id: crypto.randomUUID(),
      memberId: selectedMember.id,
      type: logType,
      value: logValue,
      note: logNote || undefined,
      date: new Date().toISOString(),
    };
    const updated = [entry, ...healthLogs];
    setHealthLogs(updated);
    saveHealthLogs(updated);
    setShowLogForm(false);
    setLogNote("");
    setLogValue(3);
  };

  const getMemberLogs = (memberId: string) =>
    healthLogs.filter((l) => l.memberId === memberId).slice(0, 10);

  const getAvatar = (m: FamilyMember) => {
    if (m.isPregnant) return "🤰";
    if (m.relationship === "child" && m.age < 2) return "👶";
    if (m.relationship === "child") return m.gender === "male" ? "👦" : "👧";
    if (m.age > 60) return m.gender === "male" ? "👴" : "👵";
    return m.gender === "male" ? "👨" : "👩";
  };

  const moodEmojis = ["😢", "😟", "😐", "🙂", "😊"];
  const logTypeLabels: Record<string, string> = {
    mood: "Mood", water: "Water (glasses)", activity: "Activity (min)", weight: "Weight (kg)", note: "Note",
  };

  // Member detail view
  if (selectedMember) {
    const logs = getMemberLogs(selectedMember.id);
    const pregnancyWeeks = selectedMember.isPregnant && selectedMember.dueDate
      ? Math.max(0, 40 - Math.ceil((new Date(selectedMember.dueDate).getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000)))
      : null;

    return (
      <div>
        <button onClick={() => setSelectedMember(null)} className="mb-4 text-sm text-gray-500 flex items-center gap-1">
          <ChevronRight className="h-4 w-4 rotate-180" /> Back to family
        </button>

        <div className="mb-4 flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
          <span className="text-4xl">{getAvatar(selectedMember)}</span>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{selectedMember.name}</h2>
            <p className="text-sm text-gray-500">
              {RELATIONSHIP_LABELS[selectedMember.relationship]} · {selectedMember.age} years old
            </p>
          </div>
        </div>

        {selectedMember.isPregnant && (
          <div className="mb-4 rounded-2xl border border-pink-200 bg-pink-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-pink-800">
              <Heart className="h-4 w-4" /> Pregnancy
            </h3>
            {pregnancyWeeks !== null ? (
              <p className="mt-1 text-sm text-pink-700">Week {pregnancyWeeks} of 40</p>
            ) : (
              <p className="mt-1 text-sm text-pink-700">Expecting</p>
            )}
          </div>
        )}

        {/* Quick actions */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          <button
            onClick={() => { setShowLogForm(true); setLogType("mood"); }}
            className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white p-3 shadow-sm active:scale-95"
          >
            <span className="text-xl">😊</span>
            <span className="text-[10px] font-semibold text-gray-600">Log Mood</span>
          </button>
          <button
            onClick={() => { setShowLogForm(true); setLogType("water"); }}
            className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white p-3 shadow-sm active:scale-95"
          >
            <span className="text-xl">💧</span>
            <span className="text-[10px] font-semibold text-gray-600">Water</span>
          </button>
          <button
            onClick={() => { setShowLogForm(true); setLogType("activity"); }}
            className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white p-3 shadow-sm active:scale-95"
          >
            <span className="text-xl">🏃</span>
            <span className="text-[10px] font-semibold text-gray-600">Activity</span>
          </button>
        </div>

        {/* Log form */}
        {showLogForm && (
          <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Log {logTypeLabels[logType]}</h3>
              <button onClick={() => setShowLogForm(false)}><X className="h-4 w-4 text-gray-400" /></button>
            </div>
            {logType === "mood" ? (
              <div className="mb-3 flex justify-center gap-3">
                {moodEmojis.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => setLogValue(i + 1)}
                    className={`text-3xl transition-transform ${logValue === i + 1 ? "scale-125" : "opacity-50"}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="number"
                value={logValue}
                onChange={(e) => setLogValue(Number(e.target.value))}
                className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-center text-lg font-bold focus:outline-none"
              />
            )}
            <input
              value={logNote}
              onChange={(e) => setLogNote(e.target.value)}
              placeholder="Add a note (optional)"
              className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none"
            />
            <button
              onClick={addHealthLog}
              className="w-full rounded-xl bg-[#C0392B] py-2.5 text-sm font-semibold text-white shadow-md active:scale-[0.98]"
            >
              Save
            </button>
          </div>
        )}

        {/* Recent logs */}
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Recent logs</h3>
        {logs.length === 0 ? (
          <p className="rounded-xl bg-white p-4 text-center text-sm text-gray-400">No logs yet. Start tracking!</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                <span className="text-xl">
                  {log.type === "mood" ? moodEmojis[(log.value || 3) - 1] : log.type === "water" ? "💧" : log.type === "activity" ? "🏃" : "📝"}
                </span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-800">
                    {logTypeLabels[log.type]}: {log.type === "mood" ? moodEmojis[(log.value || 3) - 1] : log.value}
                  </span>
                  {log.note && <p className="text-xs text-gray-400">{log.note}</p>}
                </div>
                <span className="text-[10px] text-gray-400">
                  {new Date(log.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Family list view
  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
          <Heart className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Family Health</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track health for your whole family. All data stays on your phone.
        </p>
      </div>

      {/* Family members */}
      {members.length > 0 && (
        <div className="mb-4 space-y-2">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
            >
              <button onClick={() => setSelectedMember(m)} className="flex flex-1 items-center gap-3">
                <span className="text-3xl">{getAvatar(m)}</span>
                <div className="text-left">
                  <span className="text-sm font-semibold text-gray-800">{m.name}</span>
                  <p className="text-xs text-gray-400">
                    {RELATIONSHIP_LABELS[m.relationship]} · {m.age}y
                    {m.isPregnant && " · 🤰 Expecting"}
                  </p>
                </div>
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedMember(m)} className="rounded-lg bg-gray-50 p-2">
                  <Activity className="h-4 w-4 text-gray-400" />
                </button>
                <button onClick={() => removeMember(m.id)} className="rounded-lg bg-red-50 p-2">
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add member form */}
      {showAddForm ? (
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Add family member</h3>
            <button onClick={() => setShowAddForm(false)}><X className="h-4 w-4 text-gray-400" /></button>
          </div>
          <div className="space-y-3">
            <input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Name"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-pink-500 focus:outline-none"
            />
            <select
              value={formRelationship}
              onChange={(e) => setFormRelationship(e.target.value as FamilyMember["relationship"])}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none"
            >
              <option value="self">Me</option>
              <option value="child">My child</option>
              <option value="spouse">Spouse / Partner</option>
              <option value="parent">Parent</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                value={formAge}
                onChange={(e) => setFormAge(e.target.value)}
                placeholder="Age"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none"
              />
              <select
                value={formGender}
                onChange={(e) => setFormGender(e.target.value as FamilyMember["gender"])}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formPregnant}
                onChange={(e) => setFormPregnant(e.target.checked)}
                className="rounded"
              />
              Currently pregnant
            </label>
            <button
              onClick={addMember}
              disabled={!formName.trim()}
              className="w-full rounded-xl bg-pink-500 py-2.5 text-sm font-semibold text-white shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              Add to family
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white py-4 text-sm font-semibold text-gray-500 transition-all hover:border-pink-300 hover:text-pink-500 active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" /> Add family member
        </button>
      )}

      {members.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white p-6 text-center shadow-sm">
          <span className="text-4xl">👨‍👩‍👧‍👦</span>
          <h3 className="mt-3 text-sm font-bold text-gray-800">Your family health hub</h3>
          <p className="mt-1 text-xs text-gray-500">
            Add family members to track their health, vaccinations, and medications.
            Everything stays on your phone — no account needed.
          </p>
        </div>
      )}

      {/* Info cards */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-green-100 bg-green-50 p-3">
          <Syringe className="mb-1 h-5 w-5 text-green-500" />
          <span className="text-xs font-semibold text-green-800">Vaccine tracking</span>
          <p className="text-[10px] text-green-600">Coming soon for each member</p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
          <Calendar className="mb-1 h-5 w-5 text-blue-500" />
          <span className="text-xs font-semibold text-blue-800">Medication reminders</span>
          <p className="text-[10px] text-blue-600">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
