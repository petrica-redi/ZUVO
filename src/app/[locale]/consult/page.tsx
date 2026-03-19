import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { ConsultationFlow } from "@/components/ConsultationFlow";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Health Consultation — Zuvo",
    description: "Guided health consultation with AI-powered triage",
  };
}

export default async function ConsultPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main className="flex-1 pb-2">
        <div className="px-5 py-6">
          <ConsultationFlow locale={locale} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
