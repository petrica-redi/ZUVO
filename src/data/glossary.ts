export type GlossaryEntry = {
  term: string;
  simple: string;
  category: "condition" | "medication" | "procedure" | "body" | "test";
  emoji: string;
};

export const GLOSSARY: GlossaryEntry[] = [
  // Conditions
  { term: "Hypertension", simple: "High blood pressure. Your blood pushes too hard against your blood vessels. Can cause heart attack or stroke if not treated. Take your medicine every day.", category: "condition", emoji: "💓" },
  { term: "Diabetes (Type 2)", simple: "Your body can't use sugar properly. Sugar builds up in your blood and damages your organs. You need medicine, healthy food, and exercise. It is NOT caused by eating too much sugar.", category: "condition", emoji: "🩸" },
  { term: "Anemia", simple: "Not enough healthy red blood cells. You feel tired, weak, dizzy. Often caused by not eating enough iron (meat, beans, spinach). Very common in pregnant women.", category: "condition", emoji: "😴" },
  { term: "Asthma", simple: "Your airways get narrow and swollen, making it hard to breathe. You may wheeze or cough. Use your inhaler when it happens. Avoid smoke and dust.", category: "condition", emoji: "🫁" },
  { term: "Tuberculosis (TB)", simple: "A serious infection in your lungs. You cough for weeks, lose weight, sweat at night. It spreads through the air. It CAN be cured with 6 months of medicine — but you must finish ALL the pills.", category: "condition", emoji: "🦠" },
  { term: "Depression", simple: "A medical condition where you feel sad, hopeless, or empty for weeks. It is NOT weakness. It is NOT your fault. Medicine and talking to someone can help. Please ask for help.", category: "condition", emoji: "🧠" },
  { term: "Hepatitis B/C", simple: "A virus that attacks your liver. You may not feel sick for years, but it damages your liver slowly. It spreads through blood and needles. There is a vaccine for Hepatitis B.", category: "condition", emoji: "🟡" },
  { term: "Pneumonia", simple: "A serious infection in your lungs. You have fever, cough with mucus, and trouble breathing. You need antibiotics from a doctor. Can be dangerous for babies and old people.", category: "condition", emoji: "🤒" },
  { term: "Gastritis", simple: "Your stomach lining is irritated or inflamed. You feel burning pain, nausea, or bloating. Avoid spicy food, alcohol, and smoking. Medicine can help.", category: "condition", emoji: "🤢" },
  { term: "Eczema", simple: "Itchy, red, dry patches on your skin. It is NOT contagious. Use moisturizer often. Avoid harsh soaps. A doctor can give you cream to help.", category: "condition", emoji: "🧴" },

  // Medications
  { term: "Antibiotic", simple: "Medicine that kills bacteria (germs). It does NOT work against viruses like the flu or cold. You MUST finish the full course even if you feel better, or the germs come back stronger.", category: "medication", emoji: "💊" },
  { term: "Ibuprofen", simple: "A painkiller that also reduces swelling and fever. Take with food to protect your stomach. Do not take more than the box says. Not safe during pregnancy.", category: "medication", emoji: "💊" },
  { term: "Paracetamol", simple: "A common painkiller for headaches and fever. Safe for most people, including pregnant women. Do NOT take more than 4 grams (8 tablets) per day — too much damages your liver.", category: "medication", emoji: "💊" },
  { term: "Insulin", simple: "A hormone your body needs to use sugar. People with diabetes may need insulin injections. It is NOT a sign that your diabetes is worse — it's just a different treatment.", category: "medication", emoji: "💉" },
  { term: "Metformin", simple: "The most common diabetes medicine. Helps your body use sugar better. Take with food. May cause stomach upset at first — this usually goes away.", category: "medication", emoji: "💊" },

  // Procedures
  { term: "Blood test", simple: "A small needle takes a little blood from your arm. It helps the doctor check for infections, anemia, diabetes, and many other things. It hurts for just a second.", category: "test", emoji: "🩸" },
  { term: "X-ray", simple: "A picture of your bones and lungs using special light. You stand still for a few seconds. It does NOT hurt. Safe for most people, but tell the doctor if you are pregnant.", category: "test", emoji: "📷" },
  { term: "Ultrasound", simple: "A picture of inside your body using sound waves. The doctor puts gel on your skin and moves a device over it. It does NOT hurt. Used to check babies during pregnancy.", category: "test", emoji: "🔊" },
  { term: "ECG / EKG", simple: "A test that checks your heart rhythm. Small stickers are placed on your chest. It does NOT hurt. Takes about 5 minutes. Shows if your heart is beating normally.", category: "test", emoji: "❤️" },
  { term: "Vaccination", simple: "A small injection that teaches your body to fight a disease BEFORE you get sick. Like training for your immune system. Side effects (sore arm, mild fever) are NORMAL and mean it's working.", category: "procedure", emoji: "💉" },

  // Body
  { term: "Blood pressure", simple: "The force of blood pushing against your blood vessel walls. Normal is around 120/80. High blood pressure (over 140/90) is dangerous because you can't feel it, but it damages your heart and brain.", category: "body", emoji: "🫀" },
  { term: "Blood sugar", simple: "The amount of sugar (glucose) in your blood. Normal fasting level is 70-100 mg/dL. Too high means diabetes. Too low makes you dizzy and shaky. Test it regularly if you have diabetes.", category: "body", emoji: "📊" },
  { term: "BMI", simple: "Body Mass Index — a number that shows if your weight is healthy for your height. Under 18.5 is underweight. 18.5-25 is normal. Over 25 is overweight. Over 30 is obese.", category: "body", emoji: "⚖️" },
  { term: "Immune system", simple: "Your body's army against germs. White blood cells fight infections. Vaccines train your immune system. Good food, sleep, and exercise make it stronger.", category: "body", emoji: "🛡️" },
];

export const CATEGORY_CONFIG = {
  condition: { label: "Conditions", color: "#EF4444", bg: "bg-red-50", border: "border-red-100" },
  medication: { label: "Medications", color: "#3B82F6", bg: "bg-blue-50", border: "border-blue-100" },
  procedure: { label: "Procedures", color: "#8B5CF6", bg: "bg-purple-50", border: "border-purple-100" },
  body: { label: "Body & Health", color: "#10B981", bg: "bg-emerald-50", border: "border-emerald-100" },
  test: { label: "Tests", color: "#F59E0B", bg: "bg-amber-50", border: "border-amber-100" },
};
