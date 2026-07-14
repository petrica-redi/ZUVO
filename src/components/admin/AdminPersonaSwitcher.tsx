"use client";

import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Eye, Users, Shield, BarChart3, Stethoscope } from "lucide-react";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";
import { DEMO_PERSONAS, type DemoPersonaId } from "@/lib/demo/personas";
import { getPersonaModel } from "@/lib/demo/persona-models";

const PREVIEW_PERSONAS = DEMO_PERSONAS.filter((p) => p.id !== "admin");

const ICONS = {
  community: Users,
  mediator: Shield,
  manager: BarChart3,
  doctor: Stethoscope,
} as const;

type Props = {
  variant?: "card" | "compact";
};

/**
 * Admin-only persona preview — dropdown role picker + one-click launch.
 */
export function AdminPersonaSwitcher({ variant = "card" }: Props) {
  const t = useTranslations("demo");
  const router = useRouter();
  const { personaId, setPersona, enableDemoMode } = useDemoPersona();
  const [selected, setSelected] = useState<DemoPersonaId>(
    personaId === "admin" ? "community" : personaId,
  );
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const preview = useCallback(() => {
    setPersona(selected);
    enableDemoMode();
    sessionStorage.setItem("redi_demo_welcome", selected);
    router.push(getPersonaModel(selected).homeHref);
  }, [selected, setPersona, enableDemoMode, router]);

  const selectedPersona = PREVIEW_PERSONAS.find((p) => p.id === selected)!;
  const Icon = ICONS[selected as keyof typeof ICONS] ?? Users;

  const dropdown = (
    <div ref={rootRef} className={variant === "compact" ? "relative min-w-[200px]" : "relative flex-1"}>
      <label
        className={
          variant === "compact"
            ? "sr-only"
            : "mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]"
        }
        htmlFor="persona-dropdown-trigger"
      >
        {t("adminPersonaLabel")}
      </label>
      <button
        id="persona-dropdown-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white text-left transition-all hover:border-[var(--color-blue-500)] hover:shadow-2 ${
          open
            ? "border-[var(--color-blue-500)] shadow-2 ring-2 ring-[var(--color-blue-500)]/15"
            : "border-[var(--color-border-default)] shadow-1"
        } ${variant === "compact" ? "px-3 py-2.5" : "px-4 py-3.5"}`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ${
              variant === "compact" ? "h-8 w-8" : "h-10 w-10"
            } ${selectedPersona.gradient}`}
          >
            <Icon className={variant === "compact" ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2} />
          </span>
          <span className="min-w-0">
            <span
              className={`block truncate font-display font-extrabold text-[var(--color-text-primary)] ${
                variant === "compact" ? "text-sm" : "text-sm"
              }`}
            >
              {t(selectedPersona.labelKey)}
            </span>
            {variant === "card" && (
              <span className="block truncate text-xs text-[var(--color-text-muted)]">
                {t(`role${cap(selected)}` as "roleCommunity")}
              </span>
            )}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-white py-1 shadow-4"
        >
          {PREVIEW_PERSONAS.map((p) => {
            const PIcon = ICONS[p.id as keyof typeof ICONS] ?? Users;
            const isSelected = selected === p.id;
            return (
              <li key={p.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(p.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-neutral-50)] ${
                    isSelected ? "bg-[var(--color-accent-soft)]" : ""
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white ${p.gradient}`}
                  >
                    <PIcon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-[var(--color-text-primary)]">
                      {t(p.labelKey)}
                    </span>
                    <span className="block truncate text-[11px] text-[var(--color-text-muted)]">
                      {t(`role${cap(p.id)}` as "roleCommunity")}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  const previewBtn = (
    <button
      type="button"
      onClick={preview}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#059669] font-extrabold text-white shadow-brand transition-transform hover:brightness-105 active:scale-[0.98] ${
        variant === "compact" ? "px-4 py-2.5 text-sm" : "h-14 w-full px-8 text-base md:w-auto"
      }`}
    >
      <Eye className={variant === "compact" ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2} />
      {t("adminPreviewBtn")}
    </button>
  );

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {dropdown}
        {previewBtn}
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-white shadow-3">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1D4ED8] to-[#059669] px-6 py-6 text-white">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-6 left-1/3 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/80">
          {t("adminPreviewEyebrow")}
        </p>
        <h2 className="mt-1 font-display text-2xl font-extrabold">{t("adminPreviewTitle")}</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/90">{t("adminPreviewLead")}</p>
        <ol className="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-white/90">
          <li className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[11px] font-extrabold">
              1
            </span>
            {t("adminStepChoose")}
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[11px] font-extrabold">
              2
            </span>
            {t("adminStepPreview")}
          </li>
        </ol>
      </div>

      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-end">
        {dropdown}
        {previewBtn}
      </div>
    </section>
  );
}

function cap(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1);
}
