# Safeguarding Policy

**Version:** 1.0  
**Effective date:** 2026-06-07  
**Owner:** Safeguarding lead / clinical governance lead  
**Review cadence:** Every 12 months  
**Next review due:** 2027-06-07

---

## Purpose

Redi Health serves communities that include children, young people, pregnant people, people experiencing domestic violence and coercion, people in mental health crisis, people with concerns about sexual health, and people who have experienced discrimination. This policy defines how the platform identifies, responds to, and refers users in vulnerable situations — and how content is designed to protect rather than expose them to further harm.

---

## 1. Scope

This policy applies to:

- All AI-generated responses (Chat, Consult, Symptoms, Explain)
- Student Health Academy content (users presumed to be 14+)
- Learn pillar content (all users)
- Mediator dashboard features
- Family hub features
- Rights and Navigate tools

---

## 2. Youth safeguarding (under 18)

### 2.1 Platform positioning

The Student Health Academy is designed for high-school audiences (14+). The general platform does not have an age restriction but is designed for adult users. We do not actively collect age from users.

### 2.2 Content appropriateness

| Content area | Under 14 | 14–17 | 18+ |
|-------------|----------|-------|-----|
| First aid, basic health | Appropriate | Appropriate | Appropriate |
| Vaccine education | Appropriate | Appropriate | Appropriate |
| Sexual health (general awareness) | Not in platform | Appropriate with referrals | Appropriate |
| STI detail, testing guidance | Not in platform | Appropriate with clinical referral | Appropriate |
| Consent education | Not in platform | Appropriate | Appropriate |
| Contraception | Not in platform | Signpost to clinic only | Appropriate |
| Pregnancy | Not in platform | Emergency/crisis signpost only | Full content |
| Mental health (general) | Appropriate | Appropriate | Appropriate |
| Self-harm / suicidal ideation | Crisis line only | Crisis line + support | Crisis line + support |
| Domestic/partner violence | Not in platform | Safety plan + helpline | Safety plan + helpline |

### 2.3 Youth-specific referral language

All Student Academy modules covering sensitive topics must include a footer from `src/components/StudentAcademyLessonFooter.tsx` that:

- Names local clinics, school nurses, or youth helplines as the primary referral.
- Never instructs young people to self-manage a clinical concern.
- Uses language that does not shame or blame.

### 2.4 Sexual health modules — pre-conditions

Sexual health modules (`stiBasics`, `stiTesting`, `stiMyths`, `consentBasics`) require:

- Tier 2 clinical review (see `docs/CONTENT_REVIEW.md`).
- Country-specific legal review: some EU member states have restrictions on minor access to sexual health services.
- A `safeguardingNote` field in the module definition confirming these reviews are complete.

### 2.5 Mandatory youth data protections

- We do not collect age unless a user voluntarily enters it.
- AI routes must not ask a user to confirm they are a minor.
- If a user's message context suggests they are under 14 (e.g. references to primary school, age under 14), the AI must respond with age-appropriate content only and direct all clinical concerns to a parent/guardian or trusted adult.
- Mediator visit logs must not record a young person's health data without explicit caregiver knowledge (see `docs/MEDIATOR_POLICY.md`).

---

## 3. Pregnancy safeguarding

### 3.1 High-risk flag triggers

The following descriptions must trigger the `pregnancy_bleeding` deterministic red flag (see `docs/CLINICAL_SAFETY.md` section 4.1):

- "bleeding during pregnancy"
- "heavy bleeding and pregnant"
- "bleeding a lot pregnant"

The response must instruct the user to go to hospital immediately and call 112.

### 3.2 AI response boundaries for pregnancy

The AI **must not**:

- Recommend medication to a person who identifies as pregnant.
- Advise on managing pregnancy complications at home.
- Dismiss or downplay any pregnancy concern.

The AI **must**:

- Refer all clinical pregnancy concerns to a midwife, obstetrician, or emergency services.
- Acknowledge the user's rights to respectful maternity care.
- Reference discrimination-specific guidance if the user raises concerns about hospital treatment.

### 3.3 Prenatal content review

All maternal health module content must be reviewed by a midwife or obstetrician with clinical practice in the target regions. Review cadence: 12 months.

---

## 4. Abuse and coercion

### 4.1 Domestic violence and partner abuse

When a user describes physical harm, fear of a partner, controlling behaviour, or family-based coercion:

1. The AI must acknowledge the disclosure without minimising it.
2. The AI must not advise reconciliation or suggest the user is responsible.
3. The AI must provide a safety-first response:
   - Immediate safety check: "Are you safe right now?"
   - If not safe: direct to 112 and local domestic violence helpline.
   - If safe: provide the national domestic violence helpline for their country, advise on safety planning.

Country-specific domestic violence helplines are maintained in `src/data/regions.ts` under `dvHelpline`.

4. The `abuse_danger` deterministic flag (see `docs/CLINICAL_SAFETY.md` section 4.1) must intercept descriptions of active physical danger.

### 4.2 Traditional practices and coercion

Some Roma community health concerns involve traditional practices, early marriage, or family-based coercion around healthcare decisions (e.g. vaccine refusal on behalf of children, coerced or denied contraception). The AI must:

