import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pillars" });
  return { title: t("title"), description: t("title") };
}

const PILLARS = [
  { id: "prevention", emoji: "🛡️", color: "#16A34A", href: "/learn/prevention" },
  { id: "nutrition",  emoji: "🥗", color: "#2563EB", href: "/learn/nutrition"  },
  { id: "maternal",   emoji: "🤱", color: "#9333EA", href: "/learn/maternal"   },
  { id: "children",   emoji: "👶", color: "#EA580C", href: "/learn/children"   },
  { id: "chronic",    emoji: "💊", color: "#DC2626", href: "/learn/chronic"    },
  { id: "mental",     emoji: "🧠", color: "#0891B2", href: "/learn/mental"     },
] as const;

export default async function LearnPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pillars" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">{t("title")}</h1>
          <div className="flex flex-col gap-2">
            {PILLARS.map((pillar) => (
              <Link
                key={pillar.id}
                href={pillar.href}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl">
                  {pillar.emoji}
                </span>
                <span className="flex-1 font-semibold text-gray-800">
                  {t(pillar.id)}
                </span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
