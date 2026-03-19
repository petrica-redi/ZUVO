import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { VaccineEducator } from "@/components/VaccineEducator";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Vaccine Guide — Zuvo",
    description: "Every vaccine explained simply. Protect your family with knowledge.",
  };
}

export default async function VaccinesPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-6">
          <VaccineEducator locale={locale} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
