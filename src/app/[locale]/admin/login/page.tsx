import Image from "next/image";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, Shield, Users, Stethoscope, BarChart3 } from "lucide-react";
import { StakeholderLoginForm } from "@/components/auth/StakeholderLoginForm";
import { getAdminLoginEmail } from "@/lib/admin/actions";

const ROLES = [
  { id: "community", icon: Users },
  { id: "mediator", icon: Shield },
  { id: "doctor", icon: Stethoscope },
  { id: "manager", icon: BarChart3 },
] as const;

export default async function AdminLoginPage() {
  const t = await getTranslations("auth");
  const defaultEmail = await getAdminLoginEmail();

  return (
    <div className="stakeholder-access-section relative min-h-screen overflow-hidden">
      <div className="stakeholder-access-section__orb stakeholder-access-section__orb--blue" aria-hidden />
      <div className="stakeholder-access-section__orb stakeholder-access-section__orb--teal" aria-hidden />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 md:px-8 md:py-12">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-white/65 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToSite")}
        </Link>

        <div className="flex flex-1 flex-col items-center justify-center gap-12 py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-20">
          <div className="max-w-lg text-center lg:text-left">
            <p className="eyebrow justify-center text-white/55 lg:justify-start">{t("pageEyebrow")}</p>
            <h1
              className="font-headline mt-4 leading-[1.02] text-white"
              style={{ fontSize: "clamp(2.25rem, 1.5rem + 2.8vw, 3.5rem)" }}
            >
              {t("pageTitle")}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/72 md:text-[17px]">
              {t("pageLead")}
            </p>

            <ul className="mt-8 hidden space-y-3 lg:block">
              {ROLES.map(({ id, icon: Icon }) => (
                <li key={id} className="flex items-center gap-3 text-sm text-white/75">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  {t(`role${id.charAt(0).toUpperCase() + id.slice(1)}Title` as "roleCommunityTitle")}
                </li>
              ))}
            </ul>

            <div className="pointer-events-none relative mx-auto mt-10 h-40 w-40 opacity-70 lg:mx-0">
              <Image src="/images/ai/network-care.svg" alt="" fill className="object-contain" sizes="160px" />
            </div>
          </div>

          <StakeholderLoginForm defaultEmail={defaultEmail} variant="page" />
        </div>
      </div>
    </div>
  );
}
