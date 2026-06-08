export type Vaccine = {
  id: string;
  abbreviation: string;
  ageMonths: number[];
  doses: number;
  importanceLevel: "critical" | "important" | "recommended";
};

export type AgeGroup = {
  id: string;
  vaccines: string[];
};

export const VACCINES: Vaccine[] = [
  { id: "bcg", abbreviation: "BCG", ageMonths: [0], doses: 1, importanceLevel: "critical" },
  { id: "hepb", abbreviation: "HepB", ageMonths: [0, 1, 6], doses: 3, importanceLevel: "critical" },
  { id: "dtap", abbreviation: "DTaP", ageMonths: [2, 4, 6, 18, 48], doses: 5, importanceLevel: "critical" },
  { id: "ipv", abbreviation: "IPV", ageMonths: [2, 4, 6, 48], doses: 4, importanceLevel: "critical" },
  { id: "mmr", abbreviation: "MMR", ageMonths: [12, 48], doses: 2, importanceLevel: "critical" },
  { id: "pneumo", abbreviation: "PCV13", ageMonths: [2, 4, 12], doses: 3, importanceLevel: "critical" },
  { id: "rota", abbreviation: "RV", ageMonths: [2, 4], doses: 2, importanceLevel: "important" },
  { id: "varicella", abbreviation: "VAR", ageMonths: [12, 48], doses: 2, importanceLevel: "recommended" },
  { id: "hpv", abbreviation: "HPV", ageMonths: [108, 120], doses: 2, importanceLevel: "important" },
  { id: "flu", abbreviation: "Flu", ageMonths: [6], doses: 1, importanceLevel: "recommended" },
];

export const AGE_GROUPS: AgeGroup[] = [
  { id: "birth", vaccines: ["bcg", "hepb"] },
  { id: "2months", vaccines: ["dtap", "ipv", "pneumo", "rota", "hepb"] },
  { id: "4months", vaccines: ["dtap", "ipv", "pneumo", "rota"] },
  { id: "6months", vaccines: ["dtap", "ipv", "hepb", "flu"] },
  { id: "12months", vaccines: ["mmr", "pneumo", "varicella"] },
  { id: "18months", vaccines: ["dtap"] },
  { id: "4years", vaccines: ["dtap", "ipv", "mmr", "varicella"] },
  { id: "9years", vaccines: ["hpv"] },
  { id: "adult", vaccines: ["flu"] },
  { id: "pregnant", vaccines: ["flu", "dtap"] },
];

export function getVaccine(id: string): Vaccine | undefined {
  return VACCINES.find((v) => v.id === id);
}

export function getVaccinesForAge(ageMonths: number): Vaccine[] {
  return VACCINES.filter((v) => v.ageMonths.some((a) => a <= ageMonths && a >= ageMonths - 2));
}
