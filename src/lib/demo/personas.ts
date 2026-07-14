export type DemoPersonaId = "community" | "mediator" | "manager" | "doctor" | "admin";

export type DataAccessLevel = "full" | "pseudonymized" | "aggregated" | "none";

export type DemoPersona = {
  id: DemoPersonaId;
  labelKey: string;
  descriptionKey: string;
  icon: "users" | "shield" | "bar-chart" | "stethoscope" | "settings";
  color: string;
  gradient: string;
  href: string;
  dataAccess: DataAccessLevel;
  accessKeys: string[];
  anonymizationKeys: string[];
};

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "community",
    labelKey: "personaCommunity",
    descriptionKey: "personaCommunityDesc",
    icon: "users",
    color: "#0E8074",
    gradient: "from-teal-500 to-emerald-600",
    href: "/chat",
    dataAccess: "full",
    accessKeys: ["accessChat", "accessScan", "accessFamily", "accessRights"],
    anonymizationKeys: ["anonLocal", "anonAiScrub", "anonNoServer"],
  },
  {
    id: "mediator",
    labelKey: "personaMediator",
    descriptionKey: "personaMediatorDesc",
    icon: "shield",
    color: "#2563EB",
    gradient: "from-blue-500 to-indigo-600",
    href: "/mediator",
    dataAccess: "pseudonymized",
    accessKeys: ["accessCases", "accessVisits", "accessPoids", "accessExport"],
    anonymizationKeys: ["anonPseudonym", "anonCountyOnly", "anonNoMinistryNames"],
  },
  {
    id: "manager",
    labelKey: "personaManager",
    descriptionKey: "personaManagerDesc",
    icon: "bar-chart",
    color: "#7C3AED",
    gradient: "from-violet-500 to-purple-600",
    href: "/impact",
    dataAccess: "aggregated",
    accessKeys: ["accessKpis", "accessCounties", "accessTrends", "accessCompliance"],
    anonymizationKeys: ["anonAggregated", "anonNoIndividuals", "anonGdprReady"],
  },
  {
    id: "doctor",
    labelKey: "personaDoctor",
    descriptionKey: "personaDoctorDesc",
    icon: "stethoscope",
    color: "#DC2626",
    gradient: "from-rose-500 to-red-600",
    href: "/consult",
    dataAccess: "pseudonymized",
    accessKeys: ["accessConsult", "accessTriage", "accessReferrals", "accessSummary"],
    anonymizationKeys: ["anonClinicalOnly", "anonNoContact", "anonAiScrub"],
  },
  {
    id: "admin",
    labelKey: "personaAdmin",
    descriptionKey: "personaAdminDesc",
    icon: "settings",
    color: "#475569",
    gradient: "from-slate-500 to-slate-700",
    href: "/admin/dashboard",
    dataAccess: "none",
    accessKeys: ["accessBranding", "accessHero", "accessFonts", "accessCss"],
    anonymizationKeys: ["anonNoPatientData", "anonConfigOnly"],
  },
];

export const DEMO_PERSONA_COOKIE = "redi_demo_persona";
export const DEMO_MODE_KEY = "redi_demo_mode";

export function getPersonaById(id: string | null | undefined): DemoPersona | null {
  if (!id) return null;
  return DEMO_PERSONAS.find((p) => p.id === id) ?? null;
}

export function dataAccessLabelKey(level: DataAccessLevel): string {
  switch (level) {
    case "full":
      return "dataAccessFull";
    case "pseudonymized":
      return "dataAccessPseudonymized";
    case "aggregated":
      return "dataAccessAggregated";
    case "none":
      return "dataAccessNone";
  }
}
