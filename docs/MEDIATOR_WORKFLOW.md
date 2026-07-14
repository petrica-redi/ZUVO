# Mediator workflow guide — Phase 1 operational core

This guide covers the navigation case-management workflow added in Phase 1 of the operational platform. It supplements the existing POIDS field workspace (visits, sessions, legacy cases).

## Who this is for

Authorised **community health mediators** and supervisors using `/mediator` on mobile or desktop.

## What mediators do (and do not do)

- **Do:** facilitate access to services, assess non-clinical barriers, assign tasks, coordinate appointments, record navigation outcomes.
- **Do not:** diagnose, prescribe, or provide autonomous clinical decisions. Emergency cases must be directed to **112** immediately.

## Daily workflow

### 1. Overview tab

Check:

- Urgent navigation cases
- Tasks due today and overdue tasks
- Recent home visits

Quick actions: log a visit, open a navigation case, open tasks.

### 2. Navigation tab

**Open a case** when a person needs help accessing healthcare:

1. Enter a **pseudonym or code** (not full identity unless your organisation policy requires it).
2. Select **category** (e.g. GP registration, insurance, vaccination).
3. Set **urgency**. If emergency, confirm the person has been told to call 112.
4. Select **barriers** — the system suggests non-clinical next actions.
5. Save — a case number is generated (`REDI-RO-YYYY-#####`).

Update status as the case progresses through the lifecycle (New → Assessment → Provider search → … → Completed).

### 3. Tasks tab

Tasks are created automatically from barriers or manually:

- Filter: all active, due today, overdue
- Mark complete when done
- Link tasks to cases where relevant

### 4. POIDS cases tab (legacy)

Continue using the existing case form for POIDS / SCI reporting (health, social, education, rights categories).

### 5. Public help requests

Community members can submit requests at `/help`. Mediators with database access can list and convert intake requests to navigation cases via the API (`GET /api/operations/intake`, `POST /api/operations/intake/[id]/convert`).

## Offline use

Navigation cases and tasks are stored locally first (`localStorage`) and sync to the database when online and `DATABASE_URL` is configured.

## Audit trail

Case creation, status changes, task creation/completion, intake submission, and intake conversion are logged in `audit_log`.

## Permissions

Operational data is scoped to the mediator **workspace ID**. Other workspaces cannot access your cases unless they are a system administrator.

## Known limitations (Phase 1)

- Provider directory verification, referrals, and appointments are Phase 2.
- Notifications are not yet wired for task reminders.
- Ministry dashboards do not yet show live operational indicators.
- Cross-border handover is Phase 5.

See `docs/OPERATIONAL_PLATFORM_PLAN.md` for the full roadmap.
