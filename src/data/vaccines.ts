export type Vaccine = {
  id: string;
  name: string;
  abbreviation: string;
  preventsDiseases: string[];
  ageMonths: number[];
  doses: number;
  howItWorks: string;
  sideEffects: string;
  mythDebunked: string;
  importanceLevel: "critical" | "important" | "recommended";
};

export type AgeGroup = {
  id: string;
  label: string;
  ageRange: string;
  vaccines: string[];
};

export const VACCINES: Vaccine[] = [
  {
    id: "bcg",
    name: "BCG (Tuberculosis)",
    abbreviation: "BCG",
    preventsDiseases: ["Tuberculosis (TB)"],
    ageMonths: [0],
    doses: 1,
    howItWorks: "This vaccine teaches your baby's body to fight tuberculosis — a serious lung disease that spreads through the air. One small injection in the arm gives protection for years.",
    sideEffects: "A small bump or scar on the arm where the injection was given. This is normal and means the vaccine is working.",
    mythDebunked: "MYTH: 'TB doesn't exist anymore.' TRUTH: TB still kills 1.5 million people every year. In crowded living conditions, it spreads fast. I have seen TB outbreaks in settlements where families refused this vaccine.",
    importanceLevel: "critical",
  },
  {
    id: "hepb",
    name: "Hepatitis B",
    abbreviation: "HepB",
    preventsDiseases: ["Hepatitis B (liver disease)"],
    ageMonths: [0, 1, 6],
    doses: 3,
    howItWorks: "Protects the liver from a virus that can cause lifelong liver damage and cancer. Given at birth because babies are most vulnerable.",
    sideEffects: "Mild soreness at the injection site. Some babies are a little fussy for a day. Nothing serious.",
    mythDebunked: "MYTH: 'My baby is too young for vaccines at birth.' TRUTH: Newborns are actually the most vulnerable. The earlier we protect them, the safer they are. This vaccine has been given to billions of babies safely.",
    importanceLevel: "critical",
  },
  {
    id: "dtap",
    name: "DTaP (Diphtheria, Tetanus, Pertussis)",
    abbreviation: "DTaP",
    preventsDiseases: ["Diphtheria", "Tetanus (lockjaw)", "Whooping cough"],
    ageMonths: [2, 4, 6, 18, 48],
    doses: 5,
    howItWorks: "Three-in-one protection. Diphtheria can block your child's throat. Tetanus causes muscles to lock painfully. Whooping cough makes babies cough so hard they can't breathe.",
    sideEffects: "The injection site may be red and sore. Your child might have a mild fever for 1-2 days. Give them extra love and fluids.",
    mythDebunked: "MYTH: 'These diseases don't exist anymore, why vaccinate?' TRUTH: They don't exist BECAUSE of vaccines. When communities stop vaccinating, these diseases come back. I saw a whooping cough outbreak in a settlement in 2018 — three babies were hospitalized.",
    importanceLevel: "critical",
  },
  {
    id: "ipv",
    name: "Polio (IPV)",
    abbreviation: "IPV",
    preventsDiseases: ["Polio (paralysis)"],
    ageMonths: [2, 4, 6, 48],
    doses: 4,
    howItWorks: "Polio is a virus that can paralyze a child's legs permanently in hours. This vaccine has nearly eliminated polio from the world.",
    sideEffects: "Very mild. Some redness at the injection site. That's it.",
    mythDebunked: "MYTH: 'Polio is gone, we don't need this.' TRUTH: Polio is gone in Europe BECAUSE of this vaccine. It still exists in some countries. One unvaccinated traveler can bring it back.",
    importanceLevel: "critical",
  },
  {
    id: "mmr",
    name: "MMR (Measles, Mumps, Rubella)",
    abbreviation: "MMR",
    preventsDiseases: ["Measles", "Mumps", "Rubella (German measles)"],
    ageMonths: [12, 48],
    doses: 2,
    howItWorks: "Measles is extremely contagious and can cause brain damage and death. Mumps causes painful swelling. Rubella is dangerous for pregnant women. One vaccine protects against all three.",
    sideEffects: "About 1 in 10 children get a mild fever and rash 7-10 days after. This means the body is learning to fight. It goes away on its own.",
    mythDebunked: "MYTH: 'MMR causes autism.' TRUTH: This is the most studied vaccine myth in history. Over 1.2 million children studied — NO link to autism. The doctor who made this claim lost his medical license for fraud. I have personally seen children die from measles in settlements where this lie spread.",
    importanceLevel: "critical",
  },
  {
    id: "pneumo",
    name: "Pneumococcal (PCV13)",
    abbreviation: "PCV13",
    preventsDiseases: ["Pneumonia", "Meningitis", "Blood infections"],
    ageMonths: [2, 4, 12],
    doses: 3,
    howItWorks: "Protects against bacteria that cause pneumonia (lung infection), meningitis (brain infection), and blood infections. These are the biggest killers of young children.",
    sideEffects: "Mild fever, fussiness, soreness at injection site for 1-2 days.",
    mythDebunked: "MYTH: 'Children get sick from too many vaccines.' TRUTH: Children's immune systems handle thousands of germs every day. A few vaccines are nothing compared to what their body already fights.",
    importanceLevel: "critical",
  },
  {
    id: "rota",
    name: "Rotavirus",
    abbreviation: "RV",
    preventsDiseases: ["Severe diarrhea and vomiting in babies"],
    ageMonths: [2, 4],
    doses: 2,
    howItWorks: "Given as drops in the mouth (not an injection!). Protects against the virus that causes severe diarrhea in babies — which can be deadly due to dehydration.",
    sideEffects: "Very mild. Occasionally a little fussiness or mild diarrhea.",
    mythDebunked: "MYTH: 'Diarrhea is normal for babies, they don't need a vaccine.' TRUTH: Rotavirus diarrhea is NOT normal — it causes severe dehydration that kills hundreds of thousands of children worldwide every year.",
    importanceLevel: "important",
  },
  {
    id: "varicella",
    name: "Varicella (Chickenpox)",
    abbreviation: "VAR",
    preventsDiseases: ["Chickenpox"],
    ageMonths: [12, 48],
    doses: 2,
    howItWorks: "Chickenpox seems mild but can cause serious skin infections, pneumonia, and brain swelling. The vaccine prevents it almost completely.",
    sideEffects: "Mild soreness. Rarely, a few chickenpox-like spots near the injection site.",
    mythDebunked: "MYTH: 'It's better to get chickenpox naturally.' TRUTH: Natural chickenpox can cause serious complications and the virus stays in your body forever, causing painful shingles later in life.",
    importanceLevel: "recommended",
  },
  {
    id: "hpv",
    name: "HPV (Human Papillomavirus)",
    abbreviation: "HPV",
    preventsDiseases: ["Cervical cancer", "Other cancers"],
    ageMonths: [108, 120],
    doses: 2,
    howItWorks: "This vaccine prevents cancer. HPV is a very common virus that can cause cervical cancer in women and other cancers in both men and women. Given to teenagers before they are exposed to the virus.",
    sideEffects: "Sore arm, sometimes a brief headache or dizziness. Very safe.",
    mythDebunked: "MYTH: 'This vaccine encourages sexual activity.' TRUTH: This vaccine prevents CANCER. It has nothing to do with behavior. Would you refuse a cancer-preventing medicine for your child?",
    importanceLevel: "important",
  },
  {
    id: "flu",
    name: "Influenza (Flu)",
    abbreviation: "Flu",
    preventsDiseases: ["Seasonal flu"],
    ageMonths: [6],
    doses: 1,
    howItWorks: "The flu is not just a cold — it can be serious for young children, elderly people, and pregnant women. This vaccine is updated every year to match the current flu strains.",
    sideEffects: "Mild soreness, occasionally a low fever for a day. You CANNOT get the flu from the flu vaccine.",
    mythDebunked: "MYTH: 'The flu vaccine gives you the flu.' TRUTH: Impossible. The vaccine contains no live virus. If you feel a little off for a day, that's your immune system learning — not the flu.",
    importanceLevel: "recommended",
  },
];

