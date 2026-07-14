"use client";

import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, X } from "lucide-react";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";
import { getPersonaModel } from "@/lib/demo/persona-models";
import type { DemoPersonaId } from "@/lib/demo/personas";

/**
 * Brief welcome overlay after launching a persona from the tour.
 */
export function PersonaWelcome() {
  const t = useTranslations("demo");
  const { demoMode, personaId } = useDemoPersona();
  const [show, setShow] = useState(false);
  const [welcomeId, setWelcomeId] = useState<DemoPersonaId | null>(null);

  useEffect(() => {
    if (!demoMode) return;
    const stored = sessionStorage.getItem("redi_demo_welcome");
    if (stored && isPersona(stored)) {
      setWelcomeId(stored);
      setShow(true);
      sessionStorage.removeItem("redi_demo_welcome");
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [demoMode]);

  if (!show || !welcomeId) return null;

  const model = getPersonaModel(welcomeId);

  return (
    <div className="fixed inset-x-4 top-20 z-[60] mx-auto max-w-md animate-fade-in-up">
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-white shadow-4">
        <div className="h-1.5 bg-gradient-to-r from-[#2563EB] to-[#059669]" />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-blue-600)]">
                {t(model.dawaAnalogueKey)}
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
            href="/demo"
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[var(--color-blue-600)]"
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
