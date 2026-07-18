"use client";

import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, X } from "lucide-react";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";
import { getPersonaModel } from "@/lib/demo/persona-models";
import type { DemoPersonaId } from "@/lib/demo/personas";

/**
 * Brief welcome overlay after launching a persona from Admin CMS.
 */
function readPendingWelcome(): DemoPersonaId | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem("redi_demo_welcome");
  if (stored && isPersona(stored)) {
    sessionStorage.removeItem("redi_demo_welcome");
    return stored;
  }
  return null;
}

export function PersonaWelcome() {
  const t = useTranslations("demo");
  const { demoMode } = useDemoPersona();
  const [welcomeId, setWelcomeId] = useState<DemoPersonaId | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!demoMode) return;
    const id = readPendingWelcome();
    if (!id) return;
    const showTimer = window.setTimeout(() => {
      setWelcomeId(id);
      setShow(true);
    }, 0);
    const hideTimer = window.setTimeout(() => setShow(false), 5000);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [demoMode]);

  if (!show || !welcomeId) return null;

  const model = getPersonaModel(welcomeId);

  return (
    <div className="fixed inset-x-4 top-20 z-[60] mx-auto max-w-md animate-fade-in-up">
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-white shadow-4">
        <div className="h-1.5 bg-gradient-to-r from-[var(--color-ink-900)] to-[#7C3AED]" />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
                {t(model.roleSubtitleKey)}
              </p>
              <h3 className="mt-1 font-display text-lg font-extrabold text-[var(--color-text-primary)]">
                {t("welcomeTitle", {
                  role: t(`persona${cap(welcomeId)}` as "personaCommunity"),
                })}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                {t("welcomeBody")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShow(false)}
              className="shrink-0 rounded-full p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-neutral-100)]"
              aria-label={t("tourClose")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <Link
            href="/admin/dashboard"
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[var(--color-ink-900)]"
          >
            {t("switchPersona")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function cap(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function isPersona(id: string): id is DemoPersonaId {
  return ["community", "mediator", "manager", "doctor", "admin"].includes(id);
}
