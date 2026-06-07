# Data Governance Policy

**Version:** 1.0  
**Effective date:** 2026-06-07  
**Owner:** Data Protection Officer  
**Review cadence:** Every 12 months or on material architecture change  
**Next review due:** 2027-06-07  
**DPO contact:** dpo@redi.healthcare

---

## Purpose

Redi Health handles health-adjacent data about people in vulnerable situations, including Roma community members, young people, and people with undocumented status. This policy establishes how all data — both local (device-only) and server-stored — is governed, what rights users have, how retention is managed, how minor data is handled, and how admin changes are audited.

This policy supplements `docs/PRIVACY.md` (the user-facing privacy notice) and `docs/RUNBOOK.md` (operational incident response).

---

## 1. Data inventory and classification

### 1.1 Server-stored data

| Table | Classification | Contains | Retention |
|-------|--------------|---------|-----------|
| `users` | Personal data | Account, locale, preferences, XP, streak, last active | Until account deletion; hard delete 30 days after soft delete |
| `progress` | Behavioural data | Lesson and stage completion | Until account deletion |
| `health_logs` | Health data (special category) | Mood, water, activity, vitals, vaccination records | 5 years or until deletion request |
| `mediator_visits` | Health data (special category) | Field worker logs; community member identifiers if present | 5 years |
| `audit_log` | Operational data | Who did what, when, on which resource | 1 year |
| `notifications` | Personal data | Push and in-app messages | 90 days, then archived |
| `providers` | Operational data | Clinic listings (no user data) | Until removed by operator |
| `mediatorProfiles` | Personal data | Mediator identity, PIN hash, region, policy acknowledgement | Until deactivated; hard delete after 90 days |
| `communities` | Aggregate/operational | Community definitions (not individual profiles) | Until removed by operator |

### 1.2 Local (device-only) data

Local data is stored in the user's browser `localStorage`. It is not transmitted to Redi Health servers (except when a user chooses to sync via an authenticated account).

| Key | Classification | Contains | User control |
|-----|--------------|---------|-------------|
| `sastipe_mediator_access` | Session data | Boolean access flag | Cleared on logout / session end |
| `sastipe_mediator_visits` | Health data (special category) | Local visit logs | Exportable and deletable via Profile > Data |
| `zuvo_*` (family hub) | Behavioural / health data | Family member profiles, health logs | Exportable and deletable via Profile > Data |
| `redi_*` (progress) | Behavioural data | Lesson progress, XP, streaks | Exportable and deletable via Profile > Data |
| AI conversation cache | Transient | Last N messages for context | Cleared on session end; never stored server-side |

Local data is treated with the same rights and protections as server data. The fact that data is stored locally does not exempt it from GDPR coverage.

### 1.3 Data not collected

Redi Health explicitly does **not** collect:

- Ethnicity data (see `docs/ROMA_EQUITY.md` section 4.2).
- Precise GPS location.
- Raw AI prompts beyond the request lifecycle.
- IP addresses past the audit log retention window.
- Health data from users under 14 without caregiver knowledge.

---

## 2. Legal basis for processing

| Data type | Legal basis | Notes |
|-----------|-------------|-------|
| Account data | Contract (terms of service) | Required for authenticated features |
| Learning progress | Legitimate interest (personalisation) | User may delete at any time |
| Health logs | Explicit consent | Consent is granular; each log type is opt-in |
| AI processing | Legitimate interest + explicit AI notice | Notice shown on first AI use per session |
| Mediator visit logs | Legitimate interest (public health programme) + community member consent | Consent required before logging; see `docs/MEDIATOR_POLICY.md` |
| Audit log | Legal obligation (GDPR Article 5 accountability) | Cannot be deleted by users; accessible to DPO only |
| Analytics (PostHog) | Legitimate interest | Anonymised; honoured via Do-Not-Track header |

---

## 3. Data-subject rights

### 3.1 Rights applicable

Under GDPR (and equivalent national law), users have:

- **Access** — receive a copy of all data held about them.
- **Rectification** — correct inaccurate data.
- **Erasure** — delete their data ("right to be forgotten").
- **Portability** — receive data in a machine-readable format.
- **Restriction** — limit processing in certain circumstances.
- **Objection** — object to processing based on legitimate interest.

### 3.2 How rights are exercised

| Right | How to exercise | SLA |
|-------|----------------|-----|
| Access | In-app: Profile > Data > Export; or email dpo@redi.healthcare | 30 days |
| Erasure | In-app: Profile > Data > Delete account; or email DPO | 30 days; hard delete within 30 days of soft delete |
| Rectification | In-app profile settings for supported fields; DPO for other fields | 30 days |
| Portability | In-app export returns JSON; includes all server data | 30 days |
| Restriction / Objection | Email DPO | 30 days |

### 3.3 Local data in export and deletion

The in-app export (`GET /api/me/export`) returns server-side data. **Local data is not automatically included in a server export because it never reaches the server.**

To address this gap:

- The Profile > Data section must include a "Download local data" option that exports localStorage data to a JSON file client-side.
- The "Delete account" flow must include a "Also clear local data" option that wipes relevant localStorage keys.
- If a user requests data erasure via the DPO, the response must include explicit instructions for clearing local data and a link to the Profile > Data page.

This is a current implementation gap. Until resolved, the Privacy page and Profile > Data page must clearly explain what data is local-only and how to clear it.

