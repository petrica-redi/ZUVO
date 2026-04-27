import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ChatAdvisor } from "@/components/ChatAdvisor";
import { AppShell, ScreenMain } from "@/components/layout/AppShell";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return { title: t("cta"), description: t("subtitle") };
}

export default async function ChatPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "chat" });

  const labels = {
    placeholder: t("placeholder"),
    thinking: t("thinking"),
    errorMessage: t("errorMessage"),
    disclaimer: t("disclaimer"),
    legalFooter: t("legalFooter"),
    emergencyCall: t("emergencyCall"),
    suggestedQuestions: t("suggestedQuestions"),
    emptyStateTitle: t("emptyStateTitle"),
    inputAria: t("inputAria"),
    sendAria: t("sendAria"),
    suggestions: [t("q1"), t("q2"), t("q3"), t("q4"), t("q5"), t("q6")],
  };

  return (
    <AppShell>
      <Header />
      <ScreenMain className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col px-3 sm:px-4">
          <ChatAdvisor labels={labels} locale={locale} />
        </div>
      </ScreenMain>
      <BottomNav />
    </AppShell>
  );
}
