import { NextRequest, NextResponse } from "next/server";
import { openaiChatCompletion } from "@/lib/openai";

const VISIT_CARD_PROMPT = `You are a Roma health mediator helping someone prepare for a doctor visit. Generate a clear, professional patient summary card that the person can show to their doctor.

Given the patient's concern, symptoms, and language, return a JSON object:
{
  "patientSummary": "A 4-6 sentence summary of the patient's concern written in clear, medical-friendly language. Include: main complaint, duration, severity, relevant context. Written so a doctor can quickly understand the situation.",
  "keySymptoms": ["List of 3-5 key symptoms in medical-friendly terms"],
  "duration": "How long the problem has been going on",
  "severity": "mild | moderate | severe",
  "questionsToAsk": ["3-4 important questions the patient should ask the doctor"],
  "whatToBring": ["List of things to bring to the appointment"],
  "patientRights": ["2-3 key patient rights relevant to Roma communities (right to interpreter, right to refuse, right to second opinion)"]
}

Rules:
- Write the patientSummary in the NATIONAL LANGUAGE of the country (the language doctors speak), not necessarily the patient's language
- Write questionsToAsk and patientRights in the PATIENT'S language so they can understand
- Be professional but accessible
- ALWAYS return valid JSON`;

export async function POST(req: NextRequest) {
  const { concern, symptoms, country, locale } = (await req.json()) as {
    concern: string;
    symptoms?: string;
    country?: string;
    locale?: string;
  };

  if (!concern?.trim()) {
    return NextResponse.json({ error: "No concern provided" }, { status: 400 });
  }

  const context = [
    `Patient concern: ${concern}`,
    symptoms && `Additional symptoms: ${symptoms}`,
    country && `Country: ${country}`,
    locale && `Patient's language: ${locale}`,
  ].filter(Boolean).join("\n");

  const response = await openaiChatCompletion(
    {
      max_tokens: 800,
      temperature: 0.3,
      messages: [
        { role: "system", content: VISIT_CARD_PROMPT },
        { role: "user", content: context },
      ],
    },
    "visit.card",
    { locale, country },
  );

  if (response.status === 503) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }
  if (!response.ok) {
    return NextResponse.json({ error: "AI service error" }, { status: 502 });
  }

  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({
      success: true,
      data: {
        patientSummary: content,
        keySymptoms: [],
        duration: "Unknown",
        severity: "moderate",
        questionsToAsk: ["Can you explain my diagnosis in simple words?"],
        whatToBring: ["ID card", "Health insurance card", "List of current medications"],
        patientRights: ["You have the right to an interpreter", "You have the right to understand your treatment"],
      },
    });
  }
}
