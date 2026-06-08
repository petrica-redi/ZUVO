export type Story = {
  id: string;
  avatar: string;
  flag: string;
  category: "vaccines" | "chronic" | "maternal" | "discrimination" | "prevention" | "mental";
};

export const STORIES: Story[] = [
  { id: "maria-vaccines", avatar: "👩", flag: "🇷🇴", category: "vaccines" },
  { id: "stefan-diabetes", avatar: "👨", flag: "🇧🇬", category: "chronic" },
  { id: "elena-pregnancy", avatar: "🤰", flag: "🇷🇸", category: "maternal" },
  { id: "janos-discrimination", avatar: "👨", flag: "🇭🇺", category: "discrimination" },
  { id: "ana-tb", avatar: "👩", flag: "🇸🇰", category: "prevention" },
  { id: "mirela-depression", avatar: "👩", flag: "🇲🇰", category: "mental" },
];

export const CATEGORY_CONFIG = {
  vaccines: { color: "#10B981", emoji: "💉" },
  chronic: { color: "#F59E0B", emoji: "💊" },
  maternal: { color: "#EC4899", emoji: "🤰" },
  discrimination: { color: "#8B5CF6", emoji: "⚖️" },
  prevention: { color: "#3B82F6", emoji: "🛡️" },
  mental: { color: "#06B6D4", emoji: "🧠" },
};

export const CATEGORY_NEXT_STEPS: Record<string, Array<{ key: string; href: string }>> = {
  vaccines: [{ key: "vaccineGuide", href: "/vaccines" }, { key: "askZuvo", href: "/chat" }],
  chronic: [{ key: "explainPrescription", href: "/explain" }, { key: "askZuvo", href: "/chat" }],
  maternal: [{ key: "navigateToCare", href: "/navigate" }, { key: "askZuvo", href: "/chat" }],
  discrimination: [{ key: "knowYourRights", href: "/rights" }, { key: "navigateToCare", href: "/navigate" }],
  prevention: [{ key: "learnPrevention", href: "/learn/prevention" }, { key: "checkSymptoms", href: "/symptoms" }],
  mental: [{ key: "askZuvo", href: "/chat" }, { key: "learnMentalHealth", href: "/learn/mental" }],
};
