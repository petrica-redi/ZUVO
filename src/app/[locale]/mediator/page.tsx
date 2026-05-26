import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { MediatorDashboard } from "@/components/MediatorDashboard";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mediator" });
  return { title: t("title"), description: t("subtitle") };
}

const LABEL_KEYS = [
  "title",
  "subtitle",
  "ecHint",
  "accessCodePlaceholder",
  "accessCodeHint",
  "accessCodeError",
  "accessCodeSubmit",
  "tabDashboard",
  "tabCases",
  "tabSessions",
  "tabTools",
  "communityMembers",
  "logsThisMonth",
  "openCases",
  "sessionsThisMonth",
  "quickActions",
  "logVisit",
  "newCase",
  "newSession",
  "recentActivity",
  "noActivity",
  "memberName",
  "notes",
  "saveVisit",
  "visitSaved",
  "casesTitle",
  "noCases",
  "caseName",
  "caseCategory",
  "caseStatus",
  "caseNotes",
  "nextVisit",
  "saveCase",
  "caseSaved",
  "categoryHealth",
  "categorySocial",
  "categoryEducation",
  "categoryRights",
  "statusIdentified",
  "statusAssessment",
  "statusPlan",
  "statusMonitoring",
  "statusClosed",
  "sessionsTitle",
  "noSessions",
  "sessionTitle",
  "sessionTopic",
  "sessionLocation",
  "sessionAttendees",
  "sessionNotes",
  "saveSession",
  "sessionSaved",
  "toolsTitle",
  "toolsScan",
  "toolsVaccines",
  "toolsRights",
  "toolsExplain",
  "toolsChat",
  "contactSupport",
  "resources",
  "downloadGuide",
] as const;

export default async function MediatorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mediator" });

  const labels = Object.fromEntries(LABEL_KEYS.map((key) => [key, t(key)])) as Record<
    (typeof LABEL_KEYS)[number],
    string
  >;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
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
