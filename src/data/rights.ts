export type PatientRight = {
  id: string;
  emoji: string;
};

export const UNIVERSAL_RIGHTS: PatientRight[] = [
  { id: "treatment", emoji: "🏥" },
  { id: "information", emoji: "📋" },
  { id: "consent", emoji: "✋" },
  { id: "privacy", emoji: "🔒" },
  { id: "interpreter", emoji: "🗣️" },
  { id: "second-opinion", emoji: "👥" },
  { id: "records", emoji: "📁" },
  { id: "complaint", emoji: "📝" },
];

export type DiscriminationScenario = {
  id: string;
  emoji: string;
};

export const DISCRIMINATION_SCENARIOS: DiscriminationScenario[] = [
  { id: "refused-treatment", emoji: "🚫" },
  { id: "rude-staff", emoji: "😤" },
  { id: "no-insurance", emoji: "💳" },
  { id: "language-barrier", emoji: "🗣️" },
];

export type LegalContact = {
  id: string;
  flag: string;
  ombudsmanPhone?: string;
  antiDiscriminationPhone?: string;
};

export const LEGAL_CONTACTS: LegalContact[] = [
  { id: "romania", flag: "🇷🇴", ombudsmanPhone: "021 312 7134", antiDiscriminationPhone: "021 312 6578" },
  { id: "bulgaria", flag: "🇧🇬", ombudsmanPhone: "02 810 6955" },
  { id: "hungary", flag: "🇭🇺", ombudsmanPhone: "06 1 475 7100" },
  { id: "slovakia", flag: "🇸🇰", ombudsmanPhone: "02 4828 7401" },
  { id: "czech-republic", flag: "🇨🇿", ombudsmanPhone: "542 542 888" },
  { id: "serbia", flag: "🇷🇸", ombudsmanPhone: "011 206 8100" },
  { id: "albania", flag: "🇦🇱", ombudsmanPhone: "042 380 300" },
  { id: "north-macedonia", flag: "🇲🇰", ombudsmanPhone: "02 3129 335" },
  { id: "greece", flag: "🇬🇷", ombudsmanPhone: "213 130 6600" },
  { id: "croatia", flag: "🇭🇷", ombudsmanPhone: "01 4851 855" },
];
