import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { StaffLoginForm } from "@/components/auth/StaffLoginForm";
import { isGoogleOAuthEnabled } from "@/lib/staff/google-oauth";
import { isNativeGoogleOAuthConfigured } from "@/lib/staff/google-native";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "staffAuth" });
  return { title: t("loginMetaTitle"), description: t("loginLead") };
}

export default async function StaffAuthLoginPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "staffAuth" });
  const [supabaseGoogle, nativeGoogle] = await Promise.all([
    isGoogleOAuthEnabled(),
    Promise.resolve(isNativeGoogleOAuthConfigured()),
  ]);
  const googleEnabled = supabaseGoogle || nativeGoogle;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-[28px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-2 md:p-8">
          <StaffLoginForm
            locale={locale}
            googleEnabled={googleEnabled}
            preferNativeGoogle={nativeGoogle}
            labels={{
              title: t("loginTitle"),
              lead: t("loginLead"),
              email: t("email"),
              password: t("password"),
              submit: t("loginSubmit"),
              noAccount: t("noAccount"),
              registerLink: t("registerLink"),
              google: t("googleContinue"),
              orDivider: t("orDivider"),
              googleUnavailable: t("googleUnavailable"),
              stepRegister: t("stepRegister"),
              stepVerify: t("stepVerify"),
              stepPending: t("stepPending"),
              stepLogin: t("stepLogin"),
            }}
          />
        </div>
      </main>
    </div>
  );
}
