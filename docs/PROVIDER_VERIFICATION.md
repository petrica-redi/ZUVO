# Provider Verification Policy

**Version:** 1.0  
**Effective date:** 2026-06-07  
**Owner:** Operational lead  
**Review cadence:** Every 12 months  
**Next review due:** 2027-06-07

---

## Purpose

The Provider Directory lists health services intended to be accessible to Roma and other underserved communities. Because these listings can directly influence health-seeking behaviour, incorrect, stale, or misleading entries can cause real harm — sending someone to a clinic that has closed, misrepresenting services as free when they are not, or labelling a provider "Roma-friendly" when they have a history of discrimination.

This policy defines who can verify listings, what verification means in practice, what "Roma-friendly" means, how listings are maintained, and how users can report harm.

---

## 1. Current status

**As of 2026-06-07, the Provider Directory contains placeholder data only.** No listing currently displayed is verified. The UI must clearly communicate this status to all users (see section 6). No "Roma-friendly" badge may be displayed on unverified listings.

---

## 2. Who verifies listings

### 2.1 Verification tiers

| Tier | Verifier | Listing label |
|------|---------|---------------|
| **Verified** | Redi Health operational team confirms listing against official sources and direct contact with the provider | "Verified" badge |
| **Community-reported** | A Roma health mediator or NGO partner has reported the listing based on direct experience | "Community-reported" label |
| **Unverified** | Listing has not been verified; shown only with an explicit unverified disclaimer | No badge; disclaimer required |

### 2.2 Who may verify

**Redi Health operational team** (for Verified status):

- Must include at least one person with public health or healthcare administration background.
- Must contact the provider directly to confirm: operating status, services offered, cost, interpreter availability, and whether Roma patients are served without discrimination.
- Must review any available patient complaints data or public inspection reports.

**Roma health mediator or NGO partner** (for Community-reported status):

- Must be a registered mediator or staff member of a Redi Health partner organisation.
- Must have visited the facility or worked with it in the last 12 months.
- Must complete a structured assessment form (see section 3.3).
- Community-reported listings may not carry the "Roma-friendly" badge — only the "Community-reported" label.

### 2.3 Who may NOT verify

- Users without a registered mediator or partner affiliation.
- Providers themselves (providers may submit listings for review but cannot self-verify).
- Anonymous submissions.

---

## 3. Verification process

### 3.1 New listing submission

A new listing may be submitted by:

- Redi Health operational staff.
- A registered Roma health mediator via the mediator dashboard.
- A partner NGO via a secure submission form.

Each submission must include:

- Provider name, address, phone number, website (if available).
- Type of service (GP, specialist, community health centre, hospital, pharmacy, NGO health service).
- Languages spoken (with specific Romani dialect support noted if applicable).
- Cost (free / means-tested / private insurance required / national insurance card required).
- Interpreter service (yes / no / informal / language(s)).
- Operating hours.
- Whether the provider accepts patients without documentation or insurance.
- Source of information (direct visit, mediator report, NGO referral, official directory).

### 3.2 Redi Health verification steps

For a listing to reach "Verified" status:

1. **Phone or email confirmation** — Contact the provider directly to confirm operating status, services, cost, and language support.
2. **Cross-reference** — Check against national health authority directory or official registry where available.
3. **Discrimination check** — Review any available complaints data; consult partner NGOs if there are concerns.
4. **Roma community assessment** — Where possible, confirm with a local Roma mediator or NGO that the provider serves Roma patients without discrimination.
5. **Record review date** — Set `verifiedAt` and `nextVerificationDue` in the provider record.

### 3.3 Community-reported listing assessment form

Roma mediators and NGO partners submitting a community-reported listing must complete:

- [ ] I have visited or referred patients to this provider in the last 12 months.
- [ ] The provider was operating and the services described were available.
- [ ] I am not aware of documented discrimination against Roma patients at this provider.
- [ ] The cost and language information I have provided is accurate to the best of my knowledge.
- [ ] I give my name and affiliation for this submission.

Submissions are reviewed by the Redi Health operational team within 14 days.

---

## 4. What "Roma-friendly" means

The "Roma-friendly" label is a meaningful claim with specific criteria. It must not be applied loosely.

