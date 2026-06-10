# Data Protection Impact Assessment (DPIA) — Redi Health

> Template DPIA for government procurement and NGO programme deployment.
> Operator-specific deployments must complete the open fields and obtain DPO sign-off.

## 1. Processing overview

| Field | Value |
|---|---|
| **Controller** | _[Ministry / NGO operator name]_ |
| **Processor** | Redi Health platform operator (Zuvo) |
| **Purpose** | Improve health access for vulnerable communities via anonymous companion tools, community mediator field logging, and aggregate programme reporting |
| **Legal basis** | Art. 6(1)(e) GDPR — public interest / Art. 9(2)(h) — health or social care (where health data is processed with appropriate safeguards) |
| **Data subjects** | Beneficiaries (often anonymous), community mediators, optional registered users, programme administrators |
| **Special-category data** | Health-related self-reports (mood, vitals, vaccination records, symptom descriptions), vulnerability tags on mediator cases |

## 2. Data flows

```mermaid
flowchart LR
  A[Beneficiary device] -->|anonymous session| B[Next.js API]
  C[Mediator device] -->|workspace UUID + secret| B
  B --> D[(Postgres EU)]
  B -->|scrubbed text| E[OpenAI]
  B --> F[Sentry / PostHog EU]
  G[Ministry dashboard] -->|admin key| H[/api/mediator/aggregate]
  H --> D
```

### Personal data categories

| Category | Examples | Storage | Retention |
|---|---|---|---|
| Account | Email (optional), locale, XP | `users` | Until deletion |
| Health self-tracking | Mood, water, vitals, vaccines | `health_logs` | 5 years or deletion |
| Mediator field data | Case names, visit notes, facilitation flags | `mediator_workspaces` (JSON) | 5 years |
| Audit | Action, resource, timestamp | `audit_log` | 1 year |
| AI requests | Last 8 messages, scrubbed | Ephemeral + Langfuse trace | Request lifecycle |

### Data not collected by design

- National ID numbers (CNP, codice fiscale) — scrubbed before AI egress
- Raw audio beyond browser speech-to-text session
- Advertising identifiers or cross-site tracking

## 3. Necessity and proportionality

| Processing | Necessity | Proportionality measure |
|---|---|---|
| Anonymous companion | Enables access without registration barrier for undocumented users | Default anonymous; optional account |
| AI health advisor | Low-literacy navigation support | PII scrub, rate limits, red-flag bypass to 112, no diagnosis claims |
| Mediator workspace | POIDS / SCI 2000 and ASL reporting obligations | County-scoped sync; workspace secret after rotation |
| Aggregate API | Ministry KPI dashboards | County-level counts only; admin key required; no beneficiary PII in export |
| Product analytics | Programme evaluation | PostHog EU, DNT honoured, no health text in events |

## 4. Risk assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Unauthorised workspace access | Medium | High | `secretHash` on workspaces; RLS on mediator tables |
| AI prompt leakage | Low | High | `scrubPii` in `src/lib/api/ai-budget.ts`; EU residency option |
| Re-identification from aggregates | Low | Medium | Minimum cell sizes in county reports; no free-text in CSV export |
| Children's data | Medium | High | No mandatory age collection; referral to local services for sensitive topics |
| Cross-border transfer (RO ↔ IT) | Medium | Medium | EU-hosted processors; DPIA per deployment jurisdiction |

## 5. Rights of data subjects

Implemented endpoints and UI:

- `GET /api/me/export` — full JSON bundle
- `POST /api/me/delete` — scrub + 30-day hard-delete queue
- Device-local export for fully anonymous sessions
- DPO contact: dpo@redi.healthcare (see `docs/PRIVACY.md`)

## 6. Consultation and sign-off

| Role | Name | Date | Signature |
|---|---|---|---|
| DPO | _[Name]_ | | |
| Programme owner | _[Ministry / NGO]_ | | |
| Technical lead | _[Operator]_ | | |

## 7. Review schedule

- **Annual** review or upon material change (new AI model, new country pack, new data category).
- **Immediate** review after any personal-data breach (see `docs/RUNBOOK.md`).
