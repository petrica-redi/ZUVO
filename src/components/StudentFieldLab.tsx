"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, Lightbulb, MessageCircleQuestion } from "lucide-react";

type Props = {
  subtitle: string;
  observeLabel: string;
  decideLabel: string;
  actLabel: string;
  reflectionLabel: string;
  reflectionPlaceholder: string;
  savedLabel: string;
  moduleId: string;
};

const STEPS = [
  { key: "observe", Icon: MessageCircleQuestion },
  { key: "decide", Icon: Lightbulb },
  { key: "act", Icon: ClipboardCheck },
] as const;

export function StudentFieldLab({
  subtitle,
  observeLabel,
  decideLabel,
  actLabel,
  reflectionLabel,
  reflectionPlaceholder,
  savedLabel,
  moduleId,
}: Props) {
  const [selected, setSelected] = useState<(typeof STEPS)[number]["key"]>("observe");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const activeLabel = useMemo(() => {
    if (selected === "observe") return observeLabel;
    if (selected === "decide") return decideLabel;
    return actLabel;
  }, [actLabel, decideLabel, observeLabel, selected]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <ClipboardCheck className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
            {reflectionLabel}
          </h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
          <p className="text-xs font-semibold text-amber-700">{activeLabel}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {STEPS.map(({ key, Icon }) => {
          const label = key === "observe" ? observeLabel : key === "decide" ? decideLabel : actLabel;
          const isActive = selected === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={`rounded-2xl border p-3 text-left transition-all ${
                isActive
                  ? "border-amber-300 bg-amber-50 text-slate-900"
                  : "border-slate-100 bg-slate-50 text-slate-500"
              }`}
            >
              <Icon className="mb-2 h-4 w-4" />
              <span className="block text-[11px] font-black uppercase tracking-wide">{label}</span>
            </button>
          );
        })}
      </div>

      <label className="mt-4 block">
        <span className="sr-only">{reflectionLabel}</span>
        <textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setSaved(false);
          }}
          placeholder={reflectionPlaceholder}
          rows={3}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white"
        />
      </label>

      <button
        type="button"
        onClick={() => {
          try {
            localStorage.setItem(`sastipe_student_field_lab:${moduleId}`, note);
          } catch {
            /* Local note is optional. */
          }
          setSaved(true);
        }}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white active:scale-[0.98]"
      >
        <CheckCircle2 className="h-4 w-4" />
        {saved ? savedLabel : reflectionLabel}
      </button>
    </div>
  );
}
