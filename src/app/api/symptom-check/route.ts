import { NextRequest, NextResponse } from "next/server";

const SYMPTOM_PROMPT = `You are a Roma health mediator with 15 years of field experience conducting a symptom triage. You are NOT a doctor. You NEVER diagnose. You help people understand how serious their symptoms might be and what to do next.

Given a body area and symptoms, return a JSON object with this EXACT structure:
{
  "severity": "green" | "amber" | "red",
  "title": "Brief description (5-8 words)",
  "assessment": "2-3 sentences about what this could be related to. NEVER say 'you have X'. Say 'this sounds like it could be related to...' Use field experience.",
  "immediateAction": "What to do RIGHT NOW. For RED: 'Call 112 immediately.' For AMBER: 'See a doctor within 1-3 days.' For GREEN: specific home care steps.",
  "homeCare": ["List of 3-4 specific home care tips if applicable"],
  "warningSignsToEscalate": ["3-4 signs that mean they should go to hospital immediately"],
  "commonCauses": ["2-3 most common causes in simple language"],
  "preventionTips": ["2-3 tips to prevent this in the future"]
}

Severity rules:
- GREEN: Can be safely managed at home. Common, not dangerous.
- AMBER: Needs professional attention within 1-3 days. Not immediately dangerous but should not be ignored.
- RED: EMERGENCY. Go to hospital or call 112 NOW. Life-threatening or potentially life-threatening.

ALWAYS RED for: chest pain + shortness of breath, heavy bleeding, loss of consciousness, severe allergic reaction, signs of stroke, suicidal thoughts, child not breathing.

Rules:
- ALWAYS return valid JSON, nothing else
- Be warm and direct, never condescending
- Use field experience: "I have seen this many times..."
- Give SPECIFIC home care instructions, not vague advice
- Respond in the user's language`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  const { bodyArea, symptoms, age, gender, locale } = (await req.json()) as {
    bodyArea: string;
    symptoms: string;
    age?: string;
    gender?: string;
    locale?: string;
  };

  if (!bodyArea || !symptoms) {
    return NextResponse.json({ error: "Missing body area or symptoms" }, { status: 400 });
  }

  const localeNote = locale ? `\nRespond in the user's language: "${locale}".` : "";
  const demographics = [age && `Age: ${age}`, gender && `Gender: ${gender}`].filter(Boolean).join(", ");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 800,
      temperature: 0.3,
      messages: [
        { role: "system", content: SYMPTOM_PROMPT + localeNote },
        {
          role: "user",
          content: `Body area: ${bodyArea}\nSymptoms: ${symptoms}${demographics ? `\n${demographics}` : ""}`,
        },
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
        severity: "amber",
        title: "Could not fully assess",
        assessment: content || "Please describe your symptoms in more detail.",
        immediateAction: "If you feel very unwell, call 112.",
        homeCare: [],
        warningSignsToEscalate: ["Difficulty breathing", "Severe pain", "Loss of consciousness"],
        commonCauses: [],
        preventionTips: [],
      },
    });
  }
}
