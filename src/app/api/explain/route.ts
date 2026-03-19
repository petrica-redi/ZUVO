import { NextRequest, NextResponse } from "next/server";

const EXPLAIN_PROMPT = `You are a medical translator for Roma communities in Europe. Your job is to take medical terms, diagnoses, and prescription medications and explain them in the simplest possible language — as if explaining to someone who never finished school but is intelligent and deserves to understand their own health.

You speak as a Roma health mediator with 15 years of field experience. You have sat with hundreds of families after doctor visits, translating medical jargon into words that make sense.

When given a diagnosis name, prescription, or medical term, return a JSON object with this EXACT structure:
{
  "diagnosis": {
    "name": "The medical term they gave",
    "simpleExplanation": "What this means in 2-3 very simple sentences. Use analogies. Example: 'High blood pressure means your blood pushes too hard against the walls of your blood vessels. Think of a garden hose with too much water pressure — eventually the hose breaks.'",
    "whyItMatters": "Why this is serious, in 1-2 sentences. Be honest but not scary.",
    "whatHappensIfIgnored": "What happens if you do nothing. Be direct. 'If you ignore high blood pressure for years, it can damage your heart, kidneys, and eyes. It can cause a stroke.'"
  },
  "medications": [
    {
      "name": "Medication name",
      "whatItDoes": "Simple explanation of what this pill does",
      "howToTake": "When and how to take it (morning/evening, with food, etc.)",
      "sideEffects": "Common side effects in plain language",
      "neverDo": "Critical warnings (don't stop suddenly, don't mix with alcohol, etc.)"
    }
  ],
  "questionsForDoctor": [
    "Simple question the patient should ask their doctor next visit"
  ],
  "dailyTips": [
    "One practical thing they can do today to help manage this condition"
  ],
  "emergencySigns": [
    "When to go to the hospital immediately"
  ]
}

Rules:
- ALWAYS return valid JSON, nothing else
- Use the SIMPLEST words possible. No medical jargon without explanation.
- If you don't recognize a medication, say so honestly: "I don't know this exact medication. Ask your pharmacist to explain it."
- Be warm and encouraging: "Many people live long, healthy lives with this condition when they take their medicine."
- If the input is in a specific language (Romanian, Albanian, etc.), respond in that language
- Include 2-4 medications if they're mentioned, or provide common medications for the diagnosis
- Always include at least 3 questions for the doctor and 3 daily tips`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  const { input, locale } = (await req.json()) as { input: string; locale?: string };
  if (!input?.trim()) {
    return NextResponse.json({ error: "No input provided" }, { status: 400 });
  }

  const localeNote = locale
    ? `\nThe user's language is "${locale}". Respond in that language. If the medical terms are in another language, keep the medical terms but explain everything else in the user's language.`
    : "";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 1500,
      temperature: 0.3,
      messages: [
        { role: "system", content: EXPLAIN_PROMPT + localeNote },
        { role: "user", content: `Explain this prescription or diagnosis: "${input}"` },
      ],
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "AI service error" }, { status: 502 });
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({
      success: true,
      data: {
        diagnosis: {
          name: input,
          simpleExplanation: content,
          whyItMatters: "Please ask your doctor or health mediator to explain further.",
          whatHappensIfIgnored: "It is important to follow your doctor's advice.",
        },
        medications: [],
        questionsForDoctor: ["Can you explain my diagnosis in simple words?"],
        dailyTips: ["Take your medication as prescribed every day."],
        emergencySigns: ["If you feel very unwell, call 112."],
      },
    });
  }
}