export const AGE_GROUPS: AgeGroup[] = [
  { id: "birth", label: "At birth", ageRange: "0 months", vaccines: ["bcg", "hepb"] },
  { id: "2months", label: "2 months", ageRange: "2 months", vaccines: ["dtap", "ipv", "pneumo", "rota", "hepb"] },
  { id: "4months", label: "4 months", ageRange: "4 months", vaccines: ["dtap", "ipv", "pneumo", "rota"] },
  { id: "6months", label: "6 months", ageRange: "6 months", vaccines: ["dtap", "ipv", "hepb", "flu"] },
  { id: "12months", label: "12 months", ageRange: "12 months", vaccines: ["mmr", "pneumo", "varicella"] },
  { id: "18months", label: "18 months", ageRange: "18 months", vaccines: ["dtap"] },
  { id: "4years", label: "4-6 years", ageRange: "4-6 years", vaccines: ["dtap", "ipv", "mmr", "varicella"] },
  { id: "9years", label: "9-12 years", ageRange: "9-12 years", vaccines: ["hpv"] },
  { id: "adult", label: "Adults", ageRange: "18+ years", vaccines: ["flu"] },
  { id: "pregnant", label: "Pregnant women", ageRange: "During pregnancy", vaccines: ["flu", "dtap"] },
];

export function getVaccine(id: string): Vaccine | undefined {
  return VACCINES.find((v) => v.id === id);
}

export function getVaccinesForAge(ageMonths: number): Vaccine[] {
  return VACCINES.filter((v) => v.ageMonths.some((a) => a <= ageMonths && a >= ageMonths - 2));
}
