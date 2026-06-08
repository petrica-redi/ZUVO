export type GlossaryEntry = {
  id: string;
  category: "condition" | "medication" | "procedure" | "body" | "test";
  emoji: string;
};

export const GLOSSARY: GlossaryEntry[] = [
  { id: "hypertension", category: "condition", emoji: "💓" },
  { id: "diabetes-type-2", category: "condition", emoji: "🩸" },
  { id: "anemia", category: "condition", emoji: "😴" },
  { id: "asthma", category: "condition", emoji: "🫁" },
  { id: "tuberculosis-tb", category: "condition", emoji: "🦠" },
  { id: "depression", category: "condition", emoji: "🧠" },
  { id: "hepatitis-b-c", category: "condition", emoji: "🟡" },
  { id: "pneumonia", category: "condition", emoji: "🤒" },
  { id: "gastritis", category: "condition", emoji: "🤢" },
  { id: "eczema", category: "condition", emoji: "🧴" },
  { id: "antibiotic", category: "medication", emoji: "💊" },
  { id: "ibuprofen", category: "medication", emoji: "💊" },
  { id: "paracetamol", category: "medication", emoji: "💊" },
  { id: "insulin", category: "medication", emoji: "💉" },
  { id: "metformin", category: "medication", emoji: "💊" },
  { id: "blood-test", category: "test", emoji: "🩸" },
  { id: "x-ray", category: "test", emoji: "📷" },
  { id: "ultrasound", category: "test", emoji: "🔊" },
  { id: "ecg-ekg", category: "test", emoji: "❤️" },
  { id: "vaccination", category: "procedure", emoji: "💉" },
  { id: "blood-pressure", category: "body", emoji: "🫀" },
  { id: "blood-sugar", category: "body", emoji: "📊" },
  { id: "bmi", category: "body", emoji: "⚖️" },
  { id: "immune-system", category: "body", emoji: "🛡️" },
];

export const CATEGORY_CONFIG = {
  condition: { color: "#EF4444", bg: "bg-red-50", border: "border-red-100" },
  medication: { color: "#3B82F6", bg: "bg-blue-50", border: "border-blue-100" },
  procedure: { color: "#8B5CF6", bg: "bg-purple-50", border: "border-purple-100" },
  body: { color: "#10B981", bg: "bg-emerald-50", border: "border-emerald-100" },
  test: { color: "#F59E0B", bg: "bg-amber-50", border: "border-amber-100" },
};
