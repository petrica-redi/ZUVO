import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ChatAdvisor } from "@/components/ChatAdvisor";

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
    emergencyCall: t("emergencyCall"),
    suggestedQuestions: t("suggestedQuestions"),
    suggestions: [t("q1"), t("q2"), t("q3"), t("q4"), t("q5"), t("q6")],
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Header />
      <main className="flex-1 pt-14 pb-20">
        <div className="mx-auto max-w-lg px-3">
          <ChatAdvisor labels={labels} locale={locale} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
