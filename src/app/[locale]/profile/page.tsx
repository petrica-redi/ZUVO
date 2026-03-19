import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { User } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("profile"), description: t("profile") };
}

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center pb-28 pt-14">
        <div className="flex flex-col items-center gap-4 px-5 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          <p className="max-w-xs text-gray-500">{t("comingSoon")}</p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
