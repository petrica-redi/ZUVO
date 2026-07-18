"use client";

import { useTranslations } from "next-intl";
import {
  ClipboardPlus,
  FileText,
  Inbox,
  MessageCircleWarning,
  Pill,
  Send,
} from "lucide-react";
import { Link } from "@/navigation";
import type { FieldRole } from "@/lib/field/types";
import {
  roleGreetingKey,
  shiftActionsForRole,
  type ShiftAction,
} from "@/lib/field/role-home";
import type { TabId } from "@/components/mediator/WorkspaceTabs";

const ICONS = {
  case: ClipboardPlus,
  literacy: Pill,
  refer: Send,
  inbox: Inbox,
  pack: FileText,
  escalate: MessageCircleWarning,
} as const;

function actionIcon(action: ShiftAction) {
  if (action.id === "refer" && action.titleKey.includes("Escalate")) {
    return ICONS.escalate;
  }
  return ICONS[action.id] ?? ClipboardPlus;
}

/**
 * Premium “My shift” — three clear actions so field staff need almost no training.
 */
export function MyShiftHome({
  role,
  displayName,
  countryCode,
  regionCode,
  urgentCount,
  tasksDue,
  onOpenTab,
  onOpenConsentCase,
}: {
  role: FieldRole;
  displayName: string;
  countryCode: "RO" | "IT";
  regionCode: string;
  urgentCount: number;
  tasksDue: number;
  onOpenTab: (tab: TabId) => void;
  onOpenConsentCase: () => void;
}) {
  const t = useTranslations("fieldOs");
  const actions = shiftActionsForRole(role);
  const firstName = displayName.trim().split(/\s+/)[0] || displayName;

  return (
    <section className="mb-6 animate-fade-in-up" aria-labelledby="my-shift-title">
      <div className="mb-4">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
          {t("eyebrow")}
        </p>
        <h1
          id="my-shift-title"
          className="platform-title font-headline mt-1.5 text-[1.7rem] leading-[1.08] tracking-tight sm:text-[1.95rem]"
        >
          {t(roleGreetingKey(role) as "greetingMediator", { name: firstName })}
        </h1>
        <p className="mt-1.5 text-sm font-medium text-[var(--color-text-secondary)]">
          {t("lead")}
        </p>
        <p className="mt-2 text-xs font-semibold text-[var(--color-text-muted)]">
          {countryCode === "IT" ? t("contextItaly") : t("contextRomania")}
          {regionCode ? ` · ${regionCode}` : ""}
        </p>
      </div>

      {(urgentCount > 0 || tasksDue > 0) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {urgentCount > 0 ? (
            <button
              type="button"
              onClick={() => onOpenTab("inbox")}
              className="rounded-full bg-[var(--color-danger-bg)] px-3 py-1.5 text-[11px] font-extrabold text-[var(--color-danger-text)]"
            >
              {t("chipUrgent", { count: urgentCount })}
            </button>
          ) : null}
          {tasksDue > 0 ? (
            <button
              type="button"
              onClick={() => onOpenTab("tasks")}
              className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1.5 text-[11px] font-extrabold text-[var(--color-accent-text)]"
            >
              {t("chipTasks", { count: tasksDue })}
            </button>
          ) : null}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {actions.map((action, index) => {
          const Icon = actionIcon(action);
          const className =
            action.tone === "primary"
              ? "platform-cta-primary !flex-col !items-start !justify-start gap-3 !px-4 !py-4 min-h-[132px] text-left"
              : action.tone === "accent"
                ? "platform-cta-secondary !flex-col !items-start !justify-start gap-3 !px-4 !py-4 min-h-[132px] text-left border-[var(--color-accent)]/30"
                : "platform-glass-panel !flex flex-col items-start justify-start gap-3 min-h-[132px] text-left transition-transform active:scale-[0.99]";

          const body = (
            <>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  action.tone === "primary"
                    ? "bg-white/20 text-white"
                    : "bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={2.1} />
              </span>
              <span>
                <span
                  className={`block text-sm font-extrabold ${
                    action.tone === "primary" ? "text-white" : "text-[var(--color-text-primary)]"
                  }`}
                >
                  {t(action.titleKey as "actionCaseTitle")}
                </span>
                <span
                  className={`mt-1 block text-xs font-medium leading-relaxed ${
                    action.tone === "primary" ? "text-white/85" : "text-[var(--color-text-secondary)]"
                  }`}
                >
                  {t(action.leadKey as "actionCaseLead")}
                </span>
              </span>
            </>
          );

          if (action.href) {
            return (
              <Link
                key={action.id}
                href={action.href}
                className={`${className} animate-fade-in-up delay-${(index + 1) * 100}`}
              >
                {body}
              </Link>
            );
          }

          return (
            <button
              key={action.id}
              type="button"
              className={`${className} animate-fade-in-up delay-${(index + 1) * 100}`}
              onClick={() => {
                if (action.id === "case") {
                  onOpenConsentCase();
                  onOpenTab(action.tab ?? "cases");
                  return;
                }
                if (action.tab) onOpenTab(action.tab);
              }}
            >
              {body}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/chat" className="platform-tool-chip" data-active="false">
          {t("quickChat")}
        </Link>
        <Link href="/scan" className="platform-tool-chip" data-active="false">
          {t("quickScan")}
        </Link>
        <Link href="/explain" className="platform-tool-chip" data-active="false">
          {t("quickRx")}
        </Link>
        <button
          type="button"
          className="platform-tool-chip"
          data-active="false"
          onClick={() => onOpenTab("more")}
        >
          {t("quickMore")}
        </button>
      </div>
    </section>
  );
}
