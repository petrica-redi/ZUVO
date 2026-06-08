"use client";

import { useState, useEffect } from "react";
import {
  Plus, Heart, Trash2, ChevronRight,
  Syringe, Activity, Calendar, X,
} from "lucide-react";
import { useTranslations } from "next-intl";

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

const ALLOWED_RELATIONSHIPS = new Set<FamilyMember["relationship"]>([
  "self", "child", "spouse", "parent", "other",
]);
const ALLOWED_GENDERS = new Set<FamilyMember["gender"]>(["male", "female", "other"]);

function isFamilyMember(v: unknown): v is FamilyMember {
  if (!v || typeof v !== "object") return false;
  const m = v as Record<string, unknown>;
  return (
    typeof m.id === "string" &&
    typeof m.name === "string" &&
    typeof m.age === "number" &&
    ALLOWED_RELATIONSHIPS.has(m.relationship as FamilyMember["relationship"]) &&
    ALLOWED_GENDERS.has(m.gender as FamilyMember["gender"])
  );
}

function isHealthEntry(v: unknown): v is HealthEntry {
  if (!v || typeof v !== "object") return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.memberId === "string" &&
    typeof e.type === "string" &&
    typeof e.value === "number" &&
    typeof e.date === "string"
  );
}

function getMembers(): FamilyMember[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter(isFamilyMember) : [];
  } catch { return []; }
}

