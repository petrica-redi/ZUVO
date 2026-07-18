import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Shield, Users, Stethoscope, BarChart3, Globe, Lock } from "lucide-react";
import { StakeholderLoginForm } from "@/components/auth/StakeholderLoginForm";
import { getAdminLoginEmail } from "@/lib/admin/actions";

const ROLES = [
  { id: "community", icon: Users, gradient: "from-[#7C3AED] to-[#8B5CF6]" },
  { id: "mediator", icon: Shield, gradient: "from-[#0A1220] to-[#2A1A48]" },
  { id: "doctor", icon: Stethoscope, gradient: "from-[#3B2760] to-[#7C3AED]" },
  { id: "manager", icon: BarChart3, gradient: "from-[#2A1A48] to-[#7C3AED]" },
] as const;

/**
 * Premium stakeholder access — split editorial + embedded login.
 */
export async function StakeholderAccessSection() {
  const t = await getTranslations("auth");
  const defaultEmail = await getAdminLoginEmail();

  return (
    <section
      id="stakeholder-access"
      aria-labelledby="stakeholder-access-title"
      className="stakeholder-access-section relative overflow-hidden"
    >
      <div className="stakeholder-access-section__orb stakeholder-access-section__orb--blue" aria-hidden />
      <div className="stakeholder-access-section__orb stakeholder-access-section__orb--teal" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="eyebrow text-white/55">
              <Lock className="h-3.5 w-3.5" strokeWidth={2.2} />
              {t("sectionEyebrow")}
            </p>
            <h2
              id="stakeholder-access-title"
              className="font-headline mt-4 max-w-xl leading-[1.02] text-white"
              style={{ fontSize: "clamp(2rem, 1.3rem + 2.4vw, 3.25rem)" }}
            >
              {t("sectionTitle")}
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/72 md:text-[17px]">
              {t("sectionLead")}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {ROLES.map(({ id, icon: Icon, gradient }) => (
                <div
                  key={id}
                  className="stakeholder-role-card group flex items-start gap-3 rounded-2xl border border-white/12 bg-white/6 p-4 backdrop-blur-md transition-all hover:border-white/22 hover:bg-white/10"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-white">
                      {t(`role${id.charAt(0).toUpperCase() + id.slice(1)}Title` as "roleCommunityTitle")}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/60">
                      {t(`role${id.charAt(0).toUpperCase() + id.slice(1)}Desc` as "roleCommunityDesc")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {[t("trustGdpr"), t("trustEu"), t("trustPersona")].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-[11px] font-bold text-white/75 backdrop-blur-sm"
                >
                  <Globe className="h-3 w-3" strokeWidth={2.2} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -right-6 -top-8 hidden h-48 w-48 opacity-80 lg:block">
              <Image
                src="/images/surfaces/impact.png"
                alt=""
                fill
                className="object-contain"
                sizes="192px"
              />
            </div>
            <StakeholderLoginForm defaultEmail={defaultEmail} variant="embedded" />
          </div>
        </div>
      </div>
    </section>
  );
}
