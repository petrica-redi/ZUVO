# EU AI Act — Risk Classification & Controls

> Position statement for Redi Health AI features. Not legal advice; operators should
> validate against the final delegated acts for their deployment date.

## 1. AI features in scope

| Feature | Route / module | Model use |
|---|---|---|
| Health advisor chat | `/chat`, `/api/consult` | LLM streaming |
| Misinformation scanner | `/scan`, `/api/fact-check` | LLM classification |
| Symptom triage (non-emergency) | `/symptoms`, `/api/symptom-check` | LLM after deterministic red-flag gate |
| Prescription explainer | `/explain`, `/api/explain` | Vision + LLM |
| Mediator "explain to family" | `/mediator` tools | LLM plain-language rewrite |

## 2. Risk classification

### Not high-risk (intended position)

Redi Health is **not** positioned as a medical device and does **not** autonomously
diagnose, prescribe, or triage without human-readable disclaimers. Controls:

- **Deterministic emergency routing** (`src/lib/health/red-flags.ts`) runs before any
  AI call and directs users to **112** / national emergency lines.
- **No diagnosis language** in system prompts (`src/lib/ai/system-prompt.ts`).
- **Human mediator in the loop** for institutional reporting; AI assists beneficiaries
  and field workers but does not replace clinical decision-making.
- **Transparency**: AI notice on first use; source citations where applicable.

### Limited-risk transparency obligations (Art. 50)

| Obligation | Implementation |
|---|---|
| Inform users they interact with AI | First-use notice on AI routes; chat UI labels |
| Mark AI-generated content | Verdict cards and chat bubbles styled as AI-assisted |
| Deepfake / synthetic media | Not used in current product scope |

### High-risk scenarios to avoid

Do **not** deploy Redi Health as:

- An autonomous diagnostic system replacing clinician judgment
- A hiring or benefits-eligibility scoring system
- A biometric identification gate for health access

Such use cases would trigger Annex III high-risk requirements and are out of product scope.

## 3. Technical controls (already shipped)

| Control | Location |
|---|---|
| PII scrub before model egress | `src/lib/api/ai-budget.ts` |
| Prompt-injection guard | `sanitizeAiInput` |
| Per-user and org-wide budget caps | `AI_USER_DAILY_CAP`, `AI_DAILY_BUDGET_EUR` |
| Rate limiting | `src/lib/api/rate-limit.ts` + Upstash |
| Request tracing | Langfuse (EU option) |
| Content review for student modules | `docs/CONTENT_REVIEW.md` |

## 4. Human oversight

- Beneficiaries are directed to **local clinics, mediators, and emergency services**
  for definitive care.
- Mediators validate and log facilitations manually; KPIs reflect mediator attestation,
  not AI inference.
- Operators can disable AI routes via environment configuration without affecting
  offline navigator, rights, SOS, or mediator workspace.

## 5. Documentation for deployers

Deployers should retain:

- This classification memo
- Model provider data-processing agreement (OpenAI EU residency if required)
- Incident log for AI-related safety events
- Version pin of `src/lib/ai/system-prompt.ts` at deployment time

## 6. Review trigger

Re-classify when adding: autonomous triage without red-flag gate, clinical decision
support integrated into EHR workflows, or biometric processing.
