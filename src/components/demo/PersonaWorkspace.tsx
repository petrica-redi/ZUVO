"use client";

import { Link } from "@/navigation";
import { usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import { Package } from "lucide-react";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";
import { panelRouteForPersona } from "@/lib/demo/persona-models";

export function PersonaWorkspace() {
  const { demoMode, personaId, model } = useDemoPersona();
  const pathname = usePathname();
  const t = useTranslations("demo");

  if (!demoMode || !panelRouteForPersona(personaId, pathname)) return null;

  switch (model.panelKey) {
    case "community":
      return <VisualPanel icon={Package} accent="from-[#059669] to-[#10B981]" t={t} body={<CommunityBody t={t} />} />;
    case "mediator":
      return null;
    case "manager":
      return null;
    case "doctor":
      return null;
    case "admin":
      return null;
    default:
      return null;
  }
}

type TFn = ReturnType<typeof useTranslations<"demo">>;

function VisualPanel({
  icon: Icon,
  accent,
  t,
  body,
}: {
  icon: typeof Package;
  accent: string;
  t: TFn;
  body: React.ReactNode;
}) {
  const { model } = useDemoPersona();

  return (
    <section className="mx-auto mb-2 max-w-3xl px-4 pt-2">
      <div className="overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-white shadow-3">
        <div className={`bg-gradient-to-r ${accent} px-4 py-3 text-white`}>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/80">
            {t(model.roleSubtitleKey)}
          </p>
          <p className="font-display text-sm font-extrabold">{t("panelLive")}</p>
        </div>
        <div>
          <div className="p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white`}>
                <Icon className="lucide h-5 w-5" strokeWidth={2} />
              </div>
              {body}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunityBody({ t }: { t: TFn }) {
  return (
    <div>
      <p className="font-display text-sm font-extrabold">{t("panelCommunityTitle")}</p>
      <p className="text-xs text-[var(--color-text-secondary)]">{t("panelCommunitySubtitle")}</p>
      <div className="mt-2 flex gap-2">
        <Link href="/scan" className="rounded-full bg-[#ECFDF5] px-3 py-1 text-[11px] font-bold text-[#065F46]">
          {t("panelCommunityAction1")}
        </Link>
        <Link href="/chat" className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[11px] font-bold text-[#1E40AF]">
          {t("panelCommunityActionChat")}
        </Link>
      </div>
    </div>
  );
}

