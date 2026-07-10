"use client";

import { useMemo, useState } from "react";
import {
  SESSION_THEMES,
  type MediatorSession,
  type SessionTheme,
} from "@/lib/mediator/types";
import type { MediatorLabels } from "./labels";
import { EmptyState, FormCard, SaveButton, SectionTitle, fieldClass } from "./parts";

function isThisMonth(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function SessionsTab({
  labels,
  sessions,
  onSave,
}: {
  labels: MediatorLabels;
  sessions: MediatorSession[];
  onSave: (session: MediatorSession) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState<SessionTheme>("vaccination");
  const [topic, setTopic] = useState("");
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const sessionsThisMonth = useMemo(
    () => sessions.filter((s) => isThisMonth(s.sessionDate)).length,
    [sessions],
  );

  const submit = () => {
    if (!title.trim()) return;
    onSave({
      id: crypto.randomUUID(),
      title: title.trim(),
      topic: topic.trim(),
      location: location.trim(),
      attendees: attendees.trim(),
      notes: notes.trim(),
      sessionDate: new Date().toISOString(),
      theme,
    });
    setSaved(true);
    setTitle("");
    setTopic("");
    setLocation("");
    setAttendees("");
    setNotes("");
    setTheme("vaccination");
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <SectionTitle
        action={
          <span className="rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs font-bold text-[var(--color-text-muted)] shadow-1">
          {labels.sessionsThisMonth}: {sessionsThisMonth}
          </span>
        }
      >
        {labels.sessionsTitle}
      </SectionTitle>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mb-4 w-full rounded-2xl bg-gradient-to-r from-[var(--color-sage-700)] to-[var(--color-sage-600)] py-3 text-sm font-extrabold text-white shadow-[0_10px_26px_-14px_rgba(21,128,61,0.75)]"
      >
        {labels.newSession}
      </button>

      {open && (
        <FormCard>
          <input
            type="text"
            placeholder={labels.sessionTitle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label={labels.sessionTitle}
            className={`mb-3 ${fieldClass}`}
          />
          <label className="mb-3 flex flex-col gap-1 text-[11px] font-semibold text-[var(--color-text-muted)]">
            {labels.sessionThemeLabel}
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as SessionTheme)}
              aria-label={labels.sessionThemeLabel}
              className={fieldClass}
            >
              {SESSION_THEMES.map((t) => (
                <option key={t} value={t}>
                  {labels[`sessionTheme_${t}` as keyof MediatorLabels]}
                </option>
              ))}
            </select>
          </label>
          <input
            type="text"
            placeholder={labels.sessionTopic}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            aria-label={labels.sessionTopic}
            className={`mb-3 ${fieldClass}`}
          />
          <input
            type="text"
            placeholder={labels.sessionLocation}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label={labels.sessionLocation}
            className={`mb-3 ${fieldClass}`}
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder={labels.sessionAttendees}
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            aria-label={labels.sessionAttendees}
            className={`mb-3 ${fieldClass}`}
          />
          <textarea
            placeholder={labels.sessionNotes}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-label={labels.sessionNotes}
            rows={3}
            className={`mb-3 ${fieldClass}`}
          />
          <SaveButton
            saved={saved}
            savedLabel={labels.sessionSaved}
            saveLabel={labels.saveSession}
            disabled={!title.trim()}
            onClick={submit}
          />
        </FormCard>
      )}

      {sessions.length === 0 ? (
        <EmptyState message={labels.noSessions} />
      ) : (
        <ul className="flex flex-col gap-3">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-[0_10px_35px_-24px_rgba(15,23,42,0.28)]"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-bold text-[var(--color-text-primary)]">{s.title}</span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {new Date(s.sessionDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs font-semibold text-[var(--color-sage-700)]">
                {labels[`sessionTheme_${s.theme ?? "other"}` as keyof MediatorLabels]}
              </p>
              {s.topic && <p className="text-sm text-[var(--color-text-secondary)]">{s.topic}</p>}
              {s.location && (
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{s.location}</p>
              )}
              {s.attendees && (
                <p className="text-xs text-[var(--color-text-muted)]">
                  {labels.sessionAttendees}: {s.attendees}
                </p>
              )}
              {s.notes && (
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{s.notes}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
