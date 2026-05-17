"use client";

import { useRef, useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { celebrate } from "@/lib/confetti";

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
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const p = getProgress();
      if (p[`${pillarId}:${moduleId}`] === "completed") {
        setCompleted(true);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, [pillarId, moduleId]);

  const handleComplete = async () => {
    if (completed) return;
    setAnimating(true);
    setProgress(pillarId, moduleId);

    // Fire a celebratory confetti burst anchored to the button position.
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      celebrate({
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
      });
    } else {
      celebrate();
    }

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
        type="button"
        disabled
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-success-bg)] p-4 text-base font-extrabold text-[var(--color-success-text)] ring-2 ring-[var(--color-success-border)]"
      >
        <CheckCircle2 className="lucide h-5 w-5" strokeWidth={1.85} />
        {completedLabel}
      </button>
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleComplete}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand grain-overlay p-4 text-base font-extrabold text-white shadow-brand transition-all active:scale-[0.97] ${
        animating ? "scale-95 opacity-90" : ""
      }`}
      style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
      data-pillar-color={pillarColor}
    >
      <CheckCircle2 className="lucide h-5 w-5" strokeWidth={1.85} />
      {completeLabel}
    </button>
  );
}
