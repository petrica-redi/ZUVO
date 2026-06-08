import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAppConfig } from "@/lib/env";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui";
import {
  Shield, BookOpen, Heart, Users, MapPin, ClipboardList,
  Database, AlertTriangle, CheckCircle2,
} from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "policies" });
  const { appName } = getAppConfig();
  return { title: `${t("title")} — ${appName}`, description: t("subtitle") };
}

const POLICIES = [
  {
    id: "clinical-safety",
    Icon: Shield,
    colorBg: "bg-[var(--color-danger-bg)]",
    colorFg: "text-[var(--color-danger-accent)]",
    commitments: ["clinicalSafety1", "clinicalSafety2", "clinicalSafety3", "clinicalSafety4"],
  },
  {
    id: "source-policy",
    Icon: BookOpen,
    colorBg: "bg-[var(--color-success-bg)]",
    colorFg: "text-[var(--color-success-accent)]",
    commitments: ["sourcePolicy1", "sourcePolicy2", "sourcePolicy3"],
  },
  {
    id: "safeguarding",
    Icon: Heart,
    colorBg: "bg-[var(--color-info-bg)]",
    colorFg: "text-[var(--color-info-accent)]",
    commitments: ["safeguarding1", "safeguarding2", "safeguarding3", "safeguarding4"],
  },
  {
    id: "roma-equity",
    Icon: Users,
    colorBg: "bg-[var(--color-warning-bg)]",
    colorFg: "text-[var(--color-warning-accent)]",
    commitments: ["romaEquity1", "romaEquity2", "romaEquity3", "romaEquity4"],
  },
  {
    id: "provider-verification",
    Icon: MapPin,
    colorBg: "bg-[var(--color-surface-subtle)]",
    colorFg: "text-[var(--color-text-secondary)]",
    commitments: ["providerVerification1", "providerVerification2", "providerVerification3"],
  },
  {
    id: "mediator-policy",
    Icon: ClipboardList,
    colorBg: "bg-[var(--color-brand-bg,var(--color-surface-subtle))]",
    colorFg: "text-[var(--color-brand-accent,var(--color-accent))]",
    commitments: ["mediatorPolicy1", "mediatorPolicy2", "mediatorPolicy3", "mediatorPolicy4"],
  },
  {
    id: "data-governance",
    Icon: Database,
    colorBg: "bg-[var(--color-surface-subtle)]",
    colorFg: "text-[var(--color-text-muted)]",
    commitments: ["dataGovernance1", "dataGovernance2", "dataGovernance3", "dataGovernance4"],
  },
] as const;

export default async function PoliciesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "policies" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex-1 pb-8">
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">

          {/* Hero */}
          <div className="mb-10 text-center animate-fade-in-up">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--color-surface)] shadow-1">
              <Shield className="lucide h-8 w-8 text-[var(--color-success-accent)]" strokeWidth={1.85} />
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base max-w-lg mx-auto">
              {t("subtitle")}
            </p>
          </div>

          {/* Go / no-go banner */}
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex gap-3 animate-fade-in-up delay-100" role="note">
            <AlertTriangle className="lucide h-5 w-5 flex-shrink-0 text-amber-600 mt-0.5" strokeWidth={1.85} />
            <div>
              <p className="text-sm font-bold text-amber-900">{t("goNoGoTitle")}</p>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">{t("goNoGoBody")}</p>
            </div>
          </div>

          {/* Policy cards */}
          <div className="space-y-5">
            {POLICIES.map(({ id, Icon, colorBg, colorFg, commitments }, i) => (
              <Card
                key={id}
                variant="elevated"
                className="p-6 animate-fade-in-up"
                style={{ animationDelay: `${(i + 2) * 80}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${colorBg} ${colorFg}`}>
                    <Icon className="lucide h-6 w-6" strokeWidth={1.85} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-lg font-extrabold text-[var(--color-text-primary)] mb-1">
                      {t(`${id}Title`)}
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-3 leading-relaxed">
                      {t(`${id}Desc`)}
                    </p>
                    <ul className="space-y-1.5">
                      {commitments.map((key) => (
                        <li key={key} className="flex items-start gap-2">
                          <CheckCircle2 className="lucide h-4 w-4 flex-shrink-0 text-[var(--color-success-accent)] mt-0.5" strokeWidth={1.85} />
                          <span className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
                            {t(key)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Not-a-medical-device footer */}
          <p className="mt-8 text-center text-xs text-[var(--color-text-muted)] leading-relaxed px-4">
            {t("disclaimer")}
          </p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
