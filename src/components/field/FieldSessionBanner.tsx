"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { logoutFieldStaff } from "@/lib/field/actions";
import type { FieldRole } from "@/lib/field/types";

const ROLE_KEY: Record<FieldRole, string> = {
  mediator: "roleMediator",
  nurse: "roleNurse",
  case_manager: "roleCaseManager",
  supervisor: "roleSupervisor",
};

export function FieldSessionBanner({
  displayName,
  role,
  countyCode,
  workspaceId,
}: {
  displayName: string;
  role: FieldRole;
  countyCode: string;
  workspaceId: string;
}) {
  const t = useTranslations("fieldAuth");

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-extrabold text-[var(--color-ink-900)]">
          {displayName}
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-brand-700)]">
          {t(ROLE_KEY[role] as "roleMediator")}
          {countyCode ? ` · ${countyCode}` : ""}
          <span className="ml-2 font-mono normal-case tracking-normal text-[var(--color-text-muted)]">
            {workspaceId.slice(0, 12)}
          </span>
        </p>
      </div>
      <form action={logoutFieldStaff}>
        <button
          type="submit"
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[var(--color-border-default)] bg-white px-3 text-xs font-bold text-[var(--color-text-secondary)]"
        >
          <LogOut className="h-3.5 w-3.5" />
          {t("logout")}
        </button>
      </form>
    </div>
  );
}
