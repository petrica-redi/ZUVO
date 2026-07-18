# Staff registration & role approval

Self-service accounts for Redi Health staff (email or Google), with Resend verification and admin role assignment.

## Flow

1. User opens `/auth/register` (or Continues with Google).
2. **Email path:** account created as `pending_verification` → Resend sends verification link → `/auth/verify?token=…` → status becomes `pending_approval`.
3. **Google path:** Supabase OAuth → `/[locale]/auth/callback` → `staff_accounts` upsert as `pending_approval` (email already verified by Google).
4. Admin (`ADMIN_EMAIL`, typically `petrica@redi-ngo.eu`) signs into CMS → **Staff accounts** → `/admin/dashboard/accounts`.
5. Admin **Approves** and assigns a role: `professor` | `mediator` | `nurse` | `doctor` | `manager` | `administrator`.
6. User signs in at `/auth/login`. Approved field-capable roles receive a `field_session` and land in `/mediator`. Administrators matching `ADMIN_EMAIL` also receive the CMS session.

Pilot roster login (`FIELD_STAFF_ROSTER` at `/mediator/login`) remains available as a parallel path.

## Production checklist

| Item | Notes |
|------|--------|
| Run migration `supabase/migrations/20260718120000_staff_accounts.sql` | Via `node scripts/run-migrations.mjs` with `DATABASE_URL` |
| `RESEND_API_KEY` | Required or verification emails fail |
| `RESEND_FROM_EMAIL` | Verified domain in Resend |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` | CMS approval gate |
| Supabase Google provider | Redirect: `https://redi.healthcare/<locale>/auth/callback` |
| `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client OAuth |

## Roles → workspace

| Staff role | After login |
|------------|-------------|
| mediator, nurse, doctor, manager | Field workspace (`/mediator`) |
| administrator | `/admin/dashboard` (+ field session as supervisor); CMS cookie only if email = `ADMIN_EMAIL` |
| professor | `/students` |

## Related code

- `src/lib/staff/*` — register, verify, login, OAuth upsert, approve/reject
- `src/app/[locale]/auth/*` — UI routes
- `src/components/admin/AccountApprovalPanel.tsx` — CMS approvals
- `src/lib/staff/emails.ts` — Resend templates (notify admin + applicant)
