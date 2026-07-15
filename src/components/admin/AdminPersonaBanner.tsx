"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, X } from "lucide-react";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";
import { AdminPersonaSwitcher } from "@/components/admin/AdminPersonaSwitcher";

/**
 * Sticky admin toolbar — persona dropdown when authenticated as admin.
 */
export function AdminPersonaBanner() {
  const t = useTranslations("demo");
  const router = useRouter();
  const pathname = usePathname();
  const { demoMode, personaId, disableDemoMode } = useDemoPersona();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d: { authenticated?: boolean }) => setIsAdmin(!!d.authenticated))
      .catch(() => setIsAdmin(false));
  }, []);

  if (!isAdmin || pathname.includes("/admin/")) return null;

  const roleLabel =
    demoMode && personaId !== "admin"
      ? t(`persona${cap(personaId)}` as "personaCommunity")
      : null;

  return (
    <div className="sticky top-14 z-40 border-b border-[var(--color-border-subtle)] bg-white/95 shadow-sm backdrop-blur-md">
      <div className="h-px bg-[var(--color-ink-900)]/12" />
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
            {t("adminBannerEyebrow")}
          </p>
          <p className="truncate text-sm font-bold text-[var(--color-text-primary)]">
            {roleLabel ? t("adminBannerViewing", { role: roleLabel }) : t("adminBannerHint")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AdminPersonaSwitcher variant="compact" />
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="admin-btn-secondary inline-flex cursor-pointer items-center gap-1.5 px-3 py-2 text-xs"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            {t("adminBackCms")}
          </button>
          {demoMode && (
            <button
              type="button"
              onClick={() => {
                disableDemoMode();
                router.push("/admin/dashboard");
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]"
            >
              <X className="h-3.5 w-3.5" />
              Exit preview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function cap(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1);
}