### 4.1 Minimum criteria for the "Roma-friendly" label

All of the following must be confirmed:

- [ ] The provider accepts Roma patients without requiring documentation not also required of all patients.
- [ ] Staff have received anti-discrimination training or the provider has a written non-discrimination policy.
- [ ] There are no substantiated formal complaints of discrimination against Roma patients in the last 3 years.
- [ ] At least one of: Romani-speaking staff, a culturally competent interpreter, or a Roma health mediator affiliation.
- [ ] The provider has been assessed by a Roma health mediator or Roma-led NGO within the last 18 months.

### 4.2 What "Roma-friendly" does NOT mean

- That every staff member is free of prejudice.
- That Roma patients will have the same experience as majority-population patients in all circumstances.
- That the provider is endorsed for all healthcare needs.

The label is a signal, not a guarantee. It must be accompanied by the user-facing note: "This label is based on available information. Report your experience to help us keep this up to date."

### 4.3 Label expiry

The "Roma-friendly" label expires after 18 months without re-verification. Expired labels are automatically downgraded to "Community-reported" or "Unverified" in the UI until renewed.

---

## 5. Verification frequency

| Listing status | Re-verification cadence |
|---------------|------------------------|
| Verified | Every 12 months |
| Community-reported | Every 18 months |
| Unverified | No cadence; always displayed with disclaimer |
| "Roma-friendly" label | Every 18 months (separate from general verification) |

A monthly automated check flags listings with `nextVerificationDue` in the past. The operational team is notified via the admin dashboard. Listings overdue by more than 30 days are automatically downgraded one tier.

---

## 6. Unverified listing display rules

Until the provider directory is populated with verified listings, the following rules apply:

### 6.1 Placeholder data warning

A prominent banner must appear at the top of the Providers page:

> **This directory is under development.** The listings shown are examples only and have not been verified. Do not use this information to make healthcare decisions. Contact your local health centre, NGO, or health mediator directly.

This banner must:

- Be visually distinct (amber or warning colour).
- Appear above any listing content.
- Not be dismissible by the user.
- Remain until the page contains at least one Verified listing.

### 6.2 Individual listing disclaimers

Each listing must display its verification status clearly:

| Status | UI label |
|--------|---------|
| Verified | Green "Verified" badge with verification date |
| Community-reported | Blue "Community-reported" badge with date and submitter role |
| Unverified | Grey "Unverified — please check directly" label |

### 6.3 Removing the "Roma-friendly" badge from unverified listings

The "Roma-friendly" badge must not appear on any listing that has not met the criteria in section 4.1. All existing placeholder listings must have this badge removed until verified.

---

## 7. How users report harm

### 7.1 Report mechanism

Each provider listing must include a "Report a concern" button or link that:

- Is visible without scrolling on mobile.
- Opens a simple form or email link pre-populated with the provider name.

### 7.2 What users can report

- Discrimination experienced at the listed provider.
- Services that were not as described (not free, no interpreter, not accepting Roma patients).
- Provider no longer operating.
- Incorrect information (wrong address, phone, hours).

### 7.3 Report handling

| Report type | Response time | Action |
|------------|---------------|--------|
| Discrimination claim | 3 business days | Investigate; downgrade or remove listing if substantiated; notify Roma NGO partner |
| Incorrect information | 7 business days | Update or remove listing |
| Provider closed | 3 business days | Remove or suspend listing |
| Safety concern | 24 hours | Suspend listing immediately; investigate |

Reports are reviewed by the operational lead. Substantiated discrimination reports are shared with the relevant Roma rights NGO for their awareness.

### 7.4 Confidentiality

User reports are handled confidentially. The reporting user's identity is not shared with the provider. If a report is investigated with the provider's involvement, only aggregated or anonymised feedback is shared.

---

## 8. Provider self-registration (future)

When provider self-registration is implemented:

- Providers must agree to the platform's non-discrimination terms before their listing is shown.
- Self-registered listings are displayed as "Unverified" only.
- Providers may request Verified status by completing the verification process.
- Self-registration data is reviewed by the operational team before publication.
- Providers found to have submitted false information are permanently removed.
