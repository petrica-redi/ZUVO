import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { DailyCheckin } from "@/components/DailyCheckin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("track"), description: t("track") };
}

export default async function TrackPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "track" });

  const labels = {
    title: t("title"),
    subtitle: t("subtitle"),
    moodTitle: t("moodTitle"),
    moodGreat: t("moodGreat"),
    moodGood: t("moodGood"),
    moodOkay: t("moodOkay"),
    moodLow: t("moodLow"),
    moodBad: t("moodBad"),
    waterTitle: t("waterTitle"),
    waterSubtitle: t("waterSubtitle"),
    waterGoal: t("waterGoal"),
    activityTitle: t("activityTitle"),
    activityWalk: t("activityWalk"),
    activityExercise: t("activityExercise"),
    activityRest: t("activityRest"),
    saveCheckin: t("saveCheckin"),
    savedSuccess: t("savedSuccess"),
    streakDays: t("streakDays"),
    loggedToday: t("loggedToday"),
    noLogsYet: t("noLogsYet"),
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <main className="flex-1 pb-2">
        <div className="px-5 py-6">
          <DailyCheckin labels={labels} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
