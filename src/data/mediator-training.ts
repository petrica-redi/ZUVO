/**
 * Curated ECI / POIDS training curriculum for community health mediators
 * (AMC, mediator sanitar) and adjacent roles (asistent social, consilier
 * școlar, mediator școlar).
 *
 * Each module groups: framework references, key actions in the field, and
 * (optionally) deep-link tools inside Redi Health. The content is pinned to
 * stable Romanian legal/health sources; mediators always have one tap to
 * confirm a procedure.
 */

export type TrainingTier = "foundations" | "health" | "social" | "fieldwork";

export type TrainingModule = {
  id: string;
  tier: TrainingTier;
  titleKey: string;
  summaryKey: string;
  /** Estimated reading/preparation time in minutes. */
  minutes: number;
  /** Bullet points (translation keys) — practical points for the field. */
  keyPointKeys: string[];
  /** Verified external sources (titles + URLs). */
  references: { title: string; url: string }[];
  /** Optional in-app deep links to relevant Redi Health tools. */
  toolLinks?: { labelKey: string; href: string }[];
};

const HEALTH_LAW_LINK = {
  title: "OUG 18/2017 — Asistența medicală comunitară",
  url: "https://legislatie.just.ro/Public/DetaliiDocument/187048",
};
const POIDS_LINK = {
  title: "POIDS — Programul Incluziune și Demnitate Socială",
  url: "https://mfe.gov.ro/minister/perioade-de-programare/perioada-2021-2027/",
};
const SCI_2000_LINK = {
  title: "Servicii Comunitare Integrate (SCI 2000)",
  url: "https://www.ms.ro/ro/centrul-de-presa/incluziune-social%C4%83-%C8%99i-servicii-de-baz%C4%83-pentru-450000-de-rom%C3%A2ni-un-proiect-na%C8%9Bional-dedicat-persoanelor-vulnerabile-din-mediul-rural/",
};
const NORM_AMC_LINK = {
  title: "Normele AMC — Anexa nr. 1 (2019)",
  url: "https://legislatie.just.ro/Public/DetaliiDocument/214843",
};

