import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { Header } from "@/components/Header";
import { Clock } from "lucide-react";
import { AuthFlowSteps } from "@/components/auth/AuthFlowSteps";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "staffAuth" });
  return { title: t("pendingMetaTitle") };
}

export default async function PendingApprovalPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "staffAuth" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-[28px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-2 md:p-8">
          <AuthFlowSteps
            active="pending"
            labels={{
              register: t("stepRegister"),
              verify: t("stepVerify"),
              pending: t("stepPending"),
              login: t("stepLogin"),
            }}
          />
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <Clock className="h-6 w-6" />
          </div>
          <h1 className="font-headline text-2xl font-extrabold text-[var(--color-text-primary)]">
            {t("pendingPageTitle")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {t("pendingLead")}
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex min-h-[44px] items-center rounded-full border border-[var(--color-border-default)] px-5 text-sm font-bold"
          >
            {t("loginLink")}
          </Link>
        </div>
      </main>
    </div>
  );
}
