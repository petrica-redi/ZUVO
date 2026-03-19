import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { BodyMap } from "@/components/BodyMap";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Symptom Checker — Zuvo",
    description: "Tap where it hurts. Get guidance on what to do.",
  };
}

export default async function SymptomsPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-6">
          <BodyMap locale={locale} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