function saveMembers(members: FamilyMember[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

function getHealthLogs(): HealthEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(HEALTH_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter(isHealthEntry) : [];
  } catch { return []; }
}

function saveHealthLogs(logs: HealthEntry[]) {
  localStorage.setItem(HEALTH_KEY, JSON.stringify(logs));
}

export function FamilyHub() {
  const t = useTranslations("family");
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [healthLogs, setHealthLogs] = useState<HealthEntry[]>([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [now] = useState(() => Date.now());

  const [formName, setFormName] = useState("");
  const [formRelationship, setFormRelationship] = useState<FamilyMember["relationship"]>("child");
  const [formAge, setFormAge] = useState("");
  const [formGender, setFormGender] = useState<FamilyMember["gender"]>("female");
  const [formPregnant, setFormPregnant] = useState(false);

  const [logType, setLogType] = useState<HealthEntry["type"]>("mood");
  const [logValue, setLogValue] = useState(3);
  const [logNote, setLogNote] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => {
      setMembers(getMembers());
      setHealthLogs(getHealthLogs());
    }, 0);
    return () => window.clearTimeout(id);
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

  // Member detail view
  if (selectedMember) {
    const logs = getMemberLogs(selectedMember.id);
    const pregnancyWeeks = selectedMember.isPregnant && selectedMember.dueDate
      ? Math.max(0, 40 - Math.ceil((new Date(selectedMember.dueDate).getTime() - now) / (7 * 24 * 60 * 60 * 1000)))
      : null;

    return (
      <div>
        <button
          onClick={() => setSelectedMember(null)}
          className="mb-4 text-sm text-[var(--color-text-muted)] flex items-center gap-1"
        >
          <ChevronRight className="h-4 w-4 rotate-180" /> {t("back")}
        </button>

        <div className="mb-4 flex items-center gap-4 rounded-2xl bg-[var(--color-surface)] p-4 shadow-1">
          <span className="text-4xl">{getAvatar(selectedMember)}</span>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{selectedMember.name}</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {t(`relation.${selectedMember.relationship}`)} · {t("yearsOld", { age: selectedMember.age })}
            </p>
          </div>
        </div>

        {selectedMember.isPregnant && (
          <div className="mb-4 rounded-2xl border border-pink-200 bg-pink-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-pink-800">
              <Heart className="h-4 w-4" /> {t("pregnancyTitle")}
            </h3>
            {pregnancyWeeks !== null ? (
              <p className="mt-1 text-sm text-pink-700">{t("pregnancyWeeks", { weeks: pregnancyWeeks })}</p>
            ) : (
              <p className="mt-1 text-sm text-pink-700">{t("pregnancyExpecting")}</p>
            )}
          </div>
        )}

        <div className="mb-4 grid grid-cols-3 gap-2">
          {(["mood", "water", "activity"] as const).map((type) => (
            <button
              key={type}
              onClick={() => { setShowLogForm(true); setLogType(type); }}
              className="flex flex-col items-center gap-1 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 shadow-1 active:scale-95"
            >
              <span className="text-xl">{type === "mood" ? "😊" : type === "water" ? "💧" : "🏃"}</span>
              <span className="text-[10px] font-semibold text-[var(--color-text-secondary)]">
                {t(`logTypes.${type}`)}
              </span>
            </button>
          ))}
        </div>

        {showLogForm && (
          <div className="mb-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface)] p-4 shadow-1">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                {t("logFormTitle", { type: t(`logTypes.${logType}`) })}
              </h3>
              <button onClick={() => setShowLogForm(false)}>
                <X className="h-4 w-4 text-[var(--color-text-muted)]" />
              </button>
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
                aria-label={t(`logTypes.${logType}`)}
                className="mb-3 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-3 py-2 text-center text-lg font-bold text-[var(--color-text-primary)] focus:outline-none"
              />
            )}
            <input
              value={logNote}
              onChange={(e) => setLogNote(e.target.value)}
              aria-label={t("logNote")}
              placeholder={t("logNote")}
              className="mb-3 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
            />
            <button
              onClick={addHealthLog}
              className="w-full rounded-xl bg-[#C0392B] py-2.5 text-sm font-semibold text-white shadow-md active:scale-[0.98]"
            >
              {t("save")}
            </button>
          </div>
        )}

        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {t("recentLogs")}
        </h3>
        {logs.length === 0 ? (
          <p className="rounded-xl bg-[var(--color-surface)] p-4 text-center text-sm text-[var(--color-text-muted)] shadow-1">
            {t("noLogs")}
          </p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 rounded-xl bg-[var(--color-surface)] p-3 shadow-1">
                <span className="text-xl">
                  {log.type === "mood" ? moodEmojis[(log.value || 3) - 1] : log.type === "water" ? "💧" : log.type === "activity" ? "🏃" : "📝"}
                </span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    {t(`logTypes.${log.type}`)}: {log.type === "mood" ? moodEmojis[(log.value || 3) - 1] : log.value}
                  </span>
                  {log.note && <p className="text-xs text-[var(--color-text-muted)]">{log.note}</p>}
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)]">
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
      <div className="mb-6 text-center animate-fade-in-up">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-xl shadow-pink-500/25">
          <Heart className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-2xl font-black text-[var(--color-text-primary)]">{t("title")}</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{t("subtitle")}</p>
      </div>

      {members.length > 0 && (
        <div className="mb-4 space-y-2">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 shadow-1"
            >
              <button onClick={() => setSelectedMember(m)} className="flex flex-1 items-center gap-3">
                <span className="text-3xl">{getAvatar(m)}</span>
                <div className="text-left">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">{m.name}</span>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {t(`relation.${m.relationship}`)} · {m.age}y
                    {m.isPregnant && ` ${t("expecting")}`}
                  </p>
                </div>
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedMember(m)} className="rounded-lg bg-[var(--color-surface-subtle)] p-2">
                  <Activity className="h-4 w-4 text-[var(--color-text-muted)]" />
                </button>
                <button onClick={() => removeMember(m.id)} className="rounded-lg bg-[var(--color-danger-bg)] p-2">
                  <Trash2 className="h-4 w-4 text-[var(--color-danger-accent)]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm ? (
        <div className="mb-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface)] p-4 shadow-1">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{t("addMemberTitle")}</h3>
            <button onClick={() => setShowAddForm(false)}>
              <X className="h-4 w-4 text-[var(--color-text-muted)]" />
            </button>
          </div>
          <div className="space-y-3">
            <input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              aria-label={t("namePlaceholder")}
              placeholder={t("namePlaceholder")}
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-pink-500 focus:outline-none"
            />
            <select
              value={formRelationship}
              onChange={(e) => setFormRelationship(e.target.value as FamilyMember["relationship"])}
              aria-label="Relationship"
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none"
            >
              {(["self", "child", "spouse", "parent", "other"] as const).map((rel) => (
                <option key={rel} value={rel}>{t(`relation.${rel}`)}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                value={formAge}
                onChange={(e) => setFormAge(e.target.value)}
                aria-label={t("agePlaceholder")}
                placeholder={t("agePlaceholder")}
                className="flex-1 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
              />
              <select
                value={formGender}
                onChange={(e) => setFormGender(e.target.value as FamilyMember["gender"])}
                aria-label="Gender"
                className="flex-1 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none"
              >
                {(["female", "male", "other"] as const).map((g) => (
                  <option key={g} value={g}>{t(`genders.${g}`)}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <input
                type="checkbox"
                checked={formPregnant}
                onChange={(e) => setFormPregnant(e.target.checked)}
                className="rounded"
              />
              {t("pregnantLabel")}
            </label>
            <button
              onClick={addMember}
              disabled={!formName.trim()}
              className="w-full rounded-xl bg-pink-500 py-2.5 text-sm font-semibold text-white shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {t("addToFamily")}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border-default)] bg-[var(--color-surface)] py-4 text-sm font-semibold text-[var(--color-text-muted)] transition-all hover:border-pink-300 hover:text-pink-500 active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" /> {t("addMemberButton")}
        </button>
      )}

      {members.length === 0 && (
        <div className="mt-6 rounded-3xl bg-[var(--color-surface)] p-8 text-center shadow-1 animate-fade-in-up delay-200">
          <span className="text-6xl">👨‍👩‍👧‍👦</span>
          <h3 className="mt-4 text-base font-black text-[var(--color-text-primary)]">{t("emptyTitle")}</h3>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{t("emptyDesc")}</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-green-100 bg-green-50 p-3">
          <Syringe className="mb-1 h-5 w-5 text-green-500" />
          <span className="text-xs font-semibold text-green-800">{t("vaccineTrackingTitle")}</span>
          <p className="text-[10px] text-green-600">{t("vaccineTrackingDesc")}</p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
          <Calendar className="mb-1 h-5 w-5 text-blue-500" />
          <span className="text-xs font-semibold text-blue-800">{t("medicationRemindersTitle")}</span>
          <p className="text-[10px] text-blue-600">{t("medicationRemindersDesc")}</p>
        </div>
      </div>
    </div>
  );
}