export const TRAINING_MODULES: TrainingModule[] = [
  // ── Foundations ────────────────────────────────────────────────────────
  {
    id: "eci-intro",
    tier: "foundations",
    titleKey: "training.modules.eciIntro.title",
    summaryKey: "training.modules.eciIntro.summary",
    minutes: 20,
    keyPointKeys: [
      "training.modules.eciIntro.k1",
      "training.modules.eciIntro.k2",
      "training.modules.eciIntro.k3",
      "training.modules.eciIntro.k4",
    ],
    references: [POIDS_LINK, SCI_2000_LINK],
  },
  {
    id: "legal-framework",
    tier: "foundations",
    titleKey: "training.modules.legal.title",
    summaryKey: "training.modules.legal.summary",
    minutes: 25,
    keyPointKeys: [
      "training.modules.legal.k1",
      "training.modules.legal.k2",
      "training.modules.legal.k3",
    ],
    references: [HEALTH_LAW_LINK, NORM_AMC_LINK],
  },
  {
    id: "fir-risk-identification",
    tier: "foundations",
    titleKey: "training.modules.fir.title",
    summaryKey: "training.modules.fir.summary",
    minutes: 30,
    keyPointKeys: [
      "training.modules.fir.k1",
      "training.modules.fir.k2",
      "training.modules.fir.k3",
      "training.modules.fir.k4",
    ],
    references: [NORM_AMC_LINK],
  },
  {
    id: "case-management",
    tier: "foundations",
    titleKey: "training.modules.caseMgmt.title",
    summaryKey: "training.modules.caseMgmt.summary",
    minutes: 25,
    keyPointKeys: [
      "training.modules.caseMgmt.k1",
      "training.modules.caseMgmt.k2",
      "training.modules.caseMgmt.k3",
      "training.modules.caseMgmt.k4",
      "training.modules.caseMgmt.k5",
    ],
    references: [SCI_2000_LINK],
    toolLinks: [{ labelKey: "mediator.tabCases", href: "/mediator" }],
  },

  // ── Health ─────────────────────────────────────────────────────────────
  {
    id: "vaccination",
    tier: "health",
    titleKey: "training.modules.vaccination.title",
    summaryKey: "training.modules.vaccination.summary",
    minutes: 35,
    keyPointKeys: [
      "training.modules.vaccination.k1",
      "training.modules.vaccination.k2",
      "training.modules.vaccination.k3",
      "training.modules.vaccination.k4",
    ],
    references: [
      {
        title: "Programul Național de Vaccinare — Ministerul Sănătății",
        url: "https://www.ms.ro/ro/transparenta-decizionala/programe-nationale-de-sanatate/",
      },
    ],
    toolLinks: [{ labelKey: "mediator.toolsVaccines", href: "/vaccines" }],
  },
  {
    id: "maternal-child",
    tier: "health",
    titleKey: "training.modules.maternal.title",
    summaryKey: "training.modules.maternal.summary",
    minutes: 30,
    keyPointKeys: [
      "training.modules.maternal.k1",
      "training.modules.maternal.k2",
      "training.modules.maternal.k3",
      "training.modules.maternal.k4",
    ],
    references: [NORM_AMC_LINK],
    toolLinks: [{ labelKey: "mediator.toolsExplain", href: "/explain" }],
  },
  {
    id: "chronic-disease",
    tier: "health",
    titleKey: "training.modules.chronic.title",
    summaryKey: "training.modules.chronic.summary",
    minutes: 25,
    keyPointKeys: [
      "training.modules.chronic.k1",
      "training.modules.chronic.k2",
      "training.modules.chronic.k3",
    ],
    references: [NORM_AMC_LINK],
    toolLinks: [{ labelKey: "mediator.toolsScan", href: "/scan" }],
  },
  {
    id: "tb-communicable",
    tier: "health",
    titleKey: "training.modules.tb.title",
    summaryKey: "training.modules.tb.summary",
    minutes: 20,
    keyPointKeys: [
      "training.modules.tb.k1",
      "training.modules.tb.k2",
      "training.modules.tb.k3",
    ],
    references: [
      {
        title: "Strategia Națională TB — INSP",
        url: "https://insp.gov.ro/centrul-national-de-evaluare-si-promovare-a-starii-de-sanatate-cnepss/",
      },
    ],
  },
  {
    id: "screening",
    tier: "health",
    titleKey: "training.modules.screening.title",
    summaryKey: "training.modules.screening.summary",
    minutes: 20,
    keyPointKeys: [
      "training.modules.screening.k1",
      "training.modules.screening.k2",
      "training.modules.screening.k3",
    ],
    references: [NORM_AMC_LINK],
  },
  {
    id: "mental-health",
    tier: "health",
    titleKey: "training.modules.mentalHealth.title",
    summaryKey: "training.modules.mentalHealth.summary",
    minutes: 20,
    keyPointKeys: [
      "training.modules.mentalHealth.k1",
      "training.modules.mentalHealth.k2",
      "training.modules.mentalHealth.k3",
    ],
    references: [NORM_AMC_LINK],
  },

  // ── Social ─────────────────────────────────────────────────────────────
  {
    id: "rights-insurance",
    tier: "social",
    titleKey: "training.modules.rights.title",
    summaryKey: "training.modules.rights.summary",
    minutes: 25,
    keyPointKeys: [
      "training.modules.rights.k1",
      "training.modules.rights.k2",
      "training.modules.rights.k3",
      "training.modules.rights.k4",
    ],
    references: [
      {
        title: "Casa Națională de Asigurări de Sănătate",
        url: "https://cnas.ro/",
      },
    ],
    toolLinks: [{ labelKey: "mediator.toolsRights", href: "/rights" }],
  },
  {
    id: "school-dropout",
    tier: "social",
    titleKey: "training.modules.school.title",
    summaryKey: "training.modules.school.summary",
    minutes: 20,
    keyPointKeys: [
      "training.modules.school.k1",
      "training.modules.school.k2",
      "training.modules.school.k3",
    ],
    references: [
      {
        title: "Programul Național de Reducere a Abandonului Școlar (PNRAS)",
        url: "https://edu.ro/",
      },
    ],
  },

  // ── Field work ─────────────────────────────────────────────────────────
  {
    id: "communication",
    tier: "fieldwork",
    titleKey: "training.modules.communication.title",
    summaryKey: "training.modules.communication.summary",
    minutes: 20,
    keyPointKeys: [
      "training.modules.communication.k1",
      "training.modules.communication.k2",
      "training.modules.communication.k3",
    ],
    references: [SCI_2000_LINK],
    toolLinks: [{ labelKey: "mediator.toolsChat", href: "/chat" }],
  },
  {
    id: "monthly-reporting",
    tier: "fieldwork",
    titleKey: "training.modules.reporting.title",
    summaryKey: "training.modules.reporting.summary",
    minutes: 20,
    keyPointKeys: [
      "training.modules.reporting.k1",
      "training.modules.reporting.k2",
      "training.modules.reporting.k3",
    ],
    references: [HEALTH_LAW_LINK, NORM_AMC_LINK],
    toolLinks: [
      { labelKey: "mediator.exportPrint", href: "/mediator" },
    ],
  },
];

export function trainingProgressPercent(
  completedIds: Set<string>,
): number {
  if (TRAINING_MODULES.length === 0) return 0;
  let done = 0;
  for (const m of TRAINING_MODULES) if (completedIds.has(m.id)) done += 1;
  return Math.round((done / TRAINING_MODULES.length) * 100);
}
