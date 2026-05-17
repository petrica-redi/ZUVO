import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { PrivacyDataActions } from "@/components/PrivacyDataActions";
import {
  Shield,
  Lock,
  Eye,
  Trash2,
  Mail,
  Database,
  ServerCog,
  Globe,
} from "lucide-react";
import { Card } from "@/components/ui";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

const SECTION_ICONS = [Lock, Eye, Database, ServerCog, Shield, Globe, Trash2, Mail] as const;

export default async function PrivacyPage({ params }: Props) {
  await params;
  const t = await getTranslations("privacy");

  const sections = [
    { key: "collect" as const, Icon: SECTION_ICONS[0] },
    { key: "use" as const, Icon: SECTION_ICONS[1] },
    { key: "storage" as const, Icon: SECTION_ICONS[2] },
    { key: "processors" as const, Icon: SECTION_ICONS[3] },
    { key: "rights" as const, Icon: SECTION_ICONS[4] },
    { key: "transfers" as const, Icon: SECTION_ICONS[5] },
    { key: "deletion" as const, Icon: SECTION_ICONS[6] },
    { key: "contact" as const, Icon: SECTION_ICONS[7] },
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex-1 pb-8">
        <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
          {/* Hero */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-700 to-slate-900 shadow-xl shadow-slate-900/20">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {t("lastUpdated", { date: "May 2026" })}
            </p>
          </div>

          {/* Data-subject actions */}
          <PrivacyDataActions
            title={t("actionsTitle")}
            subtitle={t("actionsSubtitle")}
            exportLabel={t("exportLabel")}
            exportHint={t("exportHint")}
            deleteLabel={t("deleteLabel")}
            deleteHint={t("deleteHint")}
            deleteConfirmTitle={t("deleteConfirmTitle")}
            deleteConfirmBody={t("deleteConfirmBody")}
            deleteConfirmCta={t("deleteConfirmCta")}
            deleteCancel={t("deleteCancel")}
            authRequired={t("authRequired")}
            unavailable={t("unavailable")}
            successDeleted={t("successDeleted")}
          />

          {/* Sections */}
          <div className="mt-6 space-y-3">
            {sections.map(({ key, Icon }) => (
              <Card key={key} variant="default">
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <h2 className="text-base font-black tracking-tight text-gray-900">
                      {t(`sections.${key}.title`)}
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {t(`sections.${key}.body`)}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Footer disclaimer */}
          <div className="mt-6 rounded-3xl border-2 border-amber-200 bg-amber-50 p-5">
            <p className="text-xs font-bold leading-relaxed text-amber-800">
              {t("disclaimer")}
            </p>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
