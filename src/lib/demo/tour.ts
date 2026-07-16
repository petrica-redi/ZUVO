import type { DemoPersonaId } from "./personas";

export type TourStep = {
  id: DemoPersonaId;
  image: string;
  gradient: string;
  glowColor: string;
  roleBadgeKey: string;
  headlineKey: string;
  taglineKey: string;
  privacyKey: string;
};

export const TOUR_STEPS: TourStep[] = [
  {
    id: "community",
    image: "/images/ai/ai-audience-community.png",
    gradient: "from-[#0A4F49] via-[#0E8074] to-[#14967F]",
    glowColor: "rgba(14, 128, 116, 0.28)",
    roleBadgeKey: "roleBadgeCommunity",
    headlineKey: "tourHeadlineCommunity",
    taglineKey: "tourTaglineCommunity",
    privacyKey: "tourPrivacyCommunity",
  },
  {
    id: "mediator",
    image: "/images/ai/ai-spot-mediator.png",
    gradient: "from-[#0A1220] via-[#0F3D38] to-[#0E8074]",
    glowColor: "rgba(15, 61, 56, 0.3)",
    roleBadgeKey: "roleBadgeMediator",
    headlineKey: "tourHeadlineMediator",
    taglineKey: "tourTaglineMediator",
    privacyKey: "tourPrivacyMediator",
  },
  {
    id: "doctor",
    image: "/images/ai/ai-spot-prescription.png",
    gradient: "from-[#7F1D1D] via-[#B91C1C] to-[#DC2626]",
    glowColor: "rgba(185, 28, 28, 0.25)",
    roleBadgeKey: "roleBadgeDoctor",
    headlineKey: "tourHeadlineDoctor",
    taglineKey: "tourTaglineDoctor",
    privacyKey: "tourPrivacyDoctor",
  },
  {
    id: "manager",
    image: "/images/surfaces/impact.png",
    gradient: "from-[#0A1220] via-[#134E4A] to-[#0E8074]",
    glowColor: "rgba(10, 18, 32, 0.28)",
    roleBadgeKey: "roleBadgeManager",
    headlineKey: "tourHeadlineManager",
    taglineKey: "tourTaglineManager",
    privacyKey: "tourPrivacyManager",
  },
  {
    id: "admin",
    image: "/images/ai/ai-audience-partners.png",
    gradient: "from-[#1E293B] via-[#334155] to-[#475569]",
    glowColor: "rgba(51, 65, 85, 0.28)",
    roleBadgeKey: "roleBadgeAdmin",
    headlineKey: "tourHeadlineAdmin",
    taglineKey: "tourTaglineAdmin",
    privacyKey: "tourPrivacyAdmin",
  },
];

export function isTourPersona(id: string | null): id is DemoPersonaId {
  return TOUR_STEPS.some((s) => s.id === id);
}
