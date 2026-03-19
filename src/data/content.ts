/**
 * Sastipe Health Education Content
 *
 * Static content data for all 6 health pillars and their modules.
 * Text is keyed by translation namespace paths in messages/*.json.
 * Each module has: id, pillar, emoji, tips, a fact, and an action step.
 */

export type Tip = {
  icon: string;
  textKey: string;
};

export type Module = {
  id: string;
  pillarId: string;
  emoji: string;
  titleKey: string;
  descriptionKey: string;
  tips: Tip[];
  factKey: string;
  actionKey: string;
  durationMin: number;
};

export type Pillar = {
  id: string;
  emoji: string;
  color: string;
  bg: string;
  borderColor: string;
  descriptionKey: string;
  modules: Module[];
};

export const PILLARS: Pillar[] = [
  // ── Prevention ──────────────────────────────────────────────────────────
  {
    id: "prevention",
    emoji: "🛡️",
    color: "#16A34A",
    bg: "#F0FDF4",
    borderColor: "#BBF7D0",
    descriptionKey: "learn.prevention.description",
    modules: [
      {
        id: "handwashing",
        pillarId: "prevention",
        emoji: "🤲",
        titleKey: "learn.prevention.handwashing.title",
        descriptionKey: "learn.prevention.handwashing.description",
        tips: [
          { icon: "💧", textKey: "learn.prevention.handwashing.tip1" },
          { icon: "⏱️", textKey: "learn.prevention.handwashing.tip2" },
          { icon: "🧼", textKey: "learn.prevention.handwashing.tip3" },
          { icon: "🚰", textKey: "learn.prevention.handwashing.tip4" },
        ],
        factKey: "learn.prevention.handwashing.fact",
        actionKey: "learn.prevention.handwashing.action",
        durationMin: 5,
      },
      {
        id: "vaccination",
        pillarId: "prevention",
        emoji: "💉",
        titleKey: "learn.prevention.vaccination.title",
        descriptionKey: "learn.prevention.vaccination.description",
        tips: [
          { icon: "📅", textKey: "learn.prevention.vaccination.tip1" },
          { icon: "👶", textKey: "learn.prevention.vaccination.tip2" },
          { icon: "📋", textKey: "learn.prevention.vaccination.tip3" },
          { icon: "🏥", textKey: "learn.prevention.vaccination.tip4" },
        ],
        factKey: "learn.prevention.vaccination.fact",
        actionKey: "learn.prevention.vaccination.action",
        durationMin: 7,
      },
      {
        id: "clean-water",
        pillarId: "prevention",
        emoji: "💧",
        titleKey: "learn.prevention.cleanWater.title",
        descriptionKey: "learn.prevention.cleanWater.description",
        tips: [
          { icon: "🫙", textKey: "learn.prevention.cleanWater.tip1" },
          { icon: "🔥", textKey: "learn.prevention.cleanWater.tip2" },
          { icon: "🪣", textKey: "learn.prevention.cleanWater.tip3" },
          { icon: "❌", textKey: "learn.prevention.cleanWater.tip4" },
        ],
        factKey: "learn.prevention.cleanWater.fact",
        actionKey: "learn.prevention.cleanWater.action",
        durationMin: 5,
      },
      {
        id: "first-aid",
        pillarId: "prevention",
        emoji: "🩹",
        titleKey: "learn.prevention.firstAid.title",
        descriptionKey: "learn.prevention.firstAid.description",
        tips: [
          { icon: "📞", textKey: "learn.prevention.firstAid.tip1" },
          { icon: "🩸", textKey: "learn.prevention.firstAid.tip2" },
          { icon: "🔥", textKey: "learn.prevention.firstAid.tip3" },
          { icon: "😮‍💨", textKey: "learn.prevention.firstAid.tip4" },
        ],
        factKey: "learn.prevention.firstAid.fact",
        actionKey: "learn.prevention.firstAid.action",
        durationMin: 10,
      },
    ],
  },

  // ── Nutrition ─────────────────────────────────────────────────────────
  {
    id: "nutrition",
    emoji: "🥗",
    color: "#2563EB",
    bg: "#EFF6FF",
    borderColor: "#BFDBFE",
    descriptionKey: "learn.nutrition.description",
    modules: [
      {
        id: "balanced-diet",
        pillarId: "nutrition",
        emoji: "🍽️",
        titleKey: "learn.nutrition.balancedDiet.title",
        descriptionKey: "learn.nutrition.balancedDiet.description",
        tips: [
          { icon: "🥦", textKey: "learn.nutrition.balancedDiet.tip1" },
          { icon: "🍗", textKey: "learn.nutrition.balancedDiet.tip2" },
          { icon: "🌾", textKey: "learn.nutrition.balancedDiet.tip3" },
          { icon: "🫙", textKey: "learn.nutrition.balancedDiet.tip4" },
        ],
        factKey: "learn.nutrition.balancedDiet.fact",
        actionKey: "learn.nutrition.balancedDiet.action",
        durationMin: 6,
      },
      {
        id: "child-nutrition",
        pillarId: "nutrition",
        emoji: "🧒",
        titleKey: "learn.nutrition.childNutrition.title",
        descriptionKey: "learn.nutrition.childNutrition.description",
        tips: [
          { icon: "🍼", textKey: "learn.nutrition.childNutrition.tip1" },
          { icon: "🥕", textKey: "learn.nutrition.childNutrition.tip2" },
          { icon: "🍳", textKey: "learn.nutrition.childNutrition.tip3" },
          { icon: "🚫", textKey: "learn.nutrition.childNutrition.tip4" },
        ],
        factKey: "learn.nutrition.childNutrition.fact",
        actionKey: "learn.nutrition.childNutrition.action",
        durationMin: 7,
      },
      {
        id: "food-safety",
        pillarId: "nutrition",
        emoji: "🧊",
        titleKey: "learn.nutrition.foodSafety.title",
        descriptionKey: "learn.nutrition.foodSafety.description",
        tips: [
          { icon: "❄️", textKey: "learn.nutrition.foodSafety.tip1" },
          { icon: "🤲", textKey: "learn.nutrition.foodSafety.tip2" },
          { icon: "🕐", textKey: "learn.nutrition.foodSafety.tip3" },
          { icon: "🥩", textKey: "learn.nutrition.foodSafety.tip4" },
        ],
        factKey: "learn.nutrition.foodSafety.fact",
        actionKey: "learn.nutrition.foodSafety.action",
        durationMin: 5,
      },
    ],
  },

  // ── Maternal Health ───────────────────────────────────────────────────
  {
    id: "maternal",
    emoji: "🤱",
    color: "#9333EA",
    bg: "#FAF5FF",
    borderColor: "#E9D5FF",
    descriptionKey: "learn.maternal.description",
    modules: [
      {
        id: "prenatal-care",
        pillarId: "maternal",
        emoji: "🤰",
        titleKey: "learn.maternal.prenatalCare.title",
        descriptionKey: "learn.maternal.prenatalCare.description",
        tips: [
          { icon: "🏥", textKey: "learn.maternal.prenatalCare.tip1" },
          { icon: "💊", textKey: "learn.maternal.prenatalCare.tip2" },
          { icon: "🍎", textKey: "learn.maternal.prenatalCare.tip3" },
          { icon: "🚫", textKey: "learn.maternal.prenatalCare.tip4" },
        ],
        factKey: "learn.maternal.prenatalCare.fact",
        actionKey: "learn.maternal.prenatalCare.action",
        durationMin: 8,
      },
      {
        id: "safe-delivery",
        pillarId: "maternal",
        emoji: "👩‍⚕️",
        titleKey: "learn.maternal.safeDelivery.title",
        descriptionKey: "learn.maternal.safeDelivery.description",
        tips: [
          { icon: "🏥", textKey: "learn.maternal.safeDelivery.tip1" },
          { icon: "🧑‍⚕️", textKey: "learn.maternal.safeDelivery.tip2" },
          { icon: "⚠️", textKey: "learn.maternal.safeDelivery.tip3" },
          { icon: "📞", textKey: "learn.maternal.safeDelivery.tip4" },
        ],
        factKey: "learn.maternal.safeDelivery.fact",
        actionKey: "learn.maternal.safeDelivery.action",
        durationMin: 8,
      },
      {
        id: "breastfeeding",
        pillarId: "maternal",
        emoji: "🤱",
        titleKey: "learn.maternal.breastfeeding.title",
        descriptionKey: "learn.maternal.breastfeeding.description",
        tips: [
          { icon: "⏰", textKey: "learn.maternal.breastfeeding.tip1" },
          { icon: "🍽️", textKey: "learn.maternal.breastfeeding.tip2" },
          { icon: "💧", textKey: "learn.maternal.breastfeeding.tip3" },
          { icon: "👩", textKey: "learn.maternal.breastfeeding.tip4" },
        ],
        factKey: "learn.maternal.breastfeeding.fact",
        actionKey: "learn.maternal.breastfeeding.action",
        durationMin: 6,
      },
      {
        id: "postpartum",
        pillarId: "maternal",
        emoji: "💝",
        titleKey: "learn.maternal.postpartum.title",
        descriptionKey: "learn.maternal.postpartum.description",
        tips: [
          { icon: "😴", textKey: "learn.maternal.postpartum.tip1" },
          { icon: "💬", textKey: "learn.maternal.postpartum.tip2" },
          { icon: "🩺", textKey: "learn.maternal.postpartum.tip3" },
          { icon: "🧠", textKey: "learn.maternal.postpartum.tip4" },
        ],
        factKey: "learn.maternal.postpartum.fact",
        actionKey: "learn.maternal.postpartum.action",
        durationMin: 7,
      },
    ],
  },

  // ── Child Health ──────────────────────────────────────────────────────
  {
    id: "children",
    emoji: "👶",
    color: "#EA580C",
    bg: "#FFF7ED",
    borderColor: "#FED7AA",
    descriptionKey: "learn.children.description",
    modules: [
      {
        id: "growth-milestones",
        pillarId: "children",
        emoji: "📏",
        titleKey: "learn.children.growthMilestones.title",
        descriptionKey: "learn.children.growthMilestones.description",
        tips: [
          { icon: "⚖️", textKey: "learn.children.growthMilestones.tip1" },
          { icon: "🦷", textKey: "learn.children.growthMilestones.tip2" },
          { icon: "🗣️", textKey: "learn.children.growthMilestones.tip3" },
          { icon: "🚶", textKey: "learn.children.growthMilestones.tip4" },
        ],
        factKey: "learn.children.growthMilestones.fact",
        actionKey: "learn.children.growthMilestones.action",
        durationMin: 6,
      },
      {
        id: "common-illnesses",
        pillarId: "children",
        emoji: "🤒",
        titleKey: "learn.children.commonIllnesses.title",
        descriptionKey: "learn.children.commonIllnesses.description",
        tips: [
          { icon: "🌡️", textKey: "learn.children.commonIllnesses.tip1" },
          { icon: "💧", textKey: "learn.children.commonIllnesses.tip2" },
          { icon: "🏥", textKey: "learn.children.commonIllnesses.tip3" },
          { icon: "💊", textKey: "learn.children.commonIllnesses.tip4" },
        ],
        factKey: "learn.children.commonIllnesses.fact",
        actionKey: "learn.children.commonIllnesses.action",
        durationMin: 7,
      },
      {
        id: "immunization",
        pillarId: "children",
        emoji: "💉",
        titleKey: "learn.children.immunization.title",
        descriptionKey: "learn.children.immunization.description",
        tips: [
          { icon: "📅", textKey: "learn.children.immunization.tip1" },
          { icon: "📋", textKey: "learn.children.immunization.tip2" },
          { icon: "🤒", textKey: "learn.children.immunization.tip3" },
          { icon: "🆓", textKey: "learn.children.immunization.tip4" },
        ],
        factKey: "learn.children.immunization.fact",
        actionKey: "learn.children.immunization.action",
        durationMin: 6,
      },
    ],
  },

  // ── Chronic Disease ───────────────────────────────────────────────────
  {
    id: "chronic",
    emoji: "💊",
    color: "#DC2626",
    bg: "#FEF2F2",
    borderColor: "#FECACA",
    descriptionKey: "learn.chronic.description",
    modules: [
      {
        id: "diabetes",
        pillarId: "chronic",
        emoji: "🩸",
        titleKey: "learn.chronic.diabetes.title",
        descriptionKey: "learn.chronic.diabetes.description",
        tips: [
          { icon: "🥗", textKey: "learn.chronic.diabetes.tip1" },
          { icon: "🏃", textKey: "learn.chronic.diabetes.tip2" },
          { icon: "🩺", textKey: "learn.chronic.diabetes.tip3" },
          { icon: "⚠️", textKey: "learn.chronic.diabetes.tip4" },
        ],
        factKey: "learn.chronic.diabetes.fact",
        actionKey: "learn.chronic.diabetes.action",
        durationMin: 8,
      },
      {
        id: "heart-health",
        pillarId: "chronic",
        emoji: "❤️",
        titleKey: "learn.chronic.heartHealth.title",
        descriptionKey: "learn.chronic.heartHealth.description",
        tips: [
          { icon: "🚭", textKey: "learn.chronic.heartHealth.tip1" },
          { icon: "🏃", textKey: "learn.chronic.heartHealth.tip2" },
          { icon: "🧂", textKey: "learn.chronic.heartHealth.tip3" },
          { icon: "😌", textKey: "learn.chronic.heartHealth.tip4" },
        ],
        factKey: "learn.chronic.heartHealth.fact",
        actionKey: "learn.chronic.heartHealth.action",
        durationMin: 7,
      },
      {
        id: "respiratory",
        pillarId: "chronic",
        emoji: "🫁",
        titleKey: "learn.chronic.respiratory.title",
        descriptionKey: "learn.chronic.respiratory.description",
        tips: [
          { icon: "🚭", textKey: "learn.chronic.respiratory.tip1" },
          { icon: "🌿", textKey: "learn.chronic.respiratory.tip2" },
          { icon: "🏠", textKey: "learn.chronic.respiratory.tip3" },
          { icon: "🩺", textKey: "learn.chronic.respiratory.tip4" },
        ],
        factKey: "learn.chronic.respiratory.fact",
        actionKey: "learn.chronic.respiratory.action",
        durationMin: 6,
      },
    ],
  },

  // ── Mental Health ─────────────────────────────────────────────────────
  {
    id: "mental",
    emoji: "🧠",
    color: "#0891B2",
    bg: "#ECFEFF",
    borderColor: "#A5F3FC",
    descriptionKey: "learn.mental.description",
    modules: [
      {
        id: "stress-management",
        pillarId: "mental",
        emoji: "😌",
        titleKey: "learn.mental.stressManagement.title",
        descriptionKey: "learn.mental.stressManagement.description",
        tips: [
          { icon: "🌬️", textKey: "learn.mental.stressManagement.tip1" },
          { icon: "🚶", textKey: "learn.mental.stressManagement.tip2" },
          { icon: "💬", textKey: "learn.mental.stressManagement.tip3" },
          { icon: "🎵", textKey: "learn.mental.stressManagement.tip4" },
        ],
        factKey: "learn.mental.stressManagement.fact",
        actionKey: "learn.mental.stressManagement.action",
        durationMin: 5,
      },
      {
        id: "sleep",
        pillarId: "mental",
        emoji: "😴",
        titleKey: "learn.mental.sleep.title",
        descriptionKey: "learn.mental.sleep.description",
        tips: [
          { icon: "🌙", textKey: "learn.mental.sleep.tip1" },
          { icon: "📱", textKey: "learn.mental.sleep.tip2" },
          { icon: "☕", textKey: "learn.mental.sleep.tip3" },
          { icon: "🛏️", textKey: "learn.mental.sleep.tip4" },
        ],
        factKey: "learn.mental.sleep.fact",
        actionKey: "learn.mental.sleep.action",
        durationMin: 5,
      },
      {
        id: "community-support",
        pillarId: "mental",
        emoji: "🤝",
        titleKey: "learn.mental.communitySupport.title",
        descriptionKey: "learn.mental.communitySupport.description",
        tips: [
          { icon: "👥", textKey: "learn.mental.communitySupport.tip1" },
          { icon: "🗣️", textKey: "learn.mental.communitySupport.tip2" },
          { icon: "🙏", textKey: "learn.mental.communitySupport.tip3" },
          { icon: "🆘", textKey: "learn.mental.communitySupport.tip4" },
        ],
        factKey: "learn.mental.communitySupport.fact",
        actionKey: "learn.mental.communitySupport.action",
        durationMin: 6,
      },
      {
        id: "seek-help",
        pillarId: "mental",
        emoji: "🩺",
        titleKey: "learn.mental.seekHelp.title",
        descriptionKey: "learn.mental.seekHelp.description",
        tips: [
          { icon: "⚠️", textKey: "learn.mental.seekHelp.tip1" },
          { icon: "💬", textKey: "learn.mental.seekHelp.tip2" },
          { icon: "🏥", textKey: "learn.mental.seekHelp.tip3" },
          { icon: "📞", textKey: "learn.mental.seekHelp.tip4" },
        ],
        factKey: "learn.mental.seekHelp.fact",
        actionKey: "learn.mental.seekHelp.action",
        durationMin: 6,
      },
    ],
  },
];

// ── Lookup helpers ────────────────────────────────────────────────────────────

export function getPillar(id: string): Pillar | undefined {
  return PILLARS.find((p) => p.id === id);
}

export function getModule(pillarId: string, moduleId: string): Module | undefined {
  return getPillar(pillarId)?.modules.find((m) => m.id === moduleId);
}

export function getModuleIndex(pillarId: string, moduleId: string): number {
  return getPillar(pillarId)?.modules.findIndex((m) => m.id === moduleId) ?? -1;
}
