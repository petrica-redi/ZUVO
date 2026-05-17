# Content review workflow

Health education content must be accurate, current, and reviewed by qualified humans. This document defines who reviews what, how often, and how to mark content as reviewed.

## Why this exists

Sastipe lessons cover first aid, STIs, vaccines, and emergency response. Wrong information can cause real harm. This workflow ensures every shipped lesson has been:

1. Drafted with cited sources.
2. Reviewed by a clinician or public-health expert.
3. Stamped with a reviewer role and date.
4. Re-reviewed at least annually.

## Review tiers

### Tier 1 — Emergency & first aid

Modules: `emergency101`, `bleedingBasics`, `burnsBasics`, `chokingBasics`, `firstAidReview`

- Reviewer: licensed nurse, paramedic, or first-aid trainer.
- Cadence: every 12 months, or sooner if guidance from WHO/IFRC/Red Cross changes.
- Source primacy: WHO, IFRC, ERC (European Resuscitation Council).

### Tier 2 — Sexual health & consent

Modules: `stiBasics`, `stiTesting`, `stiMyths`, `consentBasics`

- Reviewer: clinician with sexual-health practice, OR youth-health NGO with peer-reviewed materials.
- Cadence: every 12 months.
- Source primacy: WHO, CDC, UNESCO comprehensive sexuality education.

### Tier 3 — Vaccines & disease

Modules: `vaccineLiteracy`, `vpdExamples`

- Reviewer: public-health professional or paediatrician.
- Cadence: every 12 months, or sooner if national schedules change.
- Source primacy: WHO, ECDC, national health ministry.

### Tier 4 — Health literacy & capstone

Modules: `sourceLiteracy`, `capstoneMix`

- Reviewer: health-literacy researcher or curriculum designer.
- Cadence: every 24 months.

## Marking content as reviewed

Each module ships with metadata in `src/data/student-health.ts`:

```ts
{
  id: "emergency101",
  // ... content keys ...
  review: {
    reviewedAt: "2026-04-12",
    reviewerRole: "Licensed nurse, IFRC first-aid instructor",
    nextReviewDue: "2027-04-12",
  },
}
```

The lesson page displays a "Last reviewed" footer chip. If `nextReviewDue` is in the past, a yellow banner appears warning the student to verify with a clinician.

## Review process

1. **Draft** the content in a feature branch. Update copy in `messages/_studentHealth.json` and re-run the merge script.
2. **Open a PR** with the `content-review` label.
3. **Tag the appropriate reviewer** from the table above.
4. The reviewer leaves an explicit approval comment with their name and role, e.g.:
   > Approved 2026-04-12. — Dr. A. Example, paediatrician, Bucharest General Hospital.
5. Update the `review` block in code.
6. Merge.

## Source citation rules

- Every module must cite **at least one** authoritative source (WHO, IFRC, CDC, ECDC, UNESCO, NIH, or national health ministry).
- Sources are surfaced to students at the bottom of each lesson via the "Verified sources" card.
- Influencer claims, single-study findings, and op-eds are **not acceptable** primary sources.

## Overdue review handling

A monthly cron job:

1. Queries every module's `nextReviewDue`.
2. Opens a Linear/Jira ticket for any module overdue by 30 days.
3. Posts a Slack alert if any module is overdue by 90 days.

## Pulled content

If a clinical issue is found in shipped content:

1. Open a SEV-2 incident.
2. Hide the module by setting `pulled: true` in its data definition.
3. The hub renders a "Temporarily unavailable" placeholder.
4. Fix and re-review before un-pulling.
