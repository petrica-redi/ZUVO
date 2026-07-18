# Field OS — nurses & mediators (Romania + Italy)

Premium, low-training workspace for ~900 field professionals.

## First screen after login

**My shift** — three actions only:

1. **Open a case** (consent-gated, GDPR Art. 9)
2. **Explain & teach** → prescriptions / literacy tools
3. **Refer or escalate** → clinic / nurse / supervisor

Plus persistent tools: Chatbot · AI search · Prescriptions.

## Geography

- **Romania:** județ / ECI counties  
- **Italy:** ASL regions (Lazio, Lombardia, …)

Stored on `staff_accounts.country_code` + `region_code` and field session.

## Bulk onboarding

Admin → `/admin/dashboard/accounts` → **Bulk invite**

CSV: `email,name,role,country,region`

Roles: `mediator` | `nurse` | `doctor` | `manager` | …

Invite email → `/auth/register?invite=TOKEN` → verify → approve.

## Doctor alignment

Supervisors / doctors get a **Visit pack for doctor** — copy/download structured handoff (not an EMR).

## Compliance hooks

- Consent checkbox required before case notes  
- Audit actions: `staff.bulk_invite`, `staff.invite_accepted`, `field.case_opened_with_consent`  
- Cron purge: hard-delete queue + 24-month audit prune  

## Migration

`supabase/migrations/20260718200000_field_os_scale.sql`
