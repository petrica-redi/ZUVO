import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeartHandshake } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { HelpRequestForm } from "@/components/HelpRequestForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "operations" });
  return { title: t("helpPageTitle"), description: t("helpPageSubtitle") };
}

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "operations" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-8">
        <div className="px-5 py-6">
          <div className="mb-6 rounded-2xl border border-[var(--color-sage-200)] bg-[var(--color-surface)] p-5 shadow-1">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-sage-100)] text-[var(--color-sage-700)]">
              <HeartHandshake className="h-6 w-6" aria-hidden />
            </div>
            <h1 className="mb-1 text-2xl font-bold text-[var(--color-text-primary)]">
              {t("helpPageTitle")}
            </h1>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {t("helpPageSubtitle")}
            </p>
          </div>
          <HelpRequestForm />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
