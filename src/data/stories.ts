export type Story = {
  id: string;
  name: string;
  age: number;
  country: string;
  flag: string;
  avatar: string;
  title: string;
  story: string;
  lesson: string;
  category: "vaccines" | "chronic" | "maternal" | "discrimination" | "prevention" | "mental";
};

export const STORIES: Story[] = [
  {
    id: "maria-vaccines",
    name: "Maria",
    age: 28,
    country: "Romania",
    flag: "🇷🇴",
    avatar: "👩",
    title: "I almost didn't vaccinate my daughter",
    story: "My mother-in-law told me vaccines are poison. Everyone in the settlement said the same thing. When my daughter was born, I was scared. But the health mediator came to our home and explained everything — how vaccines work, what the side effects really are. She showed me photos of children with measles. I was more scared of the disease than the vaccine. My daughter got all her vaccines. She is healthy and strong.",
    lesson: "Talk to a health mediator or doctor before making decisions based on what others say. Vaccines save lives.",
    category: "vaccines",
  },
  {
    id: "stefan-diabetes",
    name: "Stefan",
    age: 52,
    country: "Bulgaria",
    flag: "🇧🇬",
    avatar: "👨",
    title: "I stopped my diabetes medicine and almost died",
    story: "I was diagnosed with Type 2 diabetes at 45. The medicine made my stomach hurt, so I stopped taking it. My neighbor said cinnamon tea would cure me. For 2 years I drank cinnamon tea instead. Then one day I collapsed. My blood sugar was over 500. The doctors said my kidneys were damaged. Now I take my medicine every day. I wish I had never stopped.",
    lesson: "Never stop your medicine without talking to your doctor. Natural remedies cannot replace diabetes medication.",
    category: "chronic",
  },
  {
    id: "elena-pregnancy",
    name: "Elena",
    age: 22,
    country: "Serbia",
    flag: "🇷🇸",
    avatar: "🤰",
    title: "My first pregnancy — I didn't know I could see a doctor for free",
    story: "When I got pregnant at 19, I didn't go to a doctor for 6 months. I didn't have insurance and I thought it would cost too much. A health mediator told me that prenatal care is free for all pregnant women in Serbia. She helped me register. The doctor found that I had anemia and high blood pressure. If I hadn't gone, my baby could have been in danger.",
    lesson: "Prenatal care is free in most European countries. Ask a health mediator to help you register.",
    category: "maternal",
  },
  {
    id: "janos-discrimination",
    name: "János",
    age: 35,
    country: "Hungary",
    flag: "🇭🇺",
    avatar: "👨",
    title: "The hospital tried to send me away",
    story: "I went to the emergency room with chest pain. The nurse looked at me and said 'We're full, go to another hospital.' I knew this wasn't right. I said: 'I have chest pain. You must examine me. Please give me your name.' Her attitude changed immediately. They examined me and found I had a heart problem that needed treatment. If I had left, I could have had a heart attack.",
    lesson: "You have the right to emergency treatment. If someone tries to turn you away, ask for their name and say you know your rights.",
    category: "discrimination",
  },
  {
    id: "ana-tb",
    name: "Ana",
    age: 31,
    country: "Slovakia",
    flag: "🇸🇰",
    avatar: "👩",
    title: "TB is not a death sentence — but you must finish the medicine",
    story: "I was coughing for months. I thought it was just a cold. When I finally went to the doctor, they said I had tuberculosis. I was terrified — I thought I would die. But the doctor explained that TB can be cured with 6 months of medicine. The hardest part was taking pills every day for 6 months, even when I felt better after 2 months. But I finished. I am cured.",
    lesson: "If you cough for more than 2 weeks, see a doctor. TB is curable, but you MUST finish all the medicine.",
    category: "prevention",
  },
  {
    id: "mirela-depression",
    name: "Mirela",
    age: 40,
    country: "North Macedonia",
    flag: "🇲🇰",
    avatar: "👩",
    title: "Depression is not weakness — it's an illness",
    story: "After my husband died, I couldn't get out of bed for months. My family said I was lazy. They said 'just be strong.' But I couldn't. A health mediator noticed something was wrong and took me to a doctor. The doctor said I had depression — a real medical condition. I started medicine and talking to a counselor. Slowly, I got better. I am not weak. I was sick.",
    lesson: "Depression is a medical condition, not a character flaw. Medicine and counseling can help. Please ask for help.",
    category: "mental",
  },
];

export const CATEGORY_CONFIG = {
  vaccines: { label: "Vaccines", color: "#10B981", emoji: "💉" },
  chronic: { label: "Chronic Disease", color: "#F59E0B", emoji: "💊" },
  maternal: { label: "Pregnancy", color: "#EC4899", emoji: "🤰" },
  discrimination: { label: "Rights", color: "#8B5CF6", emoji: "⚖️" },
  prevention: { label: "Prevention", color: "#3B82F6", emoji: "🛡️" },
  mental: { label: "Mental Health", color: "#06B6D4", emoji: "🧠" },
};
