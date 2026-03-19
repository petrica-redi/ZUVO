export type PatientRight = {
  id: string;
  title: string;
  description: string;
  emoji: string;
};

export const UNIVERSAL_RIGHTS: PatientRight[] = [
  { id: "treatment", emoji: "🏥", title: "Right to emergency treatment", description: "Every hospital MUST treat you in an emergency, even without insurance or documents. This is law in every EU country. If they refuse, ask for the doctor's name and report it." },
  { id: "information", emoji: "📋", title: "Right to understand your diagnosis", description: "Your doctor must explain your condition in words you understand. If you don't understand, say: 'Can you explain this more simply?' You can also ask for a written summary." },
  { id: "consent", emoji: "✋", title: "Right to say no", description: "No one can force treatment on you. Before any procedure, the doctor must explain what they will do and you must agree. You can always say 'I need time to think.'" },
  { id: "privacy", emoji: "🔒", title: "Right to privacy", description: "Your medical information is private. Doctors cannot share it with your employer, family, or anyone else without your permission. This includes your HIV status, pregnancy, or mental health." },
  { id: "interpreter", emoji: "🗣️", title: "Right to an interpreter", description: "If you don't speak the local language well, you can request an interpreter. Many hospitals have this service. If not, you can bring someone you trust to translate." },
  { id: "second-opinion", emoji: "👥", title: "Right to a second opinion", description: "If you disagree with a diagnosis, you can see another doctor. This is your right. You don't need to explain why." },
  { id: "records", emoji: "📁", title: "Right to your medical records", description: "You can ask for a copy of all your medical records at any time. The hospital must provide them. This is useful when changing doctors or moving to another city." },
  { id: "complaint", emoji: "📝", title: "Right to complain", description: "If you feel mistreated or discriminated against, you can file a complaint. Every hospital has a complaints procedure. You can also contact the patient ombudsman in your country." },
];

export type DiscriminationScenario = {
  id: string;
  situation: string;
  whatToSay: string;
  whatToDo: string[];
  emoji: string;
};

export const DISCRIMINATION_SCENARIOS: DiscriminationScenario[] = [
  {
    id: "refused-treatment",
    emoji: "🚫",
    situation: "The hospital refuses to treat you",
    whatToSay: "\"I have the right to emergency treatment under EU law. Please write down your name and the reason you are refusing.\"",
    whatToDo: [
      "Stay calm but firm",
      "Ask for the doctor's full name",
      "Ask for the refusal in writing",
      "Call the patient ombudsman",
      "Contact a Roma rights organization",
    ],
  },
  {
    id: "rude-staff",
    emoji: "😤",
    situation: "Hospital staff are rude or dismissive because of your ethnicity",
    whatToSay: "\"I am here for medical help. I expect to be treated with the same respect as every other patient.\"",
    whatToDo: [
      "Ask to speak with the head nurse or department chief",
      "Note the date, time, and names",
      "File a written complaint at the hospital",
      "Report to the national anti-discrimination body",
    ],
  },
  {
    id: "no-insurance",
    emoji: "💳",
    situation: "You don't have health insurance",
    whatToSay: "\"I need medical help. What are my options for uninsured patients?\"",
    whatToDo: [
      "Emergency care is always free — insist on it",
      "Ask about social assistance programs",
      "Contact a health mediator in your area",
      "Many NGOs provide free clinics — ask at the hospital",
    ],
  },
  {
    id: "language-barrier",
    emoji: "🗣️",
    situation: "You can't communicate with the doctor",
    whatToSay: "\"I need help understanding. Can you provide an interpreter or speak more slowly?\"",
    whatToDo: [
      "Use this app to translate key phrases",
      "Bring a trusted person who speaks the language",
      "Ask for written instructions you can translate later",
      "Use your phone's camera to translate documents",
    ],
  },
];

export type LegalContact = {
  country: string;
  flag: string;
  ombudsman: string;
  ombudsmanPhone?: string;
  antiDiscrimination: string;
  antiDiscriminationPhone?: string;
  romaRightsOrg?: string;
};

export const LEGAL_CONTACTS: LegalContact[] = [
  { country: "Romania", flag: "🇷🇴", ombudsman: "Avocatul Poporului", ombudsmanPhone: "021 312 7134", antiDiscrimination: "CNCD", antiDiscriminationPhone: "021 312 6578", romaRightsOrg: "Romani CRISS" },
  { country: "Bulgaria", flag: "🇧🇬", ombudsman: "Ombudsman of Bulgaria", ombudsmanPhone: "02 810 6955", antiDiscrimination: "Commission for Protection against Discrimination", romaRightsOrg: "Amalipe Center" },
  { country: "Hungary", flag: "🇭🇺", ombudsman: "Commissioner for Fundamental Rights", ombudsmanPhone: "06 1 475 7100", antiDiscrimination: "Equal Treatment Authority", romaRightsOrg: "Romaversitas Foundation" },
  { country: "Slovakia", flag: "🇸🇰", ombudsman: "Public Defender of Rights", ombudsmanPhone: "02 4828 7401", antiDiscrimination: "Slovak National Centre for Human Rights", romaRightsOrg: "ETP Slovakia" },
  { country: "Czech Republic", flag: "🇨🇿", ombudsman: "Public Defender of Rights", ombudsmanPhone: "542 542 888", antiDiscrimination: "Office of the Public Defender", romaRightsOrg: "Romea.cz" },
  { country: "Serbia", flag: "🇷🇸", ombudsman: "Protector of Citizens", ombudsmanPhone: "011 206 8100", antiDiscrimination: "Commissioner for Equality", romaRightsOrg: "Praxis" },
  { country: "Albania", flag: "🇦🇱", ombudsman: "People's Advocate", ombudsmanPhone: "042 380 300", antiDiscrimination: "Commissioner for Protection from Discrimination" },
  { country: "North Macedonia", flag: "🇲🇰", ombudsman: "Ombudsman", ombudsmanPhone: "02 3129 335", antiDiscrimination: "Commission for Prevention and Protection against Discrimination" },
  { country: "Greece", flag: "🇬🇷", ombudsman: "Greek Ombudsman", ombudsmanPhone: "213 130 6600", antiDiscrimination: "Greek Ombudsman (Equal Treatment)" },
  { country: "Croatia", flag: "🇭🇷", ombudsman: "Ombudswoman", ombudsmanPhone: "01 4851 855", antiDiscrimination: "Ombudswoman" },
];
