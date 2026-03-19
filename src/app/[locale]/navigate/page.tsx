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
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main className="flex-1 pb-28 pt-14">
        <div className="mx-auto max-w-lg px-5 py-6">
          <HealthcareNavigator locale={locale} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
