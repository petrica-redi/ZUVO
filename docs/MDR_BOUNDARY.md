# Medical Device Regulation (MDR) — Product Boundary Statement

> Redi Health is **wellness navigation and community mediation software**, not a
> medical device under EU MDR 2017/745. This document defines the boundary for
> procurement teams and notified-body reviewers.

## 1. Intended purpose

Redi Health helps vulnerable communities:

- Understand how to access health services (navigator, rights, visit cards)
- Recognise when to seek urgent care (red-flag gate → emergency services)
- Track personal wellness data voluntarily (mood, water, activity)
- Enable community mediators to log outreach and report programme indicators

It does **not** intend to diagnose, prevent, monitor, treat, or alleviate disease
**as its primary intended purpose**.

## 2. Features outside MDR scope

| Feature | Why out of scope |
|---|---|
| Healthcare navigator | Administrative / educational guidance |
| Rights education | Information only |
| Doctor visit card | Communication aid for appointments |
| Family vaccination tracker | Personal record-keeping, not immunisation decision support |
| Mediator POIDS indicators | Programme reporting, not clinical workflow |
| Misinformation scanner | General health literacy, not diagnostic |

## 3. Features requiring careful positioning

| Feature | Boundary rule |
|---|---|
| Symptom triage | Traffic-light **guidance to seek care**; never states a diagnosis; emergencies bypass AI |
| AI health chat | Persona of community mediator; refers to local services; no prescription generation |
| Prescription explainer | Explains **existing** prescriptions; does not recommend new medicines |

**Marketing and UI copy must not claim**: "diagnose", "detect disease", "replace your
doctor", or "clinical decision support integrated with EHR".

## 4. Comparison to MDR software (Rule 11)

Per MDR Annex VIII Rule 11, software that provides information used for diagnostic or
therapeutic decisions may be classified as a medical device. Redi Health **does not**
feed diagnostic or therapeutic decisions to healthcare professionals as part of a
clinical workflow. Outputs are consumer-facing and mediator-facing educational content.

## 5. If a deployer extends the product

The following extensions **would** likely trigger MDR consultation:

- Integration with hospital EMR for clinician-facing diagnostic suggestions
- Automated treatment or dosing recommendations without human review
- CE-marked hardware sensors bundled as a diagnostic kit

Any such extension requires a separate regulatory pathway and must not ship under the
base Redi Health intended-purpose statement without updated labelling.

## 6. Incident reporting

Safety issues (e.g. user harmed because emergency routing failed) follow
`docs/RUNBOOK.md` and are reported to the operator's pharmacovigilance / patient-safety
contact — not as MDR vigilance unless the deployment has been reclassified.

## 7. Sign-off

| Role | Organisation | Date |
|---|---|---|
| Product owner | _[Operator]_ | |
| Clinical advisor | _[Optional]_ | |
