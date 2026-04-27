import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { ConsultationFlow } from "@/components/ConsultationFlow";

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
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-6">
          <ConsultationFlow
            locale={locale}
            labels={{
              title: t("title"),
              subtitle: t("subtitle"),
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
              call112Now: t("call112Now"),
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
            }}
          />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
