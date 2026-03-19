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
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main className="flex-1 pb-28 pt-14">
        <div className="mx-auto max-w-lg px-5 py-6">
          <VaccineEducator locale={locale} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
