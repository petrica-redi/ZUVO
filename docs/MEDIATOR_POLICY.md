# Mediator Operating Policy

**Version:** 1.0  
**Effective date:** 2026-06-07  
**Owner:** Operational lead / clinical governance lead  
**Review cadence:** Every 12 months  
**Next review due:** 2027-06-07

---

## Purpose

Roma health mediators are a proven bridge between communities and health systems. This policy defines how Redi Health's mediator dashboard supports field work in a way that is safe, ethical, data-minimal, and accountable — while protecting both the mediators and the communities they serve.

---

## 1. Who is a mediator

For the purposes of this policy, a mediator is a person who:

- Has been issued a Redi Health mediator PIN by a programme operator (a health ministry, NGO, or Redi Health operational partner).
- Works in a field health role — whether paid or volunteer — supporting a Roma or other underserved community.
- Has acknowledged this operating policy before receiving a PIN.

Mediators are **not** clinicians unless separately qualified. Their role is:

- Health education and information.
- Facilitation and navigation (accompanying people to appointments, explaining forms).
- Referral to health services.
- Community health monitoring (aggregate-level).
- Support with vaccination campaigns.

They may **not** use the Redi Health mediator dashboard to:

- Diagnose or treat illness.
- Prescribe or recommend medication.
- Record clinical assessments beyond what is defined in section 4.

---

## 2. Access and PIN governance

### 2.1 PIN issuance

- PINs are issued only by programme operators through the admin dashboard.
- Each PIN is tied to a specific mediator identity (name, affiliation, region).
- PINs must not be shared between mediators.
- Programme operators are responsible for revoking PINs when a mediator leaves the programme.

### 2.2 PIN security

- PINs must be at least 6 digits.
- Three failed PIN attempts lock the dashboard for 30 minutes.
- PINs expire after 12 months and must be renewed by the programme operator.
- The PIN check is verified server-side (`/api/mediator/pin-check`). The PIN itself never leaves the server.

### 2.3 Local access state

The dashboard stores a local access flag (`sastipe_mediator_access`) in localStorage to avoid repeated PIN entry during a session. This flag:

- Does not grant server-side authorisation (all API calls are still auth-checked).
- Expires when the browser session ends.
- Is cleared when the mediator explicitly logs out.

### 2.4 Session duration

Server-side mediator sessions expire after 8 hours of inactivity. The mediator must re-authenticate to continue logging visits after this period.

---

## 3. Consent requirements

### 3.1 Mediator consent to this policy

Before receiving a PIN, a mediator must:

- Read and acknowledge this policy.
- Confirm they understand their role boundaries (section 1).
- Confirm they will obtain community member consent before logging personal data.
- Confirm they understand data minimisation requirements (section 4).

This acknowledgement is recorded in the `mediatorProfiles` table with the date of acknowledgement and policy version.

### 3.2 Community member consent for visit logging

Before logging a visit that records any information about a specific person:

- The mediator must explain to the community member what will be recorded.
- The community member must verbally agree to the log being created.
- For community members who cannot give informed consent (cognitive impairment, children under 14), the consent of a parent or legal guardian is required.
- Consent does not need to be digital; the mediator's attestation in the visit log is sufficient.
- A community member may ask that no record be kept, and the mediator must respect this.

### 3.3 Consent UI in the dashboard

The visit logging form must include a consent attestation checkbox:

> "I confirm that the person named (or the family member or guardian on their behalf) has agreed to this visit being recorded."

This checkbox must be checked before the form can be submitted.

---

## 4. Data minimisation

### 4.1 What may be recorded

Visit logs may record:

| Field | Purpose | Required |
|-------|---------|---------|
| Date of visit | Programme evaluation | Yes |
| First name or initials of community member | Continuity between visits | No — may use anonymous identifier |
| Type of support given (from a defined list) | Programme evaluation | Yes |
| Referral made (yes/no, and referral type) | Follow-up tracking | No |
| Follow-up needed (yes/no) | Mediator workflow | No |
| Mediator's own notes | Personal reference only | No |

### 4.2 What must NOT be recorded

Visit logs must **never** include:

- Full name and address combined (creates a trackable personal record).
- Ethnicity.
- Immigration or documentation status.
- Specific diagnosis or clinical assessment.
- Details of domestic violence, abuse, or safeguarding disclosures beyond a "referral made" flag.
- Any information that is not necessary for health continuity or programme evaluation.

### 4.3 Type of support categories

The visit log "type of support" field must use a defined list:

- Vaccination information / facilitation
- Chronic disease management support
- Maternal health support
- Child health support
- Mental health / wellbeing support
- Healthcare navigation (accompanying to appointment)
- Rights and entitlements information
- Referral to health service
- Referral to social service
- Safeguarding referral (no further detail recorded in this system)
- Community health education session
- Other (free text, maximum 100 characters)

---

## 5. Role boundaries

### 5.1 Clear role distinctions

