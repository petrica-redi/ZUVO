# Public Health Source Policy

**Version:** 1.0  
**Effective date:** 2026-06-07  
**Owner:** Clinical governance lead  
**Review cadence:** Every 12 months  
**Next review due:** 2027-06-07

---

## Purpose

This policy defines which sources Redi Health may use for health guidance, how they must be cited, how frequently they must be reviewed, and how country-specific overrides are managed. It applies to all health education content, AI system prompt guidance, vaccine schedules, triage logic, rights information, and regional health data.

---

## 1. Approved source hierarchy

Sources are ranked by authority. Higher-tier sources supersede lower-tier sources when they conflict.

### Tier 1 — International public health authorities

| Organisation | Scope | Website |
|-------------|-------|---------|
| World Health Organization (WHO) | Global health guidance, vaccine schedules, disease definitions | who.int |
| European Centre for Disease Prevention and Control (ECDC) | EU communicable disease, vaccine recommendations | ecdc.europa.eu |
| International Federation of Red Cross and Red Crescent Societies (IFRC) | First aid, disaster health | ifrc.org |
| European Resuscitation Council (ERC) | Resuscitation and first aid protocols | cprguidelines.eu |
| UNICEF | Child health, immunisation, nutrition | unicef.org |
| UNESCO | Health literacy, comprehensive sexuality education frameworks | unesco.org |

### Tier 2 — National health ministries and agencies

Each supported country's health ministry is a Tier 2 source for that country's specific guidance, including:

- National vaccination schedules
- Legally mandated patient rights
- Emergency service numbers
- Insurance and entitlement rules

Country-specific guidance from a national ministry **supersedes** Tier 1 guidance for users in that country when the two conflict, except on established clinical protocols (e.g. first aid steps, WHO clinical case definitions).

Supported countries: Romania, Bulgaria, Hungary, Slovakia, Czech Republic, Serbia, North Macedonia, Albania, Greece, Turkey, Croatia, Bosnia and Herzegovina, Kosovo, Slovenia.

### Tier 3 — Peer-reviewed clinical evidence and clinical society guidance

| Type | Acceptable sources |
|------|--------------------|
| Clinical guidelines | European Society of Cardiology, WHO clinical guidelines, national clinical societies |
| Peer-reviewed journals | The Lancet, BMJ, NEJM, Cochrane Reviews |
| Roma health research | Roma Health Report (EU), ERRC peer-reviewed outputs |

Tier 3 sources may support Tier 1 or Tier 2 claims but must not be the sole source for clinical guidance.

### Tier 4 — NGO and community health organisations

| Organisation | Scope |
|-------------|-------|
| European Roma Rights Centre (ERRC) | Rights documentation, discrimination case law |
| Roma Education Fund | Youth health literacy context |
| Romani CRISS (Romania) | Field health evidence |
| Amnesty International | Discrimination and rights |

Tier 4 sources may be used for lived-experience context, rights documentation, and community-specific framing. They **must not** be the sole source for clinical facts.

### Not acceptable as primary sources

The following are **never** acceptable as primary sources for health facts:

- Social media posts, influencer content, or blog posts
- Single-study findings without peer review
- Commercial product websites
- Opinion pieces, editorials
- Anecdotal reports without clinical corroboration
- Traditional remedy claims without evidence review

---

## 2. Citation rules

### 2.1 Student Academy and Learn modules

Every module must cite:

- At least **one** Tier 1 source.
- Source citations appear in the `sources` array of the module's data definition in `src/data/student-health.ts`.
- The lesson page renders a "Verified sources" card at the bottom of each lesson.

Format:

```ts
sources: [
  {
    label: "WHO — Immunization in practice",
    url: "https://www.who.int/publications/i/item/9789241548960",
  },
]
```

### 2.2 AI system prompt

The system prompt (`src/lib/ai/system-prompt.ts`) does not cite sources inline because responses are conversational. However:

