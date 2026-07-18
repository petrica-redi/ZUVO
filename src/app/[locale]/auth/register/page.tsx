import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { StaffRegisterForm } from "@/components/auth/StaffRegisterForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "staffAuth" });
  return { title: t("registerMetaTitle"), description: t("registerLead") };
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "staffAuth" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-[28px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-2 md:p-8">
          <StaffRegisterForm
            locale={locale}
            labels={{
              title: t("registerTitle"),
              lead: t("registerLead"),
              name: t("displayName"),
              email: t("email"),
              password: t("password"),
              submit: t("registerSubmit"),
              success: t("registerSuccess"),
              haveAccount: t("haveAccount"),
              loginLink: t("loginLink"),
              google: t("googleContinue"),
              orDivider: t("orDivider"),
            }}
          />
        </div>
      </main>
    </div>
  );
}