| Activity | Mediator may do | Mediator may not do |
|----------|----------------|---------------------|
| Health information | Provide WHO/ECDC-aligned education | State medical facts beyond their training |
| Symptoms | Suggest seeking care; facilitate | Assess, diagnose, or interpret symptoms clinically |
| Medication | Explain what a prescribed medicine does | Recommend, adjust, or substitute medication |
| Vaccination | Facilitate, encourage, answer common questions | Administer vaccines (unless separately qualified) |
| Navigation | Accompany, translate, advocate | Make clinical decisions for the person |
| Safeguarding | Provide safety information; make referral | Conduct child protection investigations |
| Mental health | Provide empathetic support; provide crisis line | Provide counselling or therapy |

### 5.2 "I don't know" is always acceptable

Mediators must be supported to say "I don't know — let me find out" or "This needs a clinician." The platform should make it easy to:

- Share a resource from the Learn or Vaccines section.
- Generate a doctor visit summary card (Navigate feature).
- Access the Zuvo AI advisor for a question.

### 5.3 Mediator-to-AI use

Mediators may use the Zuvo AI advisor as a reference tool during field work, subject to:

- The same clinical boundaries as any user.
- Data minimisation: do not enter a community member's personal details into the AI chat.
- AI responses must not be presented to community members as clinical advice or mediator assessment.

---

## 6. Referral pathways

### 6.1 When to refer

Mediators should make a referral whenever:

- A community member describes symptoms that require clinical assessment.
- A community member requests care but does not know where to go.
- A safeguarding concern is identified (violence, abuse, child harm, self-harm risk).
- A mental health crisis is identified.
- A pregnant person requires clinical input.
- A child's vaccination schedule is overdue.

### 6.2 Referral types and escalation

| Concern | Referral type | Urgency |
|---------|--------------|---------|
| General health question | GP / community health centre | Routine |
| Vaccination | Local vaccination point | Routine / scheduled |
| Chronic disease management | GP / specialist | Routine |
| Pregnancy | Midwife / antenatal clinic | Urgent if complications present |
| Mental health | Mental health service / helpline | Urgent if crisis; routine otherwise |
| Domestic violence / abuse | Domestic violence helpline / social services | Immediate if danger present |
| Child safeguarding | Child protection authority | Immediate if harm present |
| Acute / emergency symptoms | 112 | Immediate |

### 6.3 Referral documentation

When a referral is made, the visit log must record:

- Referral type (from the defined list in section 4.3).
- Whether the community member accepted the referral.
- Whether follow-up is needed.

No further clinical detail is recorded in the mediator system.

### 6.4 Mediator safety

If a mediator's field work exposes them to danger (violence, threats, unsafe environments), the mediator should:

1. Leave the situation if safe to do so.
2. Call 112 if there is immediate danger.
3. Report the incident to their programme supervisor.
4. Record a flag in their visit log: "Field safety concern — no further detail" (no personal data about the community member involved).

---

## 7. Safety escalation

### 7.1 Immediate danger

If a mediator encounters a situation where a person is in immediate danger (violence, acute medical emergency, self-harm):

1. Call 112 immediately.
2. Do not leave the person alone if it is safe to stay.
3. Notify programme supervisor as soon as possible.
4. Log a "Safeguarding referral" in the visit record.

### 7.2 Non-immediate safeguarding concerns

If a mediator identifies a safeguarding concern that is not an immediate emergency (ongoing abuse, child neglect, mental health deterioration):

1. Provide safety information and crisis line to the person.
2. Discuss referral options with the person and their consent.
3. Consult programme supervisor within 24 hours.
4. Record a "Safeguarding referral" in the visit log.

### 7.3 Escalation to clinical oversight

Programme operators must maintain a named clinical supervisor (nurse, doctor, or public health professional) available to mediators for consultation on:

- Clinical questions beyond the mediator's training.
- Safeguarding escalation decisions.
- Patterns of health concern in the community that may require a public health response.

---

## 8. Programme accountability

### 8.1 Meaningful metrics

Visit logs are designed to capture programme value, not just volume. Metrics worth tracking:

- Referrals made (and type).
- Referrals accepted by community members.
- Follow-up completed.
- Vaccination facilitation sessions.
- Navigation support provided.

Metrics that are NOT meaningful as standalone indicators:

- Number of visits logged (without type or outcome).
- Number of people contacted.

### 8.2 Programme operator obligations

Programme operators who deploy the mediator dashboard agree to:

- Issue PINs only to trained mediators.
- Maintain a named clinical supervisor accessible to mediators.
- Review mediator visit data at least monthly for safeguarding patterns.
- Revoke PINs for mediators who leave or violate this policy.
- Comply with `docs/DATA_GOVERNANCE.md` for data retention and access.

### 8.3 Admin auditability

All mediator PIN checks, visit submissions, and data exports are logged in `audit_log` with the mediator's user ID (not the community member's). Admin users may review these logs for safeguarding investigations. See `docs/DATA_GOVERNANCE.md` section 6.