- Never shame or stigmatise the community.
- Distinguish between individual rights and family/community pressure.
- Refer to patient rights information (the Rights tool) where relevant.
- Never give advice that could increase the user's safety risk within their family or community.

### 4.3 Child protection disclosures

If a user (adult or young person) describes harm to a child — abuse, neglect, forced marriage, or trafficking — the AI must:

1. Take the disclosure seriously without interrogating the user.
2. Provide the child protection hotline for the user's country.
3. State clearly that the user can also contact 112 for immediate danger.
4. Not record or retain the content of the disclosure beyond the request lifecycle.

---

## 5. Self-harm and suicidal ideation

### 5.1 Deterministic flag

The `suicide` red flag in `src/lib/health/red-flags.ts` must intercept: "kill myself," "suicide," "want to die," "end my life," "hurt myself," "self-harm." This bypasses the AI entirely and returns:

- A warm, non-judgmental acknowledgement.
- A directive to call 112 or a crisis line.
- An instruction to stay with a trusted person.

### 5.2 AI response to self-harm disclosures

When the AI receives a message about self-harm not caught by the deterministic flag (e.g. past self-harm, concerns about someone else):

- Respond with empathy and without clinical detachment.
- Do not provide information about methods.
- Do not minimise or normalise self-harm.
- Always provide a crisis line reference.
- If the disclosure concerns a young person, add a prompt to involve a trusted adult or school counsellor.

### 5.3 Crisis line references

Crisis lines are maintained in `src/data/regions.ts` under `crisisLine`. Where a country-specific line is not available, the default is **116 123** (European helplines network) and **112**.

### 5.4 Repeated distress signals

The platform does not currently have session memory across visits. If session memory is implemented in future, the following rule applies: three or more distress signals in one session must trigger a proactive referral to a crisis line, regardless of whether the user asked for one.

---

## 6. Sexual health safeguarding

### 6.1 Content boundaries

Sexual health content is present in the Student Academy and may arise in Chat. The boundaries are:

- Provide factual, evidence-based information about STIs, testing, and prevention.
- Do not describe sexual acts beyond what is necessary for clinical understanding.
- Always include a referral to a clinic or sexual health service for any user who describes symptoms or requests a test.
- For contraception: provide factual information, always direct to a healthcare provider for prescriptions.

### 6.2 Non-consensual situations

If a user describes sexual assault or rape:

1. Prioritise safety: is the user safe now?
2. Provide emergency services number (112).
3. Provide the sexual assault helpline for the user's country.
4. Mention: "If you choose to, you can have a medical examination that preserves evidence. You do not have to decide about reporting right now."
5. Do not interrogate about the event.
6. Do not suggest the user is responsible in any way.

### 6.3 Roma-specific context

Roma communities may face particular barriers to sexual health services including language, documentation requirements, stigma, and discrimination. The AI must:

- Acknowledge these barriers where relevant.
- Reference the Rights tool for guidance on non-discrimination in healthcare.
- Suggest culturally safe referral options where known (e.g. Roma-friendly clinics from the Providers tool).

---

## 7. Discrimination safeguarding

### 7.1 Recognising discrimination disclosures

When a user describes being refused treatment, being treated rudely or dismissively by healthcare staff, or being treated differently because of their ethnicity, the AI must:

1. Validate the experience: "What you describe sounds like discrimination. You should not have been treated this way."
2. Provide practical next steps:
   - The right to make a formal complaint (rights tool).
   - The national patients' rights ombudsman or complaints body.
   - NGO support contacts (ERRC, Romani CRISS, or equivalent) for the user's country.
3. Never suggest the user misunderstood or may have misinterpreted the situation.

### 7.2 Discrimination content in Rights tool

The Rights tool must include:

- A "Discrimination in healthcare" section for each supported country.
- The formal complaints pathway.
- An NGO or advocacy contact.
- Language the user can use when speaking to a patient advocate.

This content must be reviewed by a Roma rights organisation (Tier 4 source) at least every 24 months.

---

## 8. Safeguarding incident process

| Situation | Immediate action | Escalation |
|-----------|-----------------|------------|
| User describes being in immediate danger (violence, self-harm) | AI redirects to 112; log `safety.red_flag_triggered` | Engineering on-call reviews within 24 hours |
| User discloses child harm | AI provides helpline; no data retained | Clinical governance lead informed within 24 hours |
| Content is found to be potentially harmful to a vulnerable group | Pull module; open SEV-2 | Clinical governance lead and DPO within 24 hours |
| Mediator visit reveals safeguarding concern in the field | Mediator follows referral pathway in `docs/MEDIATOR_POLICY.md` | Escalate to regional health authority if child/immediate harm |

---

## 9. "I need help now" UI element

Every AI chat page and every triage result page must include a visible, accessible link or button labelled "I need help now" or equivalent that:

- Opens a modal or panel with:
  - Local emergency number (112 as default).
  - Crisis line for the user's country.
  - Domestic violence helpline for the user's country.
- Is visible without scrolling on mobile viewports.
- Is styled to be prominent but not alarming.

Implementation: `src/components/SosButton.tsx` currently serves this function. It must be verified to be present on all AI-feature pages.
