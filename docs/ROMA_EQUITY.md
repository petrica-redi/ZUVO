# Roma Equity and Anti-Stigmatization Policy

**Version:** 1.0  
**Effective date:** 2026-06-07  
**Owner:** Roma community advisory lead  
**Review cadence:** Every 12 months; Roma community advisory review every 24 months  
**Next review due:** 2027-06-07

---

## Purpose

Redi Health is built for Roma communities. This policy exists because public-health tools aimed at Roma people have historically reproduced the same stigmatisation, deficit framing, and surveillance dynamics that undermine trust and worsen health outcomes. This policy sets non-negotiable standards for how Redi Health frames Roma communities, collects data about them, and presents health information to and about them.

---

## 1. Strengths-based language standards

### 1.1 What "strengths-based" means

Strengths-based language acknowledges that Roma communities have:

- Strong intergenerational knowledge and care networks.
- Resilient community health practices, many of which have clinical value.
- Active advocates, mediators, and community leaders driving health improvement.
- A long history of navigating hostile systems while maintaining community cohesion.

Health challenges Roma communities face — higher rates of certain chronic conditions, lower vaccination uptake, higher maternal mortality — are the **result of structural inequities** (poverty, discrimination, lack of access, documentation exclusion, housing inadequacy) not of cultural or individual deficiency.

### 1.2 Language rules

**Always:**

- Frame health inequities as structural: "Roma communities face higher rates of X because of unequal access to Y."
- Acknowledge community assets in any section that discusses challenges.
- Use "Roma people" or "Roma communities" (not "the Roma" as a monolithic collective).
- Credit mediators, NGOs, and community health workers as agents of positive change.
- Use the active voice when describing community strengths: "Roma health mediators have reduced vaccination gaps in X regions."

**Never:**

- Use framing that implies Roma communities are inherently less healthy, less educated, or less capable.
- Lead with statistics about health deficits without structural context.
- Use phrases such as: "Roma tend to," "Roma believe," "Roma culture causes," "Roma resistance to."
- Describe traditional practices as uniformly backward or dangerous without acknowledging the social and economic context in which they persist.
- Use language that homogenises diverse Roma communities across 14+ countries.

### 1.3 Applying strengths-based language in content

Every section that describes a health challenge must also include:

- At least one structural determinant that explains it (not a cultural one).
- At least one community asset, protective factor, or successful intervention example.

Example — acceptable framing:

> "Vaccination rates in some Roma settlements are lower than national averages. This is often the result of documented barriers: clinics in distant locations, distrust built from past discriminatory experiences, documentation requirements that exclude unregistered residents, and misinformation spread in the absence of trusted health information. Health mediators and community nurses have shown that door-to-door vaccination outreach dramatically closes this gap."

Example — not acceptable:

> "Roma communities often reject vaccines due to cultural beliefs and mistrust of medicine."

---

## 2. No deficit framing

### 2.1 Definition

Deficit framing presents a community as defined by its problems, lacks, and failures. It is the opposite of strengths-based framing. In public health, it:

- Reinforces stereotypes.
- Reduces motivation and engagement from the community.
- Provides ammunition for discriminatory policy.
- Undermines trust between health services and communities.

### 2.2 Deficit framing checklist

Before publishing any content about Roma communities, review it against this checklist:

- [ ] Does it name a structural cause for any health disparity mentioned?
- [ ] Does it include community assets, programmes, or successes alongside the challenges?
- [ ] Is it free of cultural explanations for structural problems?
- [ ] Does it treat Roma communities as agents, not subjects?
- [ ] Does it avoid statistics about Roma people that are not accompanied by context?
- [ ] Does it avoid comparisons structured as "Roma vs. majority population" without acknowledging the structural reasons for differences?

### 2.3 AI system prompt compliance

The system prompt (`src/lib/ai/system-prompt.ts`) is the primary mechanism for ensuring the AI persona (Zuvo) embodies strengths-based framing. The system prompt must:

- Explicitly model the community from a position of lived knowledge, not clinical detachment.
- Acknowledge structural barriers naturally in responses.
- Never lecture users about their culture.
- Speak *with* community experience, not *about* it.

Annual review of the system prompt must include a Roma equity audit: does the AI's persona still align with these principles? Does it inadvertently reproduce stereotypes in specific topic areas?

---

## 3. Community review

### 3.1 Who must review

Content about Roma health (not general health literacy) must be reviewed by at least one of:

- A Roma health mediator with field experience in the relevant country.
- A Roma-led NGO with a health programme (e.g. Romani CRISS, ERRC, Phiren Amenca).
- A Roma studies academic or Roma health researcher.

### 3.2 What must be reviewed

