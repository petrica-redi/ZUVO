import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProfileView } from "@/components/ProfileView";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("profile"), description: t("profile") };
}

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "profile" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const labels = {
    title: t("title"),
    guestUser: t("guestUser"),
    guestSubtitle: t("guestSubtitle"),
    languagePreference: t("languagePreference"),
    changeLanguage: t("changeLanguage"),
    learningProgress: t("learningProgress"),
    pillarsStarted: t("pillarsStarted"),
    modulesCompleted: t("modulesCompleted"),
    trackingStreak: t("trackingStreak"),
    days: t("days"),
    exportData: t("exportData"),
    exportDescription: t("exportDescription"),
    clearData: t("clearData"),
    clearDataConfirm: t("clearDataConfirm"),
    aboutTitle: t("aboutTitle"),
    aboutText: t("aboutText"),
    privacyPolicy: t("privacyPolicy"),
    contactUs: t("contactUs"),
    progressNone: t("progressNone"),
    progressStart: t("progressStart"),
    version: t("version"),
    loading: tCommon("loading"),
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <main className="flex-1 pb-2">
        <div className="px-5 py-6">
          <ProfileView labels={labels} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
