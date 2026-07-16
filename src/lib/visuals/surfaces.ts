/**
 * Central registry of premium surface photography for Redi Health.
 * Each major page / persona gets a distinct editorial image — not shared SVG orbs.
 */

export type SurfaceVisual = {
  src: string;
  alt: string;
  /** Short caption for empty states / aside labels */
  caption?: string;
};

export const SURFACE_VISUALS = {
  hero: {
    src: "/images/hero/village-dawn.png",
    alt: "Health mediator visiting a family at dawn in a rural Romanian courtyard",
    caption: "Field work at first light",
  },
  mosaicAcademy: {
    src: "/images/ai/ai-spot-academy.png",
    alt: "Students studying health literacy with anatomical models",
    caption: "Student Academy",
  },
  mosaicExplain: {
    src: "/images/ai/ai-spot-prescription.png",
    alt: "Pharmacist explaining a prescription in plain language",
    caption: "Prescription helper",
  },
  mosaicScan: {
    src: "/images/surfaces/scan.png",
    alt: "Phone on a wooden table checking a health rumor from messaging apps",
    caption: "Fact-check",
  },
  mosaicMediator: {
    src: "/images/ai/ai-spot-mediator.png",
    alt: "Mediator speaking with a family during a home visit",
    caption: "Mediator workspace",
  },
  audienceStudents: {
    src: "/images/ai/ai-audience-students.png",
    alt: "Young people collaborating on health learning materials",
    caption: "For students",
  },
  audienceCommunity: {
    src: "/images/ai/ai-audience-community.png",
    alt: "Community members gathered outdoors in conversation",
    caption: "For communities",
  },
  audiencePartners: {
    src: "/images/ai/ai-audience-partners.png",
    alt: "Ministry and clinical partners in a planning meeting",
    caption: "For partners",
  },
  chat: {
    src: "/images/ai/chat-companion.svg",
    alt: "Redi Health AI companion ready to answer a question",
    caption: "Ask Redi",
  },
  scan: {
    src: "/images/surfaces/scan.png",
    alt: "Checking a health claim on a phone at a village table",
    caption: "Verify before you share",
  },
  symptoms: {
    src: "/images/surfaces/symptoms.png",
    alt: "Field nurse chart with calm anatomical line drawing",
    caption: "Guided triage",
  },
  explain: {
    src: "/images/ai/ai-spot-prescription.png",
    alt: "Prescription counselling at a pharmacy counter",
    caption: "Understand your medicine",
  },
  family: {
    src: "/images/surfaces/family.png",
    alt: "Multi-generational hands reviewing a family health notebook",
    caption: "Family care",
  },
  vaccines: {
    src: "/images/surfaces/vaccines.png",
    alt: "Child vaccination booklet on a sunlit windowsill",
    caption: "Vaccination schedule",
  },
  navigate: {
    src: "/images/surfaces/navigate.png",
    alt: "Romania county map with a pin marking a rural commune",
    caption: "Find care nearby",
  },
  providers: {
    src: "/images/ai/ai-spot-prescription.png",
    alt: "Trusted local care counselling",
    caption: "Roma-friendly clinics",
  },
  mediator: {
    src: "/images/surfaces/mediator.png",
    alt: "Mediator field kit with clipboard, badge, and case list",
    caption: "Field workspace",
  },
  students: {
    src: "/images/ai/ai-spot-academy.png",
    alt: "Students in a health literacy classroom",
    caption: "Health Academy",
  },
  impact: {
    src: "/images/surfaces/impact.png",
    alt: "County planning map with teal pins and tally sheets",
    caption: "National view",
  },
  methodology: {
    src: "/images/surfaces/methodology.png",
    alt: "Safety stamps, sealed envelope, and clinical checklist on a desk",
    caption: "Clinical governance",
  },
  demoCommunity: {
    src: "/images/ai/ai-audience-community.png",
    alt: "Community members in conversation",
  },
  demoMediator: {
    src: "/images/ai/ai-spot-mediator.png",
    alt: "Mediator on a home visit",
  },
  demoDoctor: {
    src: "/images/ai/ai-spot-prescription.png",
    alt: "Clinician explaining care",
  },
  demoManager: {
    src: "/images/surfaces/impact.png",
    alt: "County impact planning wall",
  },
  demoAdmin: {
    src: "/images/ai/ai-audience-partners.png",
    alt: "Platform operators in a planning session",
  },
  stakeholder: {
    src: "/images/surfaces/impact.png",
    alt: "Institutional planning map for stakeholder preview",
  },
} as const satisfies Record<string, SurfaceVisual>;

export type SurfaceId = keyof typeof SURFACE_VISUALS;

export function surfaceVisual(id: SurfaceId): SurfaceVisual {
  return SURFACE_VISUALS[id];
}
