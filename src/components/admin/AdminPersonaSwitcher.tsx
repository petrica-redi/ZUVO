"use client";

import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Eye, Users, Shield, BarChart3, Stethoscope, Loader2 } from "lucide-react";
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
  const [previewing, setPreviewing] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const preview = useCallback(async () => {
    if (previewing) return;
    setPreviewing(true);
    setOpen(false);
    setPersona(selected);
    enableDemoMode();
    sessionStorage.setItem("redi_demo_welcome", selected);
    const href = getPersonaModel(selected).homeHref;
    router.push(href);
  }, [selected, setPersona, enableDemoMode, router, previewing]);

  const selectedPersona = PREVIEW_PERSONAS.find((p) => p.id === selected)!;
  const Icon = ICONS[selected as keyof typeof ICONS] ?? Users;

  const dropdown = (
    <div ref={rootRef} className={variant === "compact" ? "relative z-20 min-w-[220px]" : "relative z-20 flex-1"}>
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
        className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border bg-white text-left transition-all hover:border-[var(--color-ink-900)]/20 hover:shadow-2 ${
          open
            ? "border-[var(--color-ink-900)]/25 shadow-2 ring-2 ring-[var(--color-ink-900)]/8"
            : "border-[var(--color-border-default)] shadow-1"
        } ${variant === "compact" ? "px-3 py-2.5" : "px-4 py-3.5"}`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            className="flex shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{
              backgroundColor: selectedPersona.color,
              width: variant === "compact" ? 32 : 40,
              height: variant === "compact" ? 32 : 40,
            }}
          >
            <Icon className={variant === "compact" ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2} />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-extrabold text-[var(--color-text-primary)]">
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
          className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-white py-1 shadow-4"
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
                  className={`flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-surface-subtle)] ${
                    isSelected ? "bg-[var(--color-surface-subtle)]" : ""
                  }`}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: p.color }}
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
      disabled={previewing}
      className={`admin-btn-primary inline-flex cursor-pointer items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 ${
        variant === "compact" ? "px-4 py-2.5 text-sm" : "h-14 w-full px-8 text-base md:w-auto"
      }`}
    >
      {previewing ? (
        <Loader2 className={variant === "compact" ? "h-4 w-4 animate-spin" : "h-5 w-5 animate-spin"} />
      ) : (
        <Eye className={variant === "compact" ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2} />
      )}
      {previewing ? t("adminPreviewLoading") : t("adminPreviewBtn")}
    </button>
  );

  if (variant === "compact") {
    return (
      <div className="relative z-20 flex flex-wrap items-center gap-2">
        {dropdown}
        {previewBtn}
      </div>
    );
  }

  return (
    <section className="admin-cms-card overflow-visible">
      <div className="admin-cms-card__header px-6 py-6 md:px-8 md:py-7">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/55">
          {t("adminPreviewEyebrow")}
        </p>
        <h2 className="font-headline mt-2 text-2xl font-extrabold tracking-tight text-white md:text-[1.75rem]">
          {t("adminPreviewTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/72 md:text-[15px]">
          {t("adminPreviewLead")}
        </p>
        <ol className="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-white/80">
          <li className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[11px] font-extrabold">
              1
            </span>
            {t("adminStepChoose")}
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[11px] font-extrabold">
              2
            </span>
            {t("adminStepPreview")}
          </li>
        </ol>
      </div>

      <div className="relative z-10 flex flex-col gap-4 overflow-visible p-6 md:flex-row md:items-end md:p-8">
        {dropdown}
        {previewBtn}
      </div>
    </section>
  );
}

function cap(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1);
}
