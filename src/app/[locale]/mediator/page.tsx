import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { MediatorDashboard } from "@/components/MediatorDashboard";
import {
  MEDIATOR_LABEL_KEYS,
  type MediatorLabels,
} from "@/components/mediator/labels";
import { getFieldSession, isFieldRosterReady } from "@/lib/field/actions";
import { isAdminAuthenticated } from "@/lib/admin/actions";
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mediator" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function MediatorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mediator" });

  const [fieldSession, admin, rosterReady] = await Promise.all([
    getFieldSession(),
    isAdminAuthenticated(),
    isFieldRosterReady(),
  ]);

  // Deployment gate: named field login required when roster is configured.
  // Admins may preview. If roster is not configured yet, show setup notice via login.
  if (!fieldSession && !admin) {
    redirect(`/${locale}/mediator/login`);
  }

  if (!fieldSession && !admin && !rosterReady) {
    redirect(`/${locale}/mediator/login`);
  }

  const labels = Object.fromEntries(
    MEDIATOR_LABEL_KEYS.map((key) => [key, t(key)]),
  ) as MediatorLabels;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-[#E8E0F5]" />}>
            <MediatorDashboard
              labels={labels}
              fieldSession={
                fieldSession
                  ? {
                      displayName: fieldSession.displayName,
                      role: fieldSession.role,
                      workspaceId: fieldSession.workspaceId,
                      countyCode: fieldSession.countyCode,
                    }
                  : null
              }
            />
          </Suspense>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
