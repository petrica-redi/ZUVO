# MoU deployment readiness — Romania field staff

This document describes what is required to run Redi Health as a **deployment platform** for health mediators, community nurses (AMC), and case managers under an MoU with the Ministry of Health and Ministry of Labour.

## What changed (code)

1. **Named field login** — `/mediator/login` gated by `FIELD_STAFF_ROSTER`
2. **No hardcoded admin secrets in production** — `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` required
3. **Client role spoofing removed** — `x-operations-role` ignored; role from field session / DB
4. **Intake inbox scoped** — only intakes routed to the actor’s workspace
5. **Demo seed no longer overwrites field workspaces**
6. **Romanian emergency red-flag patterns** for 112 bypass
7. **Visits link to navigation cases**; consent on case create
8. **Honest offline messaging** for referrals/appointments
9. **Impact dashboard** no longer mixes demo county numbers into “live”
10. **POIDS cases** labelled separately from navigation cases

## Required production environment

```bash
# Admin CMS
ADMIN_EMAIL="..."
ADMIN_PASSWORD="..."          # strong, unique
ADMIN_SESSION_SECRET="..."    # dedicated HMAC secret (32+ chars)

# Field staff sessions
FIELD_SESSION_SECRET="..."    # dedicated HMAC secret
FIELD_STAFF_PEPPER="..."      # password hash pepper

# Roster JSON (array). Passwords hashed at boot with pepper.
FIELD_STAFF_ROSTER='[
  {
    "email": "maria.popescu@judet.ro",
    "password": "temporary-strong-password",
    "displayName": "Maria Popescu",
    "role": "mediator",
    "workspaceId": "ws-b-mediator-001",
    "countyCode": "B"
  },
  {
    "email": "ana.ionescu@judet.ro",
    "password": "temporary-strong-password",
    "displayName": "Ana Ionescu",
    "role": "nurse",
    "workspaceId": "ws-b-nurse-001",
    "countyCode": "B"
  },
  {
    "email": "ion.georgescu@judet.ro",
    "password": "temporary-strong-password",
    "displayName": "Ion Georgescu",
    "role": "case_manager",
    "workspaceId": "ws-b-cm-001",
    "countyCode": "B"
  }
]'

DATABASE_URL="..."
SASTIPE_STRICT_ENV=1
```

Roles: `mediator` | `nurse` | `case_manager` | `supervisor`

## Pilot checklist (1 județ)

- [ ] Set all secrets above in Vercel Production
- [ ] Load roster for pilot staff; distribute temporary passwords
- [ ] Create routing rules so `/help` intakes notify the correct `workspaceId`
- [ ] Train staff: Inbox → open case → log visit (linked) → tasks → referral (online)
- [ ] Confirm POIDS/SCI export path under More → Raportare POIDS / SCI
- [ ] Disable public demo persona seeding on field devices
- [ ] Verify `/impact` shows live zeros rather than illustrative figures when aggregates unavailable

## Still required from ministries / ops (outside this PR)

- Ministry SSO / eIDAS (current roster is MoU-pilot identity)
- Official MS/MMSS indicator template sign-off
- DPIA / DPO closure
- RLS policies on operational tables (API scoping is in place; DB RLS still recommended)
- Scale testing for 900 concurrent users
