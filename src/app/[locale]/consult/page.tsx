import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { ConsultationFlow } from "@/components/ConsultationFlow";
import { AppShell, ScreenMain } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "consult" });
  return {
    title: `${t("title")} — Sastipe`,
    description: t("subtitle").slice(0, 160),
  };
}

export default async function ConsultPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "consult" });
  const tLegal = await getTranslations({ locale, namespace: "legal" });

  const quick = [
    t("fever"),
    t("pain"),
    t("breathing"),
    t("skin"),
    t("pregnancy"),
    t("child"),
    t("mental"),
    t("heart"),
  ];

  return (
    <AppShell>
      <Header />
      <SosButton />
      <ScreenMain className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col px-5 py-6">
          <PageHeader
            className="shrink-0"
            eyebrow={t("pageEyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
          <div className="min-h-0 flex-1">
            <ConsultationFlow
              locale={locale}
              labels={{
                legalTitle: tLegal("aiEducationalTitle"),
                legalBody: tLegal("aiEducationalBody"),
                whatBrings: t("whatBrings"),
                orOwnWords: t("orOwnWords"),
                freePlaceholder: t("freePlaceholder"),
                answerPlaceholder: t("answerPlaceholder"),
                thinking: t("thinking"),
                backTitle: t("backTitle"),
                backSubtitle: t("backSubtitle"),
                newConsultation: t("newConsultation"),
                callEmergencyNow: t("callEmergencyNow"),
                connectionError: t("connectionError"),
                assessment: t("assessment"),
                whatToDo: t("whatToDo"),
                homeCare: t("homeCare"),
                watchFor: t("watchFor"),
                showVisitCard: t("showVisitCard"),
                hideVisitCard: t("hideVisitCard"),
                patientSummaryTitle: t("patientSummaryTitle"),
                visitCardFooter: t("visitCardFooter"),
                quick,
                severityGreen: t("severityGreen"),
                severityAmber: t("severityAmber"),
                severityRed: t("severityRed"),
                concernInputAria: t("concernInputAria"),
                answerInputAria: t("answerInputAria"),
                backButtonAria: t("backButtonAria"),
                sendAnswerAria: t("sendAnswerAria"),
              }}
            />
          </div>
        </div>
      </ScreenMain>
      <BottomNav />
    </AppShell>
  );
}
