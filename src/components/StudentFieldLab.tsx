"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  CloudOff,
  Eye,
  Lightbulb,
  Loader2,
  Target,
} from "lucide-react";
import { Badge, Card, Button } from "@/components/ui";
import { cn } from "@/components/ui/cn";

type Props = {
  subtitle: string;
  observeLabel: string;
  decideLabel: string;
  actLabel: string;
  reflectionLabel: string;
  reflectionPlaceholder: string;
  savedLabel: string;
  saveLabel?: string;
  draftLabel?: string;
  syncedLabel?: string;
  observeHint?: string;
  decideHint?: string;
  actHint?: string;
  moduleId: string;
};

type StepKey = "observe" | "decide" | "act";

type StoredNote = { observe: string; decide: string; act: string; updatedAt: string };

const EMPTY_NOTE: StoredNote = { observe: "", decide: "", act: "", updatedAt: "" };

function noteKey(moduleId: string) {
  return `sastipe_student_field_lab:${moduleId}`;
}

function readNote(moduleId: string): StoredNote {
  if (typeof window === "undefined") return { ...EMPTY_NOTE };
  try {
    const raw = localStorage.getItem(noteKey(moduleId));
    if (!raw) return { ...EMPTY_NOTE };
    // Backwards compat: previous version stored a plain string.
    if (raw.startsWith("{")) {
      const parsed = JSON.parse(raw) as Partial<StoredNote>;
      return {
        observe: typeof parsed.observe === "string" ? parsed.observe : "",
        decide: typeof parsed.decide === "string" ? parsed.decide : "",
        act: typeof parsed.act === "string" ? parsed.act : "",
        updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
      };
    }
    return { observe: raw, decide: "", act: "", updatedAt: "" };
  } catch {
    return { ...EMPTY_NOTE };
  }
}

function writeNote(moduleId: string, note: StoredNote) {
  try {
    localStorage.setItem(noteKey(moduleId), JSON.stringify(note));
  } catch {
    /* storage may be unavailable in private mode */
  }
}

export function StudentFieldLab({
  subtitle,
  observeLabel,
  decideLabel,
  actLabel,
  reflectionLabel,
  reflectionPlaceholder,
  savedLabel,
  saveLabel,
  draftLabel,
  syncedLabel,
  observeHint,
  decideHint,
  actHint,
  moduleId,
}: Props) {
  const [step, setStep] = useState<StepKey>("observe");
  const [note, setNote] = useState<StoredNote>(EMPTY_NOTE);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initial = useRef(true);

  // Hydrate stored note client-side (deferred to avoid render cascade)
  useEffect(() => {
    const t = setTimeout(() => {
      setNote(readNote(moduleId));
      initial.current = false;
    }, 0);
    return () => clearTimeout(t);
  }, [moduleId]);

  // Autosave with debounce
  useEffect(() => {
    if (initial.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const savingTimer = setTimeout(() => setStatus("saving"), 0);
    debounceRef.current = setTimeout(() => {
      try {
        writeNote(moduleId, { ...note, updatedAt: new Date().toISOString() });
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, 600);
    return () => {
      clearTimeout(savingTimer);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [note, moduleId]);

  const STEPS: { key: StepKey; label: string; hint?: string; Icon: typeof Eye }[] = useMemo(
    () => [
      { key: "observe", label: observeLabel, hint: observeHint, Icon: Eye },
      { key: "decide", label: decideLabel, hint: decideHint, Icon: Lightbulb },
      { key: "act", label: actLabel, hint: actHint, Icon: Target },
    ],
    [observeLabel, decideLabel, actLabel, observeHint, decideHint, actHint],
  );

  const completeness = useMemo(() => {
    const filled = ["observe", "decide", "act"].filter(
      (k) => (note[k as StepKey] ?? "").trim().length > 0,
    ).length;
    return Math.round((filled / 3) * 100);
  }, [note]);

  const allFilled = completeness === 100;
  const activeNote = note[step];

  return (
    <Card variant="elevated" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-30 blur-2xl"
        style={{ background: "radial-gradient(circle, #FCD34D 0%, transparent 70%)" }}
      />
      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-md">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                {reflectionLabel}
              </h3>
              <p className="text-xs leading-relaxed text-slate-500">{subtitle}</p>
            </div>
          </div>
          <SaveStatus
            status={status}
            savedLabel={syncedLabel ?? savedLabel}
            draftLabel={draftLabel}
            updatedAt={note.updatedAt}
          />
        </div>

        {/* Step pills */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {STEPS.map(({ key, label, Icon }) => {
            const isActive = step === key;
            const filled = (note[key] ?? "").trim().length > 0;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setStep(key)}
                aria-pressed={isActive}
                className={cn(
                  "group relative rounded-2xl border p-3 text-left transition-all",
                  isActive
                    ? "border-amber-300 bg-amber-50 shadow-sm ring-1 ring-amber-200/40"
                    : "border-slate-100 bg-slate-50 hover:bg-white",
                )}
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition",
                      isActive ? "text-amber-600" : "text-slate-400 group-hover:text-slate-600",
                    )}
                  />
                  {filled && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                </div>
                <span
                  className={cn(
                    "mt-2 block text-[10px] font-black uppercase tracking-wider",
                    isActive ? "text-amber-800" : "text-slate-500",
                  )}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active step body */}
        <div className="mt-4">
          {STEPS.find((s) => s.key === step)?.hint && (
            <p className="mb-2 text-xs leading-relaxed text-slate-500">
              {STEPS.find((s) => s.key === step)?.hint}
            </p>
          )}
          <label className="block">
            <span className="sr-only">{reflectionLabel}</span>
            <textarea
              value={activeNote}
              onChange={(e) => setNote((n) => ({ ...n, [step]: e.target.value }))}
              placeholder={reflectionPlaceholder}
              rows={4}
              maxLength={600}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-sm leading-relaxed text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-300/40"
            />
          </label>
          <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>{activeNote.length}/600</span>
            <span>{completeness}%</span>
          </div>
        </div>

        {/* Action row */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Badge variant={allFilled ? "success" : "default"}>
            {allFilled ? <CheckCircle2 className="h-3 w-3" /> : <Lightbulb className="h-3 w-3" />}
            {allFilled ? savedLabel : `${completeness}%`}
          </Badge>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              try {
                writeNote(moduleId, { ...note, updatedAt: new Date().toISOString() });
                setStatus("saved");
              } catch {
                setStatus("error");
              }
            }}
          >
            <ClipboardCheck className="h-4 w-4" />
            {saveLabel ?? savedLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function SaveStatus({
  status,
  savedLabel,
  draftLabel,
  updatedAt,
}: {
  status: "idle" | "saving" | "saved" | "error";
  savedLabel: string;
  draftLabel?: string;
  updatedAt: string;
}) {
  if (status === "saving") {
    return (
      <Badge variant="info" size="sm">
        <Loader2 className="h-3 w-3 animate-spin" />
        {draftLabel ?? "Saving"}
      </Badge>
    );
  }
  if (status === "error") {
    return (
      <Badge variant="warning" size="sm">
        <CloudOff className="h-3 w-3" />
        Offline
      </Badge>
    );
  }
  if (status === "saved" || updatedAt) {
    return (
      <Badge variant="success" size="sm">
        <Cloud className="h-3 w-3" />
        {savedLabel}
      </Badge>
    );
  }
  return null;
}
