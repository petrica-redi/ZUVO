"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileHeart,
  LockKeyhole,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { DEMO_DOCTOR_QUEUE } from "@/lib/demo/seed-data";

type QueueItem = (typeof DEMO_DOCTOR_QUEUE)[number];

const severity = {
  green: {
    label: { en: "Routine", ro: "De rutină" },
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    Icon: CheckCircle2,
  },
  amber: {
    label: { en: "Same day", ro: "În aceeași zi" },
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    Icon: Clock3,
  },
  red: {
    label: { en: "Emergency escalated", ro: "Urgență escaladată" },
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    Icon: AlertTriangle,
  },
} as const;

export function ClinicianQueue({ locale }: { locale: string }) {
  const lang = locale === "ro" ? "ro" : "en";
  const [selected, setSelected] = useState<QueueItem>(DEMO_DOCTOR_QUEUE[2]!);
  const copy =
    lang === "ro"
      ? {
          eyebrow: "Spațiu clinic securizat",
          title: "Coadă Tele-Health",
          lead: "Trimiteri anonimizate de la mediatori și echipe mobile. Doar context clinic relevant.",
          illustrative: "Date demonstrative · fără pacienți reali",
          queue: "Trimiteri active",
          received: "Primit",
          source: "Sursă",
          age: "Vârstă",
          context: "Rezumat clinic",
          action: "Acțiune recomandată",
          protected: "Datele de contact și identificatorii au fost eliminați automat.",
          acknowledge: "Confirmă preluarea",
          call112: "Escalare 112 confirmată",
        }
      : {
          eyebrow: "Secure clinical workspace",
          title: "Tele-Health queue",
          lead: "Anonymised referrals from mediators and mobile teams. Relevant clinical context only.",
          illustrative: "Demonstration data · no real patients",
          queue: "Active referrals",
          received: "Received",
          source: "Source",
          age: "Age",
          context: "Clinical summary",
          action: "Recommended action",
          protected: "Contact details and direct identifiers were removed automatically.",
          acknowledge: "Acknowledge case",
          call112: "112 escalation confirmed",
        };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <header className="mb-8 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="eyebrow">
            <Stethoscope className="h-3.5 w-3.5" />
            {copy.eyebrow}
          </p>
          <h1 className="font-editorial mt-3 text-4xl font-medium text-[var(--color-text-primary)] md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
            {copy.lead}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 md:self-auto">
          <ShieldCheck className="h-4 w-4" />
          {copy.illustrative}
        </span>
      </header>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-white shadow-2">
          <div className="border-b border-[var(--color-border-subtle)] px-5 py-4">
            <h2 className="font-display text-sm font-extrabold text-[var(--color-text-primary)]">
              {copy.queue}
            </h2>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {DEMO_DOCTOR_QUEUE.map((item) => {
              const style = severity[item.severity];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item)}
                  className={`flex w-full items-start gap-3 px-5 py-5 text-left transition-colors hover:bg-[var(--color-neutral-50)] ${
                    selected.id === item.id ? "bg-blue-50/70" : ""
                  }`}
                >
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-sm font-extrabold text-[var(--color-text-primary)]">
                      {item.ref}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-[var(--color-text-secondary)]">
                      {item.summary}
                    </span>
                    <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                      {item.received}
                    </span>
                  </span>
                  <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                </button>
              );
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-white shadow-3">
          <div className="border-b border-[var(--color-border-subtle)] bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                  {selected.ref}
                </p>
                <h2 className="mt-1 font-display text-xl font-extrabold">{selected.summary}</h2>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold ${severity[selected.severity].badge}`}>
                {(() => {
                  const StatusIcon = severity[selected.severity].Icon;
                  return <StatusIcon className="h-3.5 w-3.5" />;
                })()}
                {severity[selected.severity].label[lang]}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-[var(--color-neutral-50)] p-4 md:grid-cols-3">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{copy.age}</dt>
                <dd className="mt-1 text-sm font-bold text-[var(--color-text-primary)]">{selected.age}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{copy.received}</dt>
                <dd className="mt-1 text-sm font-bold text-[var(--color-text-primary)]">{selected.received}</dd>
              </div>
              <div className="col-span-2 md:col-span-1">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{copy.source}</dt>
                <dd className="mt-1 text-sm font-bold text-[var(--color-text-primary)]">{selected.source}</dd>
              </div>
            </dl>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--color-border-subtle)] p-5">
                <h3 className="flex items-center gap-2 text-sm font-extrabold text-[var(--color-text-primary)]">
                  <FileHeart className="h-4 w-4 text-blue-600" />
                  {copy.context}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {selected.context}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--color-border-subtle)] p-5">
                <h3 className="flex items-center gap-2 text-sm font-extrabold text-[var(--color-text-primary)]">
                  <UserRound className="h-4 w-4 text-emerald-600" />
                  {copy.action}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {selected.action}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-900">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
              {copy.protected}
            </div>

            <button
              type="button"
              className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-extrabold text-white shadow-2 transition-transform active:scale-[0.98] ${
                selected.severity === "red"
                  ? "bg-gradient-to-r from-red-600 to-red-700"
                  : "bg-gradient-to-r from-blue-600 to-emerald-600"
              }`}
            >
              {selected.severity === "red" ? <PhoneCall className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              {selected.severity === "red" ? copy.call112 : copy.acknowledge}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
