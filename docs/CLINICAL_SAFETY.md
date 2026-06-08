# Clinical Safety and Escalation Framework

**Version:** 1.0  
**Effective date:** 2026-06-07  
**Owner:** Clinical governance lead  
**Review cadence:** Every 12 months, or sooner if national guidelines change  
**Next review due:** 2027-06-07

---

## Purpose

This framework defines the boundaries within which Redi Health's AI advisor (Zuvo) and all structured health tools (Symptoms, Consult, Explain, Navigate, Scan) may operate. It sets mandatory output categories, escalation triggers, clinical governance obligations, and the mechanism for logging and reviewing safety events.

Every feature that touches health guidance — whether AI-generated or static — must comply with this framework. Any change to clinical logic, red-flag patterns, system prompts, or health education copy requires a review step defined here before it ships.

---

## 1. Scope

This framework applies to:

| Feature | Risk tier |
|---------|-----------|
| Chat (AI advisor) | High |
| Symptom Checker (body-map triage) | High |
| Consult (structured AI consultation) | High |
| Explain (prescription/diagnosis explainer) | High |
| Navigate (care navigation wizard) | High |
| Scan (misinformation checker) | High |
| Vaccines page | Medium |
| Learn / Student Academy health modules | Medium |
| Glossary | Low |
| Stories, Rights, Regions | Low |

---

## 2. Absolute clinical boundaries

### 2.1 Diagnosis

Redi Health tools **must never**:

- State that a user has a specific medical condition.
- Produce output that a reasonable user would understand as a diagnosis.
- Use language such as "you have," "this is," "you are suffering from" followed by a medical condition name.

Permitted framing:

> "Based on what you describe, this could be a sign of X. A doctor needs to examine you to know for certain."

> "I cannot diagnose from here. What you're describing sounds like it needs to be checked by a clinician."

### 2.2 Medication

Redi Health tools **must never**:

- Prescribe medication, including over-the-counter medication.
- Recommend a specific dose, frequency, or duration of any medication.
- Suggest stopping, reducing, or switching a prescribed medication.
- Recommend combining medications.
- Advise on medication use during pregnancy or for children under 12 without an explicit doctor referral instruction.

Permitted framing:

> "I can explain what this medication does, but only your doctor or pharmacist can tell you the exact dose."

> "Never change or stop taking a prescribed medicine without speaking to the clinician who prescribed it."

> "If you are pregnant, always check with your midwife or obstetrician before taking any medicine, including ones bought without a prescription."

### 2.3 False reassurance

Redi Health tools **must never**:

- Produce output that could cause a user to delay seeking urgent care.
- Label a symptom cluster "safe" or "not serious" without advising a follow-up care pathway.
- Use "green" or "low risk" outcomes without explicit caveats directing users toward self-monitoring or care-seeking if symptoms persist or worsen.

Every "self-care" recommendation must include a watchlist of signs that require escalation.

---

## 3. Output severity categories

All triage outputs (Symptoms, Consult) must resolve to exactly one of these five categories:

| Category | Meaning | Required output elements |
|----------|---------|--------------------------|
| **Red — Emergency now** | Life-threatening; act immediately | Emergency number (country-specific), single imperative instruction, no other advice |
| **Amber — Urgent care** | Needs care within hours to 24 hours | Care-seeking instruction, nearest facility type, what to say, signs to escalate to red |
| **Yellow — Routine care** | Needs care within days | When and where to seek care, what to bring, what to say |
| **Blue — Self-care with monitoring** | Manageable at home with watchlist | Specific home-care steps, clear watchlist, explicit return-to-care trigger |
| **White — Information only** | No acute concern raised | Educational content, general wellness advice, no triage output |

AI responses to chat messages do not require a formal category label but must apply the same logic when responding to symptom descriptions.

---

## 4. Emergency escalation rules

### 4.1 Deterministic bypass (code-level)

The following patterns trigger a deterministic override in `src/lib/health/red-flags.ts` **before any AI call**. No AI model decision is involved. The system returns a red-category response immediately.

| Pattern ID | Trigger examples | Emergency instruction |
|-----------|------------------|-----------------------|
| `chest_pain` | "chest pain," "tight chest," "pressure in my chest" | Call 112 now |
| `breathing` | "can't breathe," "difficulty breathing," "gasping" | Call 112 now |
| `heavy_bleeding` | "bleeding heavily," "blood is pouring," "won't stop bleeding" | Call 112 now, apply pressure |
| `stroke` | "face droop," "slurred speech," "sudden weakness one side" | Call 112 now, note time |
| `suicide` | "kill myself," "suicide," "want to die," "self-harm" | Call crisis line or 112 now, stay with person |
| `severe_allergy` | "anaphylaxis," "throat swelling," "hives and can't breathe" | Call 112 now, use epinephrine if available |
| `unconscious` | "unconscious," "not responding," "collapsed" | Call 112 now, check airway |
| `child_not_breathing` | "child not breathing," "baby turning blue" | Call 112 now |
| `pregnancy_bleeding` | "bleeding during pregnancy," "heavy bleeding pregnant" | Go to hospital immediately |
| `abuse_danger` | "he is hurting me," "I am being beaten," "I am afraid of my partner" | Safety plan, helpline |
| `poisoning` | "swallowed," "overdose," "took too many pills" | Call 112 or poison control now |

