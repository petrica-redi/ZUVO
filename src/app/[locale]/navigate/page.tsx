import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { HealthcareNavigator } from "@/components/HealthcareNavigator";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Healthcare Navigator — Zuvo",
    description: "Get help accessing healthcare. Know your rights.",
  };
}

export default async function NavigatePage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-6">
          <HealthcareNavigator locale={locale} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
