"use client";

import Image from "next/image";
import { Link } from "@/navigation";
import { usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import {
  Package,
  Shield,
  BarChart3,
  Stethoscope,
  Settings,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";
import { panelRouteForPersona } from "@/lib/demo/persona-models";
import { DEMO_DOCTOR_QUEUE } from "@/lib/demo/seed-data";
import { TOUR_STEPS } from "@/lib/demo/tour";

export function PersonaWorkspace() {
  const { demoMode, personaId, model } = useDemoPersona();
  const pathname = usePathname();
  const t = useTranslations("demo");

  if (!demoMode || !panelRouteForPersona(personaId, pathname)) return null;

  const visual = TOUR_STEPS.find((s) => s.id === personaId);

  switch (model.panelKey) {
    case "community":
      return <VisualPanel visual={visual} icon={Package} accent="from-[#059669] to-[#10B981]" t={t} body={<CommunityBody t={t} />} />;
    case "mediator":
      return <VisualPanel visual={visual} icon={Shield} accent="from-[#2563EB] to-[#1D4ED8]" t={t} body={<MediatorBody t={t} />} />;
    case "manager":
      return <VisualPanel visual={visual} icon={BarChart3} accent="from-[#7C3AED] to-[#6D28D9]" t={t} body={<ManagerBody t={t} />} />;
    case "doctor":
      return <VisualPanel visual={visual} icon={Stethoscope} accent="from-[#DC2626] to-[#B91C1C]" t={t} body={<DoctorBody t={t} />} />;
    case "admin":
      return <VisualPanel visual={visual} icon={Settings} accent="from-[#475569] to-[#334155]" t={t} body={<AdminBody t={t} />} />;
    default:
      return null;
  }
}

type TFn = ReturnType<typeof useTranslations<"demo">>;

function VisualPanel({
  visual,
  icon: Icon,
  accent,
  t,
  body,
}: {
  visual?: (typeof TOUR_STEPS)[number];
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
        <div className="grid md:grid-cols-[1fr_120px]">
          <div className="p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white`}>
                <Icon className="lucide h-5 w-5" strokeWidth={2} />
              </div>
              {body}
            </div>
          </div>
          {visual && (
            <div className="relative hidden min-h-[100px] md:block">
              <Image src={visual.image} alt="" fill className="object-cover" sizes="120px" />
              <div className={`absolute inset-0 bg-gradient-to-l ${accent} opacity-40`} />
            </div>
          )}
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

function MediatorBody({ t }: { t: TFn }) {
  return (
    <div>
      <p className="font-display text-sm font-extrabold">{t("panelMediatorTitle")}</p>
      <p className="text-xs text-[var(--color-text-secondary)]">{t("panelMediatorJob1")}</p>
      <p className="mt-2 text-[11px] font-bold text-[#1E40AF]">{t("panelMediatorKit")}</p>
    </div>
  );
}

function ManagerBody({ t }: { t: TFn }) {
  return (
    <div>
      <p className="font-display text-sm font-extrabold">{t("panelManagerTitle")}</p>
      <div className="mt-2 flex gap-3">
        {["41", "1.2k", "0"].map((v, i) => (
          <div key={i} className="text-center">
            <div className="font-display text-lg font-extrabold text-[#7C3AED]">{v}</div>
            <div className="text-[9px] font-bold text-[var(--color-text-muted)]">
              {[t("panelManagerStat1"), t("panelManagerStat2"), t("panelManagerStat3")][i]}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 flex items-center gap-1 text-[10px] text-[#6D28D9]">
        <Lock className="h-3 w-3" /> {t("panelManagerNote")}
      </p>
    </div>
  );
}

function DoctorBody({ t }: { t: TFn }) {
  const top = DEMO_DOCTOR_QUEUE[0];
  return (
    <div>
      <p className="font-display text-sm font-extrabold">{t("panelDoctorTitle")}</p>
      {top && (
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          {top.ref} · {top.summary}
        </p>
      )}
      <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">{t("panelDoctorNote")}</p>
    </div>
  );
}

function AdminBody({ t }: { t: TFn }) {
  return (
    <div>
      <p className="font-display text-sm font-extrabold">{t("panelAdminTitle")}</p>
      <p className="text-xs text-[var(--color-text-secondary)]">{t("panelAdminDesc")}</p>
      <Link href="/admin/dashboard" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-text-primary)]">
        {t("panelAdminCta")} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
