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
    image: "/images/ai/community-care.svg",
    gradient: "from-[#059669] via-[#10B981] to-[#34D399]",
    glowColor: "rgba(16, 185, 129, 0.35)",
    roleBadgeKey: "roleBadgeCommunity",
    headlineKey: "tourHeadlineCommunity",
    taglineKey: "tourTaglineCommunity",
    privacyKey: "tourPrivacyCommunity",
  },
  {
    id: "mediator",
    image: "/images/ai/community-care.svg",
    gradient: "from-[#1D4ED8] via-[#2563EB] to-[#3B82F6]",
    glowColor: "rgba(37, 99, 235, 0.35)",
    roleBadgeKey: "roleBadgeMediator",
    headlineKey: "tourHeadlineMediator",
    taglineKey: "tourTaglineMediator",
    privacyKey: "tourPrivacyMediator",
  },
  {
    id: "doctor",
    image: "/images/ai/clinical-care.svg",
    gradient: "from-[#B91C1C] via-[#DC2626] to-[#EF4444]",
    glowColor: "rgba(220, 38, 38, 0.3)",
    roleBadgeKey: "roleBadgeDoctor",
    headlineKey: "tourHeadlineDoctor",
    taglineKey: "tourTaglineDoctor",
    privacyKey: "tourPrivacyDoctor",
  },
  {
    id: "manager",
    image: "/images/ai/network-care.svg",
    gradient: "from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6]",
    glowColor: "rgba(124, 58, 237, 0.35)",
    roleBadgeKey: "roleBadgeManager",
    headlineKey: "tourHeadlineManager",
    taglineKey: "tourTaglineManager",
    privacyKey: "tourPrivacyManager",
  },
  {
    id: "admin",
    image: "/images/ai/network-care.svg",
    gradient: "from-[#334155] via-[#475569] to-[#64748B]",
    glowColor: "rgba(71, 85, 105, 0.3)",
    roleBadgeKey: "roleBadgeAdmin",
    headlineKey: "tourHeadlineAdmin",
    taglineKey: "tourTaglineAdmin",
    privacyKey: "tourPrivacyAdmin",
  },
];

export function isTourPersona(id: string | null): id is DemoPersonaId {
  return TOUR_STEPS.some((s) => s.id === id);
}