New patterns require a PR with the `clinical-safety` label and sign-off from the clinical governance lead before merge.

### 4.2 AI-level escalation

Where the deterministic bypass does not trigger, the AI system prompt instructs Zuvo to:

1. Put any emergency instruction **first** in the response, before any explanation.
2. Use imperative language: "Call 112 now." Not "You might consider calling."
3. Never say "wait and see" for any amber or red symptom cluster.

### 4.3 Country-specific emergency numbers

Emergency number personalisation is the responsibility of the Navigate and Regions features. Until country-specific numbers are implemented for all supported countries, the fallback is **112** (the EU-wide emergency number). The system prompt, red-flag responses, and all triage outputs must use 112 as the default.

Country overrides must come from `src/data/regions.ts` and must be sourced from official government publications. They must be reviewed at least annually.

---

## 5. Clinical governance model

### 5.1 Responsible roles

| Role | Responsibility |
|------|---------------|
| **Clinical governance lead** | Owns this framework; signs off on changes to red-flag patterns and system prompt |
| **Content clinical reviewer** | Reviews health education copy per `docs/CONTENT_REVIEW.md` tiers |
| **Data Protection Officer** | Signs off on any change to health data collection or AI data sharing |
| **Engineering on-call** | Responds to safety incidents per `docs/RUNBOOK.md` |

### 5.2 Change control for clinical logic

Any change to the following requires a PR with the `clinical-safety` label and explicit approval from the clinical governance lead before merge:

- `src/lib/health/red-flags.ts`
- `src/lib/ai/system-prompt.ts`
- `src/app/api/symptom-check/route.ts` (triage prompt or output mapping)
- `src/app/api/consult/route.ts` (consultation prompt)
- `src/app/api/explain/route.ts` (prescription explanation prompt)
- Any health education copy in `messages/*.json` under namespaces `learn`, `vaccines`, `studentHealth`

Changes to UI copy that does not alter clinical meaning (button labels, layout, spacing) do not require clinical sign-off.

### 5.3 Medical review protocol

All health education content (modules, vaccine pages, glossary entries tagged as clinical) must:

1. Cite at least one source from the approved source list (see `docs/SOURCE_POLICY.md`).
2. Have a `review` block with `reviewedAt`, `reviewerRole`, and `nextReviewDue`.
3. Be re-reviewed at the cadence specified by the content review tier in `docs/CONTENT_REVIEW.md`.

---

## 6. Safety event logging

### 6.1 Events to log

The following events must be logged to the `audit_log` table with `action` prefixed `safety.*`:

| Event | Action string | Required fields |
|-------|---------------|----------------|
| Red-flag deterministic trigger | `safety.red_flag_triggered` | flag ID, user locale, timestamp |
| AI route killed by budget limit | `safety.ai_paused` | route, budget threshold |
| User-reported harmful advice | `safety.user_harm_report` | route, session ref (no PII) |
| Content module pulled for clinical concern | `safety.content_pulled` | module ID, reason |
| Clinical sign-off received | `safety.content_approved` | module ID, reviewer role, date |

Logs must not contain user-identifying information (name, email, IP). They use a hashed session reference only.

### 6.2 Safety event review

The clinical governance lead must review the `safety.*` audit log monthly. Any pattern of repeated red-flag triggers on the same phrase cluster must be evaluated for addition to the deterministic bypass list.

---

## 7. Incident escalation

See `docs/RUNBOOK.md` for full incident response. Summary:

| Situation | Severity | Who acts |
|-----------|----------|---------|
| AI gives advice that could cause immediate harm | SEV-1 | Engineering on-call; disable AI route; notify clinical lead within 1 hour |
| Red-flag bypass failed to trigger on a clear emergency | SEV-1 | Add missing pattern; deploy; clinical lead reviews within 24 hours |
| Health content found to be clinically inaccurate | SEV-2 | Pull module; open content review; fix within 14 days |
| User reports adverse outcome linked to AI advice | SEV-1 | Disable route; legal notified; clinical lead and DPO within 24 hours |

---

## 8. "Do not delay care" mandate

Every response that includes any amber, yellow, or blue classification **must** include an explicit statement that the user should seek care if:

- Symptoms worsen.
- New symptoms appear.
- Any red-flag sign from the watchlist is noticed.

This is not optional. It is a mandatory output element for any non-white classification.

---

## 9. Not-a-medical-device disclaimer

Every AI-generated health response and every triage output page must display the disclaimer:

> "Redi Health is not a medical device. This information is for educational purposes only. Always follow the advice of a qualified healthcare professional."

This disclaimer must be visible without scrolling on mobile viewports. It must not be styled to minimize its visual prominence.