### 3.4 Guest and anonymous users

Users who have not created an account (guest / anonymous) have:

- Local data only (see section 1.2).
- No server-side data (no server export is possible).
- The right to clear all local data via Profile > Data > Clear local data.
- No account to delete.

The Privacy page and GDPR export flow must clearly handle the guest case: instead of returning an auth error, it must explain that no server data is held and direct the user to local data controls.

---

## 4. Retention schedule

| Data | Retention | Process at end |
|------|-----------|----------------|
| User account | Until deletion + 30 days (hard delete) | Anonymise identifying fields; retain aggregate stats |
| Learning progress | Until account deletion | Hard delete |
| Health logs | 5 years from creation | Hard delete |
| Mediator visits | 5 years from visit date | Hard delete |
| Audit log | 1 year | Hard delete |
| Notifications | 90 days | Archive (stripped of content, retain send timestamp) |
| AI conversation (server) | Not retained past request | Never written to DB |
| Mediator PIN hash | Until mediator deactivated + 90 days | Hard delete |
| Local data | User-controlled | User clears via Profile; no automatic expiry |

Retention enforcement is implemented via a scheduled database job. The job runs monthly and must be verified in the monthly operational review (see `docs/RUNBOOK.md`).

---

## 5. Minor data

### 5.1 Definition

A minor is anyone under 18. The Student Academy is designed for 14+ audiences. No feature requires age confirmation from users.

### 5.2 Data minimisation for minors

- We do not knowingly collect age data.
- If age is volunteered in `health_logs` and indicates the user is under 14, the health log must not record detailed clinical information without caregiver knowledge.
- Mediator visit logs that reference a minor (e.g. "child vaccination follow-up") must not include the child's name or personal identifiers. An anonymised reference (e.g. "child in household") is sufficient.

### 5.3 Parental / guardian access

- A parent or guardian may request access to or deletion of data for a minor in their care by contacting the DPO.
- The DPO must verify the relationship before responding.
- Redi Health does not independently store information that would allow it to identify which accounts belong to minors.

### 5.4 Processing legal basis for minors

If it becomes known (via health log data or mediator records) that a data subject is under 16 in a country where the GDPR age of digital consent is 16, the legal basis must be verified before processing continues. In practice, this means:

- Health logs for users who identify as under 16: legal basis must be parental consent, verified via the DPO.
- If parental consent cannot be verified, health logs are restricted to anonymous aggregate entries only.

---

## 6. Admin auditability

### 6.1 What is logged

All admin and elevated-privilege actions are logged in `audit_log`:

| Action | Logged event |
|--------|-------------|
| Admin platform configuration change | `admin.config_changed` + field name + old/new value hash |
| Provider listing added / modified / removed | `admin.provider_updated` + provider ID |
| Mediator PIN issued / revoked | `admin.pin_issued` / `admin.pin_revoked` + mediator ID |
| Health content module pulled / restored | `safety.content_pulled` / `safety.content_restored` + module ID |
| Mediator visit data accessed by admin | `mediator.admin_accessed_visits` + mediator ID + admin user ID |
| GDPR export or delete processed | `gdpr.export_processed` / `gdpr.delete_processed` + user ID hash |
| User data accessed for support | `admin.support_data_access` + user ID hash + reason |

### 6.2 Audit log access

- The audit log is readable only by the DPO, the clinical governance lead, and engineering on-call during an active SEV-1 incident.
- Admin users cannot read their own audit entries.
- The audit log cannot be edited or deleted by any user (including super-admin).

### 6.3 Admin change control

Any change to live platform configuration (via the Admin CMS) must:

1. Be made only by a user with the `admin` role in Supabase.
2. Require a re-authentication step for destructive operations (content removal, user data access).
3. Be logged automatically.
4. Be reviewable by the DPO within the audit log.

Changes to health content, safety rules, or clinical logic must follow the change control process in `docs/CLINICAL_SAFETY.md` section 5.2, regardless of whether the change is made via the admin CMS or a code deploy.

### 6.4 Monthly audit review

The DPO or operational lead reviews the `audit_log` monthly for:

- Anomalous access patterns (e.g. high volume of user data exports, mediator data accessed by multiple admins).
- Unexpected configuration changes.
- Safety event patterns.

Findings are documented in a monthly governance report.

---

## 7. Third-party processor obligations

All third-party processors (see `docs/PRIVACY.md` table) must:

- Have a Data Processing Agreement (DPA) in place with Redi Health.
- Process data only in EU regions, or have appropriate safeguards (SCCs) for non-EU processing.
- Be reviewed annually for compliance.

Current processors: OpenAI, Supabase, Neon, Sentry, Langfuse, PostHog, Resend, Upstash.

PII scrubbing before AI submission is implemented in `src/lib/ai/scrub.ts`. This scrub must cover: names, email addresses, phone numbers, physical addresses, national ID numbers, and dates of birth.

---

## 8. Breach response

See `docs/RUNBOOK.md` section "PII or health-data leak" for operational steps. Key obligations:

- **72 hours** from awareness of a breach to notification of the supervisory authority (GDPR Article 33).
- **DPO must be notified within 24 hours** of any confirmed or suspected breach.
- **Affected users must be notified** if the breach is likely to result in high risk to their rights and freedoms (GDPR Article 34).
- Breach documentation is retained for at least 3 years.
