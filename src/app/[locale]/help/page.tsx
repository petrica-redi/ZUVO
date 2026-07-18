import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeartHandshake } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { HelpRequestForm } from "@/components/HelpRequestForm";
import { PlatformToolRail } from "@/components/PlatformToolRail";

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
        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <div className="platform-shell">
            <PlatformToolRail />
            <div className="platform-glass-panel mb-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent)] text-white">
                <HeartHandshake className="h-5 w-5" aria-hidden />
              </div>
              <h1 className="platform-title font-headline text-[1.65rem] leading-[1.1] tracking-tight">
                {t("helpPageTitle")}
              </h1>
              <p className="mt-1.5 text-sm font-medium leading-relaxed text-[var(--color-text-secondary)]">
                {t("helpPageSubtitle")}
              </p>
            </div>
            <HelpRequestForm />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
