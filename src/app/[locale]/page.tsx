import type { Metadata } from "next";
import type { ComponentType } from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Activity,
  Search,
  GraduationCap,
  Users,
  BarChart3,
  Heart,
  Phone,
  Stethoscope,
  Globe,
  Lock,
  CheckCircle2,
  FileText,
  Brain,
  MessageCircle,
  Syringe,
  MapPin,
  Handshake,
  Landmark,
} from "lucide-react";
import { getPlatformConfig } from "@/lib/admin/actions";
import { formatImpactNumber, getImpactStats } from "@/lib/impact/stats";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ProfileShellOptOut } from "@/components/landing/ProfileShellOptOut";
import { LandingVisualMosaic } from "@/components/landing/LandingVisualMosaic";
import { CareModelSection } from "@/components/landing/CareModelSection";
import { CareProcessSection } from "@/components/landing/CareProcessSection";
import { IntegratedPlatformSection } from "@/components/landing/IntegratedPlatformSection";
import { TechnologyShowcase } from "@/components/landing/TechnologyShowcase";
import { StakeholderAccessSection } from "@/components/landing/StakeholderAccessSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { EmergencyStrip } from "@/components/operations/EmergencyStrip";
import { AiChatBubble, AiChatShell } from "@/components/ui/AiChatShell";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("title"), description: t("description") };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });
  const tHome = await getTranslations({ locale, namespace: "home" });
  
  const platformConfig = await getPlatformConfig();
  const impact = await getImpactStats();
  const heroTitle = platformConfig?.heroTitle || undefined;
  const heroSubtitle = platformConfig?.heroSubtitle || undefined;
  const heroImage = platformConfig?.heroImage || "/images/hero/village-dawn.png";
  const heroLayout = platformConfig?.heroLayout || "split";

  return (
    <>
      {/* Opt the root mobile-shell out of the phone-frame so the home page
          renders as a true full-width premium landing on desktop. */}
      <ProfileShellOptOut />

      <LandingHeader logoUrl={platformConfig?.logoUrl || undefined} />

      <main id="main-content" className="relative">
        <EmergencyStrip />

        {/* ===== PLATFORM NAV DECK (first screen) ================== */}
        <section
          aria-labelledby="platform-nav-title"
          className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]"
        >
          <div className="mx-auto max-w-6xl px-5 pb-10 pt-8 md:px-8 md:pb-14 md:pt-10">
            <header className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--color-accent)" }}
                  />
                  {t("navTitle")}
                </p>
                <h2
                  id="platform-nav-title"
                  className="font-headline mt-3 leading-[1.05] text-[var(--color-text-primary)]"
                  style={{ fontSize: "clamp(1.5rem, 1.1rem + 1.4vw, 2rem)" }}
                >
                  {t("navSubtitle")}
                </h2>
              </div>
              <a
                href="tel:112"
                className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--color-danger-accent)]/30 bg-[var(--color-danger-bg)] px-4 py-2 text-xs font-extrabold text-[var(--color-danger-text)] transition-all hover:bg-[var(--color-danger-accent)] hover:text-white"
              >
                <Phone className="lucide h-3.5 w-3.5" strokeWidth={2.4} />
                {tHome("emergencyCta")}
              </a>
            </header>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <PlatformTile
                href="/students"
                icon={GraduationCap}
                accent="ember"
                title={t("navAcademy")}
                desc={t("navAcademyDesc")}
                primary
              />
              <PlatformTile
                href="/explain"
                icon={FileText}
                accent="brand"
                title={t("navExplain")}
                desc={t("navExplainDesc")}
                primary
              />
              <PlatformTile
                href="/scan"
                icon={Search}
                accent="ember"
                title={t("navScan")}
                desc={t("navScanDesc")}
                primary
              />
              <PlatformTile
                href="/mediator"
                icon={Handshake}
                accent="sage"
                title={t("navMediator")}
                desc={t("navMediatorDesc")}
                primary
              />
              <PlatformTile
                href="/chat"
                icon={MessageCircle}
                accent="brand"
                title={t("navAsk")}
                desc={t("navAskDesc")}
              />
              <PlatformTile
                href="/symptoms"
                icon={Activity}
                accent="sage"
                title={t("navSymptoms")}
                desc={t("navSymptomsDesc")}
              />
              <PlatformTile
                href="/vaccines"
                icon={Syringe}
                accent="brand"
                title={t("navVaccines")}
                desc={t("navVaccinesDesc")}
              />
              <PlatformTile
                href="/providers"
                icon={MapPin}
                accent="sage"
                title={t("navProviders")}
                desc={t("navProvidersDesc")}
              />
            </div>
          </div>
        </section>

        {/* ===== HERO ============================================== */}
        <section className={`relative overflow-hidden ${heroLayout === "center" ? "text-center" : ""}`}>
          {/* Atmospheric backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 70% 0%, rgba(37,99,235,0.14) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(16,185,129,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 100% 100%, rgba(13,148,136,0.08) 0%, transparent 60%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 grain-overlay opacity-60"
          />

          <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 md:px-8 md:pb-28 md:pt-24">
            <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
              <div className={heroLayout === "center" ? "mx-auto flex flex-col items-center" : ""}>
                <span className="eyebrow animate-fade-in-up">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--color-accent)" }}
                  />
                  {t("eyebrow")}
                </span>

                <h1
                  className="font-headline mt-5 leading-[1.02] text-[var(--color-text-primary)] animate-fade-in-up delay-100"
                  style={{
                    fontSize: "clamp(2.25rem, 1.5rem + 3.5vw, 4.25rem)",
                  }}
                >
                  {heroTitle ? (
                    <span>{heroTitle}</span>
                  ) : (
                    <>
                      <span>{t("heroLine1")}</span>
                      <br />
                      <span>{t("heroLine2")}</span>
                    </>
                  )}
                </h1>

                <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--color-text-secondary)] md:text-lg animate-fade-in-up delay-200">
                  {heroSubtitle || t("heroLead")}
                </p>

                <div className={`mt-9 flex flex-wrap items-center gap-3 animate-fade-in-up delay-300 ${heroLayout === "center" ? "justify-center" : ""}`}>
                  <Link
                    href="/help"
                    className="group inline-flex h-13 items-center gap-2 rounded-full px-7 py-4 text-sm font-extrabold text-white gradient-brand grain-overlay shadow-brand transition-all hover:shadow-4 active:scale-[0.97]"
                    style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
                  >
                    {t("helpCtaHero")}
                    <ArrowRight
                      className="lucide h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={2.2}
                    />
                  </Link>
                  <Link
                    href="/chat"
                    className="inline-flex h-13 items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-4 text-sm font-extrabold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-text-primary)]"
                  >
                    {t("ctaPrimary")}
                  </Link>
                  <Link
                    href="/admin/login"
                    className="inline-flex h-13 items-center gap-2 rounded-full px-5 py-4 text-sm font-bold text-[var(--color-text-muted)] underline-offset-2 hover:text-[var(--color-text-secondary)] hover:underline"
                  >
                    {t("demoCtaHero")}
                  </Link>
                </div>

                <div className={`mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--color-text-muted)] animate-fade-in-up delay-400 ${heroLayout === "center" ? "justify-center" : ""}`}>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="lucide h-3.5 w-3.5 text-[var(--color-success-accent)]" strokeWidth={2} />
                    {t("trustBadge1")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe className="lucide h-3.5 w-3.5" strokeWidth={2} />
                    {t("trustBadge2")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="lucide h-3.5 w-3.5" strokeWidth={2} />
                    {t("trustBadge3")}
                  </span>
                </div>

                <nav
                  aria-label={t("branchNavAria")}
                  className="mt-10 animate-fade-in-up"
                  style={{ animationDelay: "420ms", animationFillMode: "both" }}
                >
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    {t("branchEyebrow")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <HeroBranchChip
                      href="/students"
                      icon={GraduationCap}
                      label={t("branchAcademy")}
                    />
                    <HeroBranchChip
                      href="/explain"
                      icon={FileText}
                      label={t("branchPrescription")}
                    />
                    <HeroBranchChip href="/scan" icon={Search} label={t("branchFacts")} />
                    <HeroBranchChip
                      href="/mediator"
                      icon={Handshake}
                      label={t("branchMediator")}
                    />
                  </div>
                </nav>
              </div>

              {/* Hero composition — faux app card over AI artwork */}
              <div className="relative isolate min-h-[300px] md:min-h-0">
                <div className="absolute inset-0 -z-10 overflow-hidden rounded-[32px] md:rounded-[40px]" aria-hidden>
                  <Image
                    src={heroImage}
                    alt={t("heroBackdropAlt")}
                    fill
                    priority
                    className="object-cover object-[center_28%]"
                    sizes="(max-width: 768px) 100vw, 44vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-canvas)] via-[var(--color-bg-canvas)]/60 to-transparent md:bg-gradient-to-l md:from-transparent md:via-[var(--color-bg-canvas)]/35 md:to-[var(--color-bg-canvas)]/92"
                    aria-hidden
                  />
                </div>
                <HeroComposition t={t} />
              </div>
            </div>
          </div>
        </section>

        <CareProcessSection />

        <LandingVisualMosaic
          eyebrow={t("visualEyebrow")}
          title={t("visualTitle")}
          lead={t("visualLead")}
          tiles={[
            {
              href: "/students",
              src: "/images/ai/ai-spot-academy.png",
              label: t("navAcademy"),
              alt: t("imageMosaicAcademyAlt"),
            },
            {
              href: "/explain",
              src: "/images/ai/ai-spot-prescription.png",
              label: t("navExplain"),
              alt: t("imageMosaicPrescriptionAlt"),
            },
            {
              href: "/scan",
              src: "/images/surfaces/scan.png",
              label: t("navScan"),
              alt: t("imageMosaicFactsAlt"),
            },
            {
              href: "/mediator",
              src: "/images/ai/ai-spot-mediator.png",
              label: t("navMediator"),
              alt: t("imageMosaicMediatorAlt"),
            },
          ]}
        />

        {/* ===== TRUST STRIP ====================================== */}
        <section className="border-y border-[var(--color-border-subtle)] bg-[var(--color-cream-50)] py-7 md:py-10">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              {t("trustEyebrow")}
            </p>
            <div className="mt-7 grid grid-cols-2 gap-y-4 text-center md:grid-cols-4">
              <Stat value={String(impact.languages)} label={t("statLanguages")} />
              <Stat
                value={String(impact.activeMediators)}
                label={t("statMediators")}
              />
              <Stat
                value={formatImpactNumber(impact.mythsChecked)}
                label={t("statMyths")}
              />
              <Stat
                value={String(impact.emergenciesEscalated)}
                label={t("statEmergencies")}
              />
            </div>
            <p
              className={`mt-4 text-center text-[10px] font-bold uppercase tracking-widest ${
                impact.source === "live"
                  ? "text-[var(--color-success-accent)]"
                  : "text-amber-700"
              }`}
            >
              {impact.source === "live"
                ? t("liveTelemetry")
                : locale === "ro"
                  ? "Scenariu demonstrativ · nu sunt rezultate reale"
                  : "Demonstration scenario · not real outcomes"}
            </p>
          </div>
        </section>

        <IntegratedPlatformSection />

        {/* ===== AUDIENCE TRIPTYCH ================================ */}
        <section className="section-marketing">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <header className="mb-12 max-w-2xl md:mb-16">
              <p className="eyebrow">{t("audienceEyebrow")}</p>
              <h2
                className="font-headline mt-3 leading-[1.05] text-[var(--color-text-primary)]"
                style={{ fontSize: "clamp(2rem, 1.4rem + 2vw, 3.25rem)" }}
              >
                {t("audienceTitle")}
              </h2>
            </header>

            <div className="grid gap-5 md:grid-cols-3 md:gap-6">
              <AudienceCard
                accent="brand"
                icon={GraduationCap}
                title={t("studentTitle")}
                lead={t("studentLead")}
                cta={t("studentCta")}
                href="/students"
                kicker={t("audienceKickerStudents")}
                artSrc="/images/ai/ai-audience-students.png"
                artAlt={t("imageAudienceStudentsAlt")}
              />
              <AudienceCard
                accent="sage"
                icon={Users}
                title={t("communityTitle")}
                lead={t("communityLead")}
                cta={t("communityCta")}
                href="/providers"
                kicker={t("audienceKickerCommunity")}
                artSrc="/images/ai/ai-audience-community.png"
                artAlt={t("imageAudienceCommunityAlt")}
              />
              <AudienceCard
                accent="ember"
                icon={BarChart3}
                title={t("ministerTitle")}
                lead={t("ministerLead")}
                cta={t("ministerCta")}
                href="/impact"
                kicker={t("audienceKickerPartners")}
                artSrc="/images/ai/ai-audience-partners.png"
                artAlt={t("imageAudiencePartnersAlt")}
              />
            </div>
          </div>
        </section>

        {/* ===== FEATURES GRID ==================================== */}
        <section className="section-marketing bg-[var(--color-surface)]">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <header className="mb-10 max-w-2xl md:mb-14">
              <p className="eyebrow">{t("featuresEyebrow")}</p>
              <h2
                className="font-headline mt-3 leading-[1.05] text-[var(--color-text-primary)]"
                style={{ fontSize: "clamp(1.875rem, 1.3rem + 1.8vw, 3rem)" }}
              >
                {t("featuresTitle")}
              </h2>
            </header>

            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              <FeatureRow icon={Search} title={t("feat1Title")} body={t("feat1Body")} />
              <FeatureRow icon={Activity} title={t("feat2Title")} body={t("feat2Body")} />
              <FeatureRow icon={Stethoscope} title={t("feat3Title")} body={t("feat3Body")} />
              <FeatureRow icon={ShieldCheck} title={t("feat4Title")} body={t("feat4Body")} />
            </div>
          </div>
        </section>

        <CareModelSection />

        <TechnologyShowcase />

        <StakeholderAccessSection />

        {/* ===== IMPACT + METHODOLOGY (split editorial) =========== */}
        <section className="section-marketing">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="grid gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <p className="eyebrow">{t("impactEyebrow")}</p>
                <h2
                  className="font-headline mt-3 leading-[1.05] text-[var(--color-text-primary)]"
                  style={{ fontSize: "clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)" }}
                >
                  {t("impactTitle")}
                </h2>
                <ul className="mt-7 space-y-4 text-sm text-[var(--color-text-secondary)]">
                  <ImpactRow
                    icon={Heart}
                    label={t("impactRow1")}
                    value={formatImpactNumber(impact.emergenciesEscalated)}
                  />
                  <ImpactRow
                    icon={Brain}
                    label={t("impactRow2")}
                    value={formatImpactNumber(impact.lessonsCompleted)}
                  />
                  <ImpactRow
                    icon={CheckCircle2}
                    label={t("impactRow3")}
                    value={formatImpactNumber(impact.visitsThisYear)}
                  />
                </ul>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  {impact.source === "live"
                    ? locale === "ro"
                      ? "Date operaționale live"
                      : "Live operational data"
                    : locale === "ro"
                      ? "Date demonstrative ilustrative"
                      : "Illustrative demonstration data"}
                </p>
                <Link
                  href="/impact"
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-extrabold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                >
                  {t("impactCta")}
                  <ArrowRight className="lucide h-4 w-4" strokeWidth={2.2} />
                </Link>
              </div>

              <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-cream-50)] p-7 md:p-10">
                <p className="eyebrow">{t("methodologyEyebrow")}</p>
                <h2
                  className="font-headline mt-3 leading-[1.05] text-[var(--color-ink-900)]"
                  style={{ fontSize: "clamp(1.5rem, 1.1rem + 1.4vw, 2rem)" }}
                >
                  {t("methodologyTitle")}
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {t("methodologyBody")}
                </p>
                <div className="mt-6 grid grid-cols-3 gap-2 text-[11px]">
                  <SafetyChip label={t("safetyRedFlags")} />
                  <SafetyChip label={t("safetyPII")} />
                  <SafetyChip label={t("safetyClinical")} />
                </div>
                <Link
                  href="/methodology"
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-extrabold text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
                >
                  {t("methodologyCta")}
                  <ArrowRight className="lucide h-4 w-4" strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <TestimonialsSection />

        {/* ===== GOVERNMENT DEPLOYMENT (Romania ↔ Italy) ========== */}
        <section
          aria-labelledby="gov-title"
          className="section-marketing bg-[var(--color-surface)]"
        >
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <header className="mb-10 max-w-3xl md:mb-14">
              <p className="eyebrow">
                <Landmark className="lucide h-3.5 w-3.5" strokeWidth={2} />
                {t("govEyebrow")}
              </p>
              <h2
                id="gov-title"
                className="font-headline mt-3 leading-[1.05] text-[var(--color-text-primary)]"
                style={{ fontSize: "clamp(1.875rem, 1.3rem + 1.8vw, 3rem)" }}
              >
                {t("govTitle")}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
                {t("govLead")}
              </p>
            </header>

            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              <CountryCard
                flag="🇷🇴"
                title={t("govRoTitle")}
                status={t("govRoStatus")}
                statusTone="live"
                rows={[t("govRo1"), t("govRo2"), t("govRo3"), t("govRo4")]}
              />
              <CountryCard
                flag="🇮🇹"
                title={t("govItTitle")}
                status={t("govItStatus")}
                statusTone="planned"
                rows={[t("govIt1"), t("govIt2"), t("govIt3"), t("govIt4")]}
              />
            </div>

            <div className="mt-6 rounded-3xl border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-brand-900)] md:text-[15px]">
                  <span className="font-extrabold">{t("govBridgeLabel")}</span>{" "}
                  {t("govBridge")}
                </p>
                <Link
                  href="/impact"
                  className="inline-flex shrink-0 items-center gap-2 self-start rounded-full px-6 py-3.5 text-sm font-extrabold text-white gradient-brand grain-overlay shadow-brand transition-all hover:shadow-4 active:scale-[0.97] md:self-auto"
                >
                  {t("govCta")}
                  <ArrowRight className="lucide h-4 w-4" strokeWidth={2.2} />
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-brand-800)]/70">
                  {t("govFundingLabel")}
                </span>
                {["POIDS / FSE+", "EU4Health", "PNRR · M6", "AMIF", "Interreg"].map(
                  (label) => (
                    <span
                      key={label}
                      className="inline-flex items-center rounded-full border border-[var(--color-brand-300)] bg-white/70 px-3 py-1 text-[11px] font-bold text-[var(--color-brand-800)]"
                    >
                      {label}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== EMERGENCY STRIP ================================== */}
        <section className="mx-auto max-w-6xl px-5 md:px-8">
          <a
            href="tel:112"
            className="flex items-center gap-4 rounded-3xl bg-[var(--color-ink-900)] p-5 transition-transform hover:translate-y-[-2px] md:p-6"
            style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl gradient-emergency grain-overlay shadow-danger">
              <Phone className="lucide h-5 w-5 text-white" strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <p className="font-display text-base font-extrabold text-white md:text-lg">
                {tHome("emergencyCta")}
              </p>
              <p className="text-xs text-white/60 md:text-sm">
                {tHome("emergencySub")}
              </p>
            </div>
            <ArrowRight className="lucide h-5 w-5 text-white/60" strokeWidth={2} />
          </a>
        </section>

        {/* ===== FINAL CTA ======================================== */}
        <section className="section-marketing">
          <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
            <p className="eyebrow justify-center">{t("finalEyebrow")}</p>
            <h2
              className="font-headline mt-4 leading-[1.05] text-[var(--color-text-primary)]"
              style={{ fontSize: "clamp(2rem, 1.5rem + 2.5vw, 3.75rem)" }}
            >
              {t("finalTitle")}
            </h2>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
              {t("finalBody")}
            </p>
            <Link
              href="/chat"
              className="mt-8 inline-flex h-13 items-center gap-2 rounded-full px-7 py-4 text-sm font-extrabold text-white gradient-brand grain-overlay shadow-brand transition-all hover:shadow-4 active:scale-[0.97]"
            >
              {t("finalCta")}
              <Sparkles className="lucide h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter locale={locale} />
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────

function HeroBranchChip({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3.5 py-2 text-[11px] font-extrabold tracking-tight text-[var(--color-text-primary)] shadow-1 transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] md:min-h-0 md:px-4 md:text-xs"
    >
      <Icon className="lucide h-3.5 w-3.5 shrink-0 text-[var(--color-accent-text)]" strokeWidth={2.2} />
      <span>{label}</span>
    </Link>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        className="font-headline text-[var(--color-text-primary)]"
        style={{ fontSize: "clamp(1.875rem, 1.4rem + 2vw, 2.75rem)" }}
      >
        {value}
      </div>
      <div className="mt-1 text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
        {label}
      </div>
    </div>
  );
}

const AUDIENCE_THEMES = {
  brand: {
    bg: "bg-[var(--color-brand-50)]",
    border: "border-[var(--color-brand-200)]",
    icon: "text-[var(--color-brand-700)] bg-white",
    chip: "bg-[var(--color-brand-100)] text-[var(--color-brand-800)]",
  },
  sage: {
    bg: "bg-[var(--color-sage-50)]",
    border: "border-[var(--color-sage-200)]",
    icon: "text-[var(--color-sage-700)] bg-white",
    chip: "bg-[var(--color-sage-100)] text-[var(--color-sage-800)]",
  },
  ember: {
    bg: "bg-[var(--color-ember-50)]",
    border: "border-[var(--color-ember-200)]",
    icon: "text-[var(--color-ember-700)] bg-white",
    chip: "bg-[var(--color-ember-100)] text-[var(--color-ember-800)]",
  },
} as const;

function AudienceCard({
  accent,
  icon: Icon,
  title,
  lead,
  cta,
  href,
  kicker,
  artSrc,
  artAlt,
}: {
  accent: keyof typeof AUDIENCE_THEMES;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  lead: string;
  cta: string;
  href: string;
  kicker: string;
  artSrc?: string;
  artAlt?: string;
}) {
  const theme = AUDIENCE_THEMES[accent];
  return (
    <Link
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border ${theme.border} ${theme.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-3`}
      style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
    >
      {artSrc && artAlt ? (
        <div className="relative aspect-[21/10] w-full overflow-hidden bg-[var(--color-surface-subtle)]">
          <Image
            src={artSrc}
            alt={artAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 34vw"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-7 md:p-8">
        <div className="flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.icon} shadow-1`}
          >
            <Icon className="lucide h-5 w-5" strokeWidth={1.85} />
          </div>
          <span
            className={`inline-flex items-center rounded-full ${theme.chip} px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest`}
          >
            {kicker}
          </span>
        </div>

        <h3
          className="font-headline mt-7 leading-tight text-[var(--color-text-primary)]"
          style={{ fontSize: "clamp(1.25rem, 1rem + 0.8vw, 1.625rem)" }}
        >
          {title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {lead}
        </p>

        <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-extrabold text-[var(--color-text-primary)]">
          {cta}
          <ArrowRight
            className="lucide h-4 w-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2.2}
          />
        </span>
      </div>
    </Link>
  );
}

function FeatureRow({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] p-6 md:p-7">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-1">
        <Icon className="lucide h-5 w-5" strokeWidth={1.85} />
      </div>
      <div>
        <h3 className="font-display text-base font-extrabold tracking-tight text-[var(--color-text-primary)]">
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {body}
        </p>
      </div>
    </div>
  );
}

function ImpactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center gap-4 rounded-2xl bg-[var(--color-surface)] px-5 py-4 shadow-1">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]">
        <Icon className="lucide h-4 w-4" strokeWidth={2} />
      </div>
      <span className="flex-1 text-sm">{label}</span>
      <span
        className="font-headline text-[var(--color-text-primary)]"
        style={{ fontSize: "clamp(1.25rem, 1.1rem + 0.4vw, 1.5rem)" }}
      >
        {value}
      </span>
    </li>
  );
}

function SafetyChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center gap-1 rounded-full border border-[var(--color-border-default)] bg-white py-1.5 font-extrabold uppercase tracking-widest text-[var(--color-text-secondary)]">
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--color-success-accent)" }}
      />
      {label}
    </span>
  );
}

const TILE_THEMES = {
  brand: {
    iconBg: "bg-[var(--color-brand-100)]",
    iconText: "text-[var(--color-brand-700)]",
    ring: "hover:border-[var(--color-brand-400)]",
    primaryBg: "bg-[var(--color-brand-50)]",
  },
  sage: {
    iconBg: "bg-[var(--color-sage-100)]",
    iconText: "text-[var(--color-sage-700)]",
    ring: "hover:border-[var(--color-sage-400)]",
    primaryBg: "bg-[var(--color-sage-50)]",
  },
  ember: {
    iconBg: "bg-[var(--color-ember-100)]",
    iconText: "text-[var(--color-ember-700)]",
    ring: "hover:border-[var(--color-ember-400)]",
    primaryBg: "bg-[var(--color-ember-50)]",
  },
} as const;

function PlatformTile({
  href,
  icon: Icon,
  title,
  desc,
  accent,
  primary = false,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  desc: string;
  accent: keyof typeof TILE_THEMES;
  primary?: boolean;
}) {
  const theme = TILE_THEMES[accent];
  return (
    <Link
      href={href}
      className={`group relative flex h-full items-start gap-3.5 rounded-2xl border border-[var(--color-border-subtle)] ${primary ? theme.primaryBg : "bg-[var(--color-bg-canvas)]"} ${theme.ring} p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2 md:gap-4 md:rounded-3xl md:p-5`}
      style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
    >
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${theme.iconBg} ${theme.iconText} shadow-1 md:h-11 md:w-11 md:rounded-2xl`}
      >
        <Icon className="lucide h-5 w-5" strokeWidth={1.9} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-display text-[13px] font-extrabold leading-tight tracking-tight text-[var(--color-text-primary)] md:text-[15px]">
          {title}
        </span>
        <span className="mt-1 hidden text-[12px] leading-snug text-[var(--color-text-secondary)] md:block">
          {desc}
        </span>
      </div>
      <ArrowRight
        className="lucide mt-1 h-4 w-4 flex-shrink-0 text-[var(--color-text-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-text-primary)]"
        strokeWidth={2}
        aria-hidden
      />
    </Link>
  );
}

function CountryCard({
  flag,
  title,
  status,
  statusTone,
  rows,
}: {
  flag: string;
  title: string;
  status: string;
  statusTone: "live" | "planned";
  rows: string[];
}) {
  const statusClass =
    statusTone === "live"
      ? "bg-[var(--color-success-bg)] text-[var(--color-success-text)] border-[var(--color-success-border)]"
      : "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] border-[var(--color-warning-border)]";
  return (
    <article className="flex flex-col rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] p-7 shadow-1 md:p-8">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="text-3xl leading-none">
            {flag}
          </span>
          <h3
            className="font-headline leading-tight text-[var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.25rem, 1rem + 0.8vw, 1.625rem)" }}
          >
            {title}
          </h3>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest ${statusClass}`}
        >
          {status}
        </span>
      </div>
      <ul className="mt-6 space-y-3">
        {rows.map((row) => (
          <li
            key={row}
            className="flex items-start gap-3 text-sm leading-relaxed text-[var(--color-text-secondary)]"
          >
            <CheckCircle2
              className="lucide mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-500)]"
              strokeWidth={2}
              aria-hidden
            />
            <span>{row}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function HeroComposition({ t }: { t: (key: string) => string }) {
  const labels = {
    label: t("heroCardLabel"),
    verified: t("heroCardVerdict"),
    trustFooter: t("heroCardFooter"),
  };

  return (
    <div className="relative">
      <AiChatShell labels={labels} className="md:[&>div]:p-9">
        <AiChatBubble role="user">{t("heroCardQuestion")}</AiChatBubble>
        <AiChatBubble role="assistant" showVerified verifiedLabel={labels.verified}>
          {t("heroCardAnswer")}
        </AiChatBubble>
      </AiChatShell>

      {/* Floating sage badge — sits low-left, clear of the card footer copy */}
      <div
        className="absolute -bottom-8 left-2 rounded-2xl border border-[var(--color-sage-200)] bg-[var(--color-sage-50)] px-4 py-3 shadow-2 md:-bottom-10 md:left-0"
        aria-hidden
      >
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-sage-700)]">
          {t("heroBadgeAvailable")}
        </div>
        <div className="font-headline mt-1 text-2xl leading-none text-[var(--color-sage-900)]">
          {t("heroBadgeLanguages")}
        </div>
      </div>

      {/* Floating ember badge */}
      <div
        className="absolute -right-3 -top-3 rounded-2xl border border-[var(--color-ember-200)] bg-[var(--color-ember-50)] px-3.5 py-2.5 shadow-2"
        aria-hidden
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="lucide h-3.5 w-3.5 text-[var(--color-ember-600)]" strokeWidth={2} />
          <span className="text-[11px] font-extrabold text-[var(--color-ember-800)]">
            {t("heroBadgeMix")}
          </span>
        </div>
      </div>
    </div>
  );
}
