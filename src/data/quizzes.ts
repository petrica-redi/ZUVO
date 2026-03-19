export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Quiz = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  gradient: string;
  questions: QuizQuestion[];
};

export const QUIZZES: Quiz[] = [
  {
    id: "antibiotics",
    title: "Antibiotics",
    emoji: "💊",
    description: "Do you know when to use antibiotics?",
    gradient: "from-blue-500 to-indigo-600",
    questions: [
      { question: "Can antibiotics cure the flu?", options: ["Yes", "No", "Sometimes"], correctIndex: 1, explanation: "The flu is caused by a virus. Antibiotics only kill bacteria. Taking antibiotics for the flu does nothing and can make future infections harder to treat." },
      { question: "You feel better after 3 days of antibiotics. Should you stop?", options: ["Yes, you're cured", "No, finish the full course", "Take half the remaining pills"], correctIndex: 1, explanation: "ALWAYS finish the full course. If you stop early, some bacteria survive and become resistant. Next time, the same antibiotic won't work." },
      { question: "Can you share antibiotics with a family member who has similar symptoms?", options: ["Yes, it saves money", "No, never", "Only if it's the same illness"], correctIndex: 1, explanation: "Never share antibiotics. Different infections need different medicines. The wrong antibiotic can be dangerous and won't help." },
      { question: "What happens if you take antibiotics too often?", options: ["Nothing bad", "Your body becomes immune to illness", "Bacteria become resistant and harder to kill"], correctIndex: 2, explanation: "Antibiotic resistance is a global crisis. When bacteria become resistant, simple infections can become deadly. Only take antibiotics when a doctor prescribes them." },
    ],
  },
  {
    id: "vaccines",
    title: "Vaccines",
    emoji: "💉",
    description: "Separate facts from myths",
    gradient: "from-emerald-500 to-green-600",
    questions: [
      { question: "Do vaccines cause autism?", options: ["Yes", "No", "We don't know"], correctIndex: 1, explanation: "NO. This myth started from a fraudulent study that was retracted. The doctor who published it lost his medical license. Dozens of studies with millions of children prove vaccines do NOT cause autism." },
      { question: "Is it safe to give a baby multiple vaccines at once?", options: ["No, it's too much", "Yes, it's safe and tested", "Only one at a time"], correctIndex: 1, explanation: "Babies' immune systems handle thousands of germs every day. Combination vaccines are thoroughly tested and safe. Delaying vaccines leaves your child unprotected." },
      { question: "My child has a mild cold. Can they still get vaccinated?", options: ["No, wait until fully healthy", "Yes, a mild cold is fine", "Only with doctor permission"], correctIndex: 1, explanation: "A mild cold, low fever, or runny nose is NOT a reason to delay vaccination. Only severe illness requires postponement. Ask your doctor if unsure." },
      { question: "Do vaccines contain dangerous chemicals?", options: ["Yes, they're full of toxins", "No, all ingredients are safe in the tiny amounts used", "Some do, some don't"], correctIndex: 1, explanation: "Vaccine ingredients are present in tiny, safe amounts. You get more aluminum from breast milk than from a vaccine. Every ingredient has been tested for safety." },
    ],
  },
  {
    id: "diabetes",
    title: "Diabetes",
    emoji: "🩸",
    description: "Understanding diabetes management",
    gradient: "from-amber-500 to-orange-600",
    questions: [
      { question: "Is diabetes caused by eating too much sugar?", options: ["Yes", "No, it's more complex", "Only Type 2"], correctIndex: 1, explanation: "Diabetes is caused by genetics, lifestyle, and how your body processes insulin. Eating sugar doesn't directly cause it, but an unhealthy diet and obesity increase risk." },
      { question: "Can diabetes be cured with natural remedies like cinnamon?", options: ["Yes, cinnamon cures it", "No, there is no cure but it can be managed", "Yes, with enough garlic and herbs"], correctIndex: 1, explanation: "There is NO cure for diabetes. It can be MANAGED with medicine, healthy food, and exercise. Cinnamon may have tiny benefits but CANNOT replace medication. People who stop their medicine end up in hospital." },
      { question: "A diabetic person feels dizzy and sweaty. What should you do?", options: ["Give them insulin", "Give them something sweet immediately", "Tell them to rest"], correctIndex: 1, explanation: "These are signs of LOW blood sugar (hypoglycemia). Give them juice, candy, or sugar water immediately. This can be life-threatening. After they feel better, they should eat a proper meal." },
      { question: "How often should a diabetic person check their feet?", options: ["Never, feet are fine", "Every day", "Once a year"], correctIndex: 1, explanation: "Diabetes can damage nerves in your feet. You might not feel cuts or sores. Check your feet EVERY DAY for cuts, blisters, or color changes. Small wounds can become serious infections." },
    ],
  },
  {
    id: "hygiene",
    title: "Hygiene & Prevention",
    emoji: "🧼",
    description: "Basic health habits that save lives",
    gradient: "from-cyan-500 to-blue-600",
    questions: [
      { question: "How long should you wash your hands with soap?", options: ["5 seconds", "At least 20 seconds", "1 minute"], correctIndex: 1, explanation: "Wash for at least 20 seconds — about the time it takes to sing 'Happy Birthday' twice. This removes most germs. Quick rinses don't work." },
      { question: "Is it safe to drink water from a river or stream?", options: ["Yes, natural water is clean", "No, always boil or filter it first", "Only if it looks clear"], correctIndex: 1, explanation: "Even clear water can contain dangerous bacteria and parasites. Always boil water for at least 1 minute or use a filter. Dirty water causes diarrhea, cholera, and typhoid." },
      { question: "Your child has diarrhea. What's the most important thing?", options: ["Stop all food", "Give lots of fluids (water, ORS)", "Give antibiotics"], correctIndex: 1, explanation: "Dehydration from diarrhea kills more children than the diarrhea itself. Give oral rehydration solution (ORS) or clean water with a pinch of salt and sugar. Keep breastfeeding babies." },
      { question: "When should you wash your hands?", options: ["Only before eating", "Before eating, after toilet, after touching animals, after coughing", "Only when they look dirty"], correctIndex: 1, explanation: "Germs are invisible. Wash hands: before eating/cooking, after using the toilet, after changing diapers, after touching animals, after coughing/sneezing, and after touching sick people." },
    ],
  },
];
