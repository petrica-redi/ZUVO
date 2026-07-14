"use client";

import { Link } from "@/navigation";
import { usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import {
  Package,
  Calendar,
  Shield,
  ClipboardList,
  BarChart3,
  Stethoscope,
  Settings,
  Lock,
  Users,
  MapPin,
} from "lucide-react";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";
import { panelRouteForPersona } from "@/lib/demo/persona-models";
import { DEMO_DOCTOR_QUEUE } from "@/lib/demo/seed-data";

/**
 * Dawa-style persona workspace strip — renders on each persona's home route.
 */
export function PersonaWorkspace() {
  const { demoMode, personaId, model } = useDemoPersona();
  const pathname = usePathname();
  const t = useTranslations("demo");

  if (!demoMode || !panelRouteForPersona(personaId, pathname)) return null;

  switch (model.panelKey) {
    case "community":
      return <CommunityPanel t={t} />;
    case "mediator":
      return <MediatorPanel t={t} />;
    case "manager":
      return <ManagerPanel t={t} />;
    case "doctor":
      return <DoctorPanel t={t} />;
    case "admin":
      return <AdminPanel t={t} />;
    default:
      return null;
  }
}

type TFn = ReturnType<typeof useTranslations<"demo">>;

function PanelShell({
  icon: Icon,
  title,
  subtitle,
  accent,
  children,
}: {
  icon: typeof Package;
  title: string;
  subtitle: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto mb-4 max-w-3xl px-4 pt-3">
      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-4 shadow-2">
        <div className="mb-3 flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: accent }}
          >
            <Icon className="lucide h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <h2 className="font-display text-sm font-extrabold text-[var(--color-text-primary)]">
              {title}
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)]">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function CommunityPanel({ t }: { t: TFn }) {
  return (
    <PanelShell
      icon={Package}
      title={t("panelCommunityTitle")}
      subtitle={t("panelCommunitySubtitle")}
      accent="linear-gradient(135deg, #059669, #10B981)"
    >
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-[#ECFDF5] p-3">
          <Calendar className="lucide mb-1 h-4 w-4 text-[#059669]" strokeWidth={2} />
          <p className="font-bold text-[#065F46]">{t("panelCommunityCare")}</p>
          <p className="mt-1 text-[#047857]">{t("panelCommunityCareDesc")}</p>
        </div>
        <div className="rounded-xl bg-[#EFF6FF] p-3">
          <Lock className="lucide mb-1 h-4 w-4 text-[#2563EB]" strokeWidth={2} />
          <p className="font-bold text-[#1E40AF]">{t("panelCommunityPrivacy")}</p>
          <p className="mt-1 text-[#1D4ED8]">{t("panelCommunityPrivacyDesc")}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/scan" className="rounded-full bg-[#ECFDF5] px-3 py-1 text-[11px] font-bold text-[#065F46]">
          {t("panelCommunityAction1")}
        </Link>
        <Link href="/navigate" className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[11px] font-bold text-[#1E40AF]">
          {t("panelCommunityAction2")}
        </Link>
      </div>
    </PanelShell>
  );
}

function MediatorPanel({ t }: { t: TFn }) {
  return (
    <PanelShell
      icon={Shield}
      title={t("panelMediatorTitle")}
      subtitle={t("panelMediatorSubtitle")}
      accent="linear-gradient(135deg, #2563EB, #1D4ED8)"
    >
      <ul className="space-y-2 text-xs text-[var(--color-text-secondary)]">
        <li className="flex items-center gap-2">
          <ClipboardList className="lucide h-4 w-4 text-[#2563EB]" strokeWidth={2} />
          {t("panelMediatorJob1")}
        </li>
        <li className="flex items-center gap-2">
          <Users className="lucide h-4 w-4 text-[#2563EB]" strokeWidth={2} />
          {t("panelMediatorJob2")}
        </li>
        <li className="flex items-center gap-2">
          <MapPin className="lucide h-4 w-4 text-[#2563EB]" strokeWidth={2} />
          {t("panelMediatorJob3")}
        </li>
      </ul>
      <p className="mt-3 rounded-lg bg-[#EFF6FF] px-3 py-2 text-[11px] font-bold text-[#1E40AF]">
        {t("panelMediatorKit")}
      </p>
    </PanelShell>
  );
}

function ManagerPanel({ t }: { t: TFn }) {
  return (
    <PanelShell
      icon={BarChart3}
      title={t("panelManagerTitle")}
      subtitle={t("panelManagerSubtitle")}
      accent="linear-gradient(135deg, #7C3AED, #6D28D9)"
    >
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: t("panelManagerStat1"), value: "41" },
          { label: t("panelManagerStat2"), value: "1.2k" },
          { label: t("panelManagerStat3"), value: "0" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-[#F5F3FF] p-2">
            <div className="font-display text-lg font-extrabold text-[#5B21B6]">{s.value}</div>
            <div className="text-[10px] font-bold text-[#7C3AED]">{s.label}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[#6D28D9]">
        <Lock className="lucide h-3.5 w-3.5" strokeWidth={2} />
        {t("panelManagerNote")}
      </p>
    </PanelShell>
  );
}

function DoctorPanel({ t }: { t: TFn }) {
  return (
    <PanelShell
      icon={Stethoscope}
      title={t("panelDoctorTitle")}
      subtitle={t("panelDoctorSubtitle")}
      accent="linear-gradient(135deg, #DC2626, #B91C1C)"
    >
      <ul className="space-y-2">
        {DEMO_DOCTOR_QUEUE.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-[var(--color-border-subtle)] px-3 py-2 text-xs"
          >
            <div>
              <p className="font-bold text-[var(--color-text-primary)]">{item.ref}</p>
              <p className="text-[var(--color-text-muted)]">{item.summary}</p>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                item.severity === "red"
                  ? "bg-red-100 text-red-700"
                  : item.severity === "amber"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-green-100 text-green-800"
              }`}
            >
              {item.severity}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-[var(--color-text-muted)]">{t("panelDoctorNote")}</p>
    </PanelShell>
  );
}

function AdminPanel({ t }: { t: TFn }) {
  return (
    <PanelShell
      icon={Settings}
      title={t("panelAdminTitle")}
      subtitle={t("panelAdminSubtitle")}
      accent="linear-gradient(135deg, #475569, #334155)"
    >
      <p className="text-xs text-[var(--color-text-secondary)]">{t("panelAdminDesc")}</p>
      <Link
        href="/admin/dashboard"
        className="mt-3 inline-flex rounded-full bg-[var(--color-neutral-100)] px-4 py-2 text-xs font-bold text-[var(--color-text-primary)]"
      >
        {t("panelAdminCta")}
      </Link>
    </PanelShell>
  );
}
