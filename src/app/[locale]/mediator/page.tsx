import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { MediatorDashboard } from "@/components/MediatorDashboard";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("mediator"), description: t("mediator") };
}

export default async function MediatorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mediator" });

  const labels = {
    title: t("title"),
    subtitle: t("subtitle"),
    accessCode: t("accessCode"),
    accessCodePlaceholder: t("accessCodePlaceholder"),
    accessCodeHint: t("accessCodeHint"),
    accessCodeError: t("accessCodeError"),
    accessCodeSubmit: t("accessCodeSubmit"),
    communityMembers: t("communityMembers"),
    logsThisMonth: t("logsThisMonth"),
    alertsActive: t("alertsActive"),
    quickActions: t("quickActions"),
    logVisit: t("logVisit"),
    recordHealth: t("recordHealth"),
    viewReports: t("viewReports"),
    recentActivity: t("recentActivity"),
    noActivity: t("noActivity"),
    memberName: t("memberName"),
    visitDate: t("visitDate"),
    notes: t("notes"),
    saveVisit: t("saveVisit"),
    visitSaved: t("visitSaved"),
    healthSummary: t("healthSummary"),
    contactSupport: t("contactSupport"),
    resources: t("resources"),
    downloadGuide: t("downloadGuide"),
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-6">
          <MediatorDashboard labels={labels} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