- All factual claims the AI makes must be consistent with current Tier 1 guidance.
- The system prompt must be reviewed against current WHO and ECDC guidance annually or when major guideline updates occur.
- The system prompt must instruct the AI to direct users to authoritative sources rather than stating facts without grounding.

### 2.3 Vaccines page

Each vaccine entry in `src/data/vaccines.ts` must include:

- Source attribution (WHO, ECDC, or national ministry).
- Last reviewed date.
- Country of applicability where the schedule differs by country.

### 2.4 Rights page

Each rights section in `src/data/rights.ts` must include:

- The jurisdiction it applies to.
- The legal instrument it is based on (e.g. EU Patients' Rights Directive 2011/24/EU, national law reference).
- Last verified date.

### 2.5 Regional health data

Each country entry in `src/data/regions.ts` must include:

- Source for population/health statistics (e.g. EU Roma Health Report, national census data).
- Year of the data.
- Source URL where available.

### 2.6 Misinformation scanner

The Scan feature (`/api/scan`) must:

- Only return verdicts based on Tier 1 or Tier 2 sources.
- Display the source used for the verdict in the UI.
- Use nuanced verdict categories (see `docs/CLINICAL_SAFETY.md` section 4).
- Never use "AI says" as a standalone authority claim.

---

## 3. Review frequency

| Content type | Review cadence | Trigger for early review |
|-------------|----------------|--------------------------|
| WHO/ECDC clinical guidance used in modules | 12 months | WHO/ECDC issues updated guidance |
| National vaccination schedules | 12 months | Ministry publishes updated schedule |
| Patient rights content | 12 months | EU directive update or national law change |
| Emergency numbers | 12 months | Verified via official government source |
| First aid protocols (Tier 1) | 12 months | ERC/IFRC issues new guidelines |
| Sexual health/STI content | 12 months | WHO or CDC updates treatment guidelines |
| Misinformation verdicts | 6 months | Sustained public-health misinformation event |
| AI system prompt factual claims | 12 months | Major guideline change in any covered topic |

Reviews are tracked via the `review` block in module definitions. Overdue content is flagged per the process in `docs/CONTENT_REVIEW.md`.

---

## 4. Country-specific override process

When a national health ministry's guidance conflicts with a Tier 1 source, or when a feature needs country-specific values (vaccine schedules, emergency numbers, insurance rules, legal rights), the override process is:

### Step 1 — Identify the conflict or need

Document:
- The conflicting Tier 1 guidance.
- The country-specific guidance and its source URL.
- The specific feature(s) affected.

### Step 2 — Clinical governance review

The clinical governance lead reviews whether the national guidance is:

- Consistent with the clinical evidence (preferred override).
- A local policy decision that does not contradict clinical safety (acceptable override).
- Clinically contraindicated (override rejected; escalate to legal and public health advisory).

### Step 3 — Implementation

Country overrides are implemented as country-keyed entries in the relevant data file:

- Vaccine schedules: `src/data/vaccines.ts` with a `countrySchedule` map.
- Emergency numbers: `src/data/regions.ts` `emergencyNumber` field.
- Patient rights: `src/data/rights.ts` `jurisdiction` field.
- Insurance/entitlements: `src/data/regions.ts` `insuranceContext` field.

### Step 4 — Source attribution

Every country-specific override must include:

- Source name.
- Source URL.
- Date last verified.
- Name/role of the person who verified it.

### Step 5 — Review schedule

Country-specific overrides are reviewed on the same cadence as the content type they belong to. A dedicated annual review of all country overrides is performed in Q1 each year.

---

## 5. Source integrity events

If a Tier 1 or Tier 2 source updates its guidance in a way that conflicts with content already live in Redi Health:

1. Open a SEV-2 incident.
2. Pull affected modules (`pulled: true`).
3. Update content to align with new guidance within 14 days.
4. Re-review before un-pulling.

If a source organisation is found to have published guidance that was later retracted or corrected, all content derived from that guidance must be audited within 7 days.
