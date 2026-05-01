"use client";

import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

type Props = {
  pillarId: string;
  moduleId: string;
  completeLabel: string;
  completedLabel: string;
  pillarColor: string;
  /** Called after local + server progress is written (e.g. award XP). */
  onCompleted?: () => void;
};

const STORAGE_KEY = "sastipe_progress";

function getProgress(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function setProgress(pillarId: string, moduleId: string) {
  const p = getProgress();
  p[`${pillarId}:${moduleId}`] = "completed";
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function MarkCompleteButton({
  pillarId,
  moduleId,
  completeLabel,
  completedLabel,
  pillarColor,
  onCompleted,
}: Props) {
  const [completed, setCompleted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const p = getProgress();
    if (p[`${pillarId}:${moduleId}`] === "completed") {
      setCompleted(true);
    }
  }, [pillarId, moduleId]);

  const handleComplete = async () => {
    if (completed) return;
    setAnimating(true);
    setProgress(pillarId, moduleId);

    // Fire-and-forget API call
    const anonId =
      localStorage.getItem("sastipe_anon_id") ?? crypto.randomUUID();
    localStorage.setItem("sastipe_anon_id", anonId);

    fetch("/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-anonymous-id": anonId,
      },
      body: JSON.stringify({ pillarId, moduleId, status: "completed" }),
    }).catch(() => {
      /* offline — progress saved locally */
    });

    setTimeout(() => {
      setCompleted(true);
      setAnimating(false);
      onCompleted?.();
    }, 600);
  };

  if (completed) {
    return (
      <button
        disabled
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-50 p-4 text-base font-semibold text-green-700 ring-2 ring-green-200"
      >
        <CheckCircle2 className="h-5 w-5" />
        {completedLabel}
      </button>
    );
  }

  return (
    <button
      onClick={handleComplete}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl p-4 text-base font-semibold text-white shadow-lg transition-all active:scale-[0.97] ${
        animating ? "scale-95 opacity-80" : ""
      }`}
      style={{ backgroundColor: pillarColor }}
    >
      <CheckCircle2 className="h-5 w-5" />
      {completeLabel}
    </button>
  );
}
