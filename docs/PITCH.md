# Pitch — Redi Health for Romania & Italy

> The government-facing narrative, structured as a deck outline. Each `##` section
> is one slide (or one minute of speaking time). Technical backing for every claim
> is in [`ANALYSIS.md`](./ANALYSIS.md).

---

## 1. The problem (the human one)

A Roma mother in rural Bistrița-Năsăud has a feverish two-year-old. She is not
registered with a family doctor, she is not sure her insurance is valid, the last
time she went to the county hospital she was made to wait until everyone else was
seen, and a voice message circulating in her community says the fever is caused by
the vaccine the child got last month.

Eighteen months later the same family is living outside Rome. Different language,
different system, same wall: she has never heard of an ENI code, so she believes
care is simply not available to her family.

**Both governments are already paying for this failure** — in late-stage emergency
admissions, in TB and measles outbreaks, in EU infringement exposure, and in
obligated EU funds that go unabsorbed because there is no infrastructure to spend
them through.

## 2. The numbers

- Romania: **1.85–2.5M Roma citizens** (up to 13% of population); infant mortality
  in Roma communities multiples of the national average; recurring measles
  outbreaks traced to vaccination coverage gaps in exactly these settlements.
- Italy: **~1M Romanian citizens** — the largest foreign community in Italy —
  including tens of thousands in informal settlements; Italy's National Roma, Sinti
  and Caminanti Strategy (UNAR) has health-access targets with no digital delivery
  mechanism.
- Both countries report to Brussels on the same EU Roma Strategic Framework
  2020–2030 health indicators. Neither has tooling that produces them from the
  field.

## 3. What Redi Health is

**A health companion for families. A field workspace for mediators. An indicator
engine for ministries.** One platform, three layers:

1. **Families (anonymous, 15 languages incl. Romani, voice-first, offline-capable)**
   — AI health advisor, misinformation scanner, symptom triage with deterministic
   112 red-flag routing, healthcare navigator that produces a doctor-visit card in
   the national language, family vaccination tracker, patient-rights education with
   anti-discrimination scripts.
2. **Mediators** — case management with vulnerability tagging, home-visit and
   info-session logging, training curriculum pinned to national law, one-tap
   activity reports. Works offline; syncs additively.
3. **Ministries** — impact telemetry and indicators that map 1:1 to existing
   reporting obligations (POIDS / SCI 2000 in Romania), white-label admin panel,
   GDPR-grade data governance with EU hosting.

The trust model is deliberate and non-negotiable: **families are never registered,
named, or tracked**. Accountability lives at the mediator layer, where it
belongs — with a trusted member of the community who is already a public employee.

## 4. Why Romania and Italy together

- **Romania**: the platform already speaks the state's language — OUG 18/2017
  community health care, POIDS / FSE+ indicators, all 41 county UJSS structures,
  ECI training. Deployment is configuration, not construction.
- **Italy**: the highest-leverage missing feature anywhere in this space is an
  **STP/ENI navigator** — guided, multilingual help to obtain the codes that give
  undocumented persons and non-registered EU citizens free essential care. Italy
  grants the right; almost no one in the target population can exercise it. We map
  the mediator workspace to the *mediatore culturale* role, ASL districts, and
  *consultori familiari*.
- **Together**: the same families move between these two systems. A vaccination
  recorded in a Romanian village stays with the family in Lazio. Cross-border
  continuity of access is a story neither ministry can tell alone — and it is
  precisely what EU instruments want to fund.

## 5. Who pays (no new money required)

| Instrument | Country | Fit |
|---|---|---|
| **POIDS / FSE+** | RO | Already funds integrated community teams (ECI) in 2,000+ rural communities; the platform is their digital toolset |
| **PNRR Mission 6** | IT | Community health houses (Case della Comunità) and proximity care — mediator tooling is in scope |
| **EU4Health** | EU | Health-inequality reduction, vulnerable groups, cross-border |
| **AMIF** | IT/EU | Integration of mobile EU citizens and third-country nationals |
| **Interreg / twinning** | RO–IT | The cross-border continuity pilot itself |

The ask is a **co-funded pilot**: 2 Romanian counties with active ECI teams + 1–2
Italian regions with large settlement populations (Lazio, Campania), 12-month
operating window, success criteria below.

## 6. What we measure (pilot KPIs)

All produced by the existing indicator engine, per county / ASL:

- GP enrollments facilitated (RO) / STP-ENI codes obtained (IT)
- Insurance enrollments facilitated
- Vaccinations facilitated; prenatal pathways started
- TB / communicable screenings referred and completed
- Misinformation claims checked; emergency escalations routed to 112
- Mediator caseload, visits, sessions — automated reporting hours saved

## 7. Safety & compliance posture

- Deterministic emergency red-flag detection **before** any AI model is invoked;
  triage never diagnoses.
- PII scrubbing before model egress; EU-resident processing; Langfuse audit trail
  of AI interactions.
- GDPR data-subject endpoints (export, delete) live today; documented retention.
- Positioning under the EU AI Act: human-overseen navigation aid; mediator
  escalation built in. Outside MDR device classification by design (no diagnosis).
- Roadmap: published DPIA, EN 301 549 accessibility audit, SPID/CIE and ROeID SSO
  for staff accounts (never for beneficiaries).

## 8. The brand (why it looks the way it does)

The redesigned identity anchors on **Adriatic teal** — the visual language of
public health, not of venture SaaS — layered with sage and cream for community
warmth and a disciplined crimson reserved exclusively for emergencies. It is
designed to sit comfortably in three rooms at once: a ministry steering committee,
a county mediator training, and a family's phone. Institutional enough to be
funded; warm enough to be trusted.

## 9. The ask

1. A pilot agreement with Ministerul Sănătății / ANPIS (RO) and one Italian region
   plus UNAR (IT).
2. Verified data the governments uniquely hold: county UJSS contacts, ASL
   directories, Roma-friendly / interpreter-equipped provider lists.
3. A joint application to one EU instrument (Interreg or EU4Health) for the
   cross-border component.

In return: a deployed, branded, multilingual platform; mediator onboarding;
live impact telemetry; and indicator exports that drop directly into the reports
both governments already owe Brussels.

---

*One family, two systems, zero continuity — until now.*