| Content | Review requirement |
|---------|------------------|
| Regional health profiles (`src/data/regions.ts`) | Roma community reviewer for each country |
| Stories (`src/data/stories.ts`) | Consent from story subjects; Roma reviewer for framing |
| Rights content discrimination scenarios | Roma rights organisation review |
| System prompt (Roma equity dimensions) | Roma health mediator review annually |
| Any new pillar or module on Roma-specific health topics | Roma mediator + clinical review |
| Marketing / impact / about page copy | Roma community reviewer |

### 3.3 Review documentation

Community review must be documented with:

- Reviewer name and affiliation.
- Date of review.
- A brief summary of changes made in response to review feedback.

This record is stored in the PR description for the relevant content change, with the `community-review` label applied to the PR.

### 3.4 Advisory board

Redi Health should maintain a Roma Health Advisory Board of 3–5 people with lived experience, health expertise, or community leadership in Roma communities. This board:

- Reviews the Roma Equity Policy annually.
- Advises on new features that affect Roma communities.
- Reviews the platform's impact framing (the Impact page).
- Has a clear mechanism to raise concerns about content or features at any time.

---

## 4. Avoiding surveillance and profiling

### 4.1 Why this is high risk

Roma communities across Europe have been subject to state-sponsored surveillance, ethnic registration, forced sterilisation data collection, and discriminatory profiling. Any data feature that could be used to identify, track, or profile Roma individuals or communities by ethnicity carries a serious historical and present-day harm risk.

### 4.2 Ethnicity data rules

- Redi Health **does not collect** ethnicity data from users.
- Users may self-identify in the platform (e.g. choosing Romani language) but this is a language preference, not an ethnic data point.
- No database field, analytics event, or log may record ethnicity.
- Analytics cohorts (PostHog) must not be segmented by ethnic identity.
- If aggregate community health data is collected for impact reporting (e.g. mediator-served population counts), it must be:
  - Aggregated at community level, not individual level.
  - Collected only with community consent.
  - Controlled by the community or their representative organisation.

### 4.3 Location data rules

- The platform does not collect precise location data.
- "Region" selections (country-level) are used for content personalisation only and are not linked to user identity in the database.
- If future features require more granular location (e.g. "find providers near me"), the following rules apply:
  - Location data is used only for the immediate request and never stored.
  - No location data is sent to third-party analytics.
  - Users must be informed what location data is used for before they share it.

### 4.4 Mediator visit logging

Mediator visit logs (see `docs/MEDIATOR_POLICY.md`) must:

- Record only the minimum data necessary for health continuity and programme evaluation.
- Not record ethnicity.
- Not create a searchable index of individuals linked to a settlement or location.
- Be accessible only to the mediator who created the record and their supervising programme officer.
- Expire per the retention schedule in `docs/DATA_GOVERNANCE.md`.

### 4.5 Impact reporting rules

The Impact page and any reports generated for partner organisations or ministries must:

- Report aggregate programme metrics only (visits completed, modules completed, users served).
- Not include breakdowns that could identify individuals or small communities.
- Not frame Roma health data in ways that could be used for discriminatory policy or resource allocation.
- Be reviewed by the Roma Health Advisory Board before publication.

### 4.6 Third-party data sharing

No data that could identify or profile Roma individuals or communities may be shared with:

- State authorities without a legal obligation.
- Commercial data brokers.
- Research institutions without explicit, informed consent from the individuals concerned and community-level consent where appropriate.

All third-party sharing must comply with `docs/DATA_GOVERNANCE.md`.

---

## 5. Traditional remedies: a balanced approach

Roma communities have traditional health practices, many of which coexist with modern medicine. The platform's approach:

- Acknowledges the value of community health knowledge and traditional care practices.
- Does not mock, dismiss, or shame users who reference traditional remedies.
- Provides evidence-based information about what is clinically known about a traditional practice.
- Is honest about practices that are harmful or contraindicated without being condescending.
- Uses Zuvo's persona (trusted community mediator) to model a nuanced approach: "I know many families use this. Here is what I have seen in practice, and here is what the medical evidence says."

---

## 6. Policy compliance checks

### 6.1 Content creation

Every new content item (module, story, regional page, rights section) is reviewed against this policy before publication. The `community-review` PR label signals this check is required.

### 6.2 Annual audit

Annually, the clinical governance lead and Roma community advisory lead jointly audit:

- The system prompt for deficit framing or stigmatising language.
- The regional health profiles for outdated or deficit-framing content.
- The stories for consent and framing compliance.
- Impact reporting templates for surveillance risk.

### 6.3 Reporting

Community members, mediators, or partner organisations who identify content that violates this policy should:

- Email: equity@redi.healthcare
- Or use the in-app "Report a concern" link (to be implemented).

Reports will be reviewed within 14 days. Content that clearly violates this policy will be pulled within 24 hours of a confirmed report.
