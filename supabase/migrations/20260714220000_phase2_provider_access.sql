-- Phase 2: Provider access — verification, referrals, appointments, attendance
-- Health-access navigation platform (not clinical records)

-- ── Extend providers with verification and operational fields ────────────────
ALTER TABLE providers
  ADD COLUMN IF NOT EXISTS country_code text DEFAULT 'RO',
  ADD COLUMN IF NOT EXISTS municipality_code text,
  ADD COLUMN IF NOT EXISTS verification_state text NOT NULL DEFAULT 'unverified'
    CHECK (verification_state IN ('unverified', 'pending', 'verified', 'expired', 'suspended', 'rejected')),
  ADD COLUMN IF NOT EXISTS category_slugs jsonb NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS contact_person text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS accessibility_notes text,
  ADD COLUMN IF NOT EXISTS organisation_id uuid REFERENCES organisations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_providers_verification ON providers(verification_state, country_code);
CREATE INDEX IF NOT EXISTS idx_providers_municipality ON providers(municipality_code) WHERE municipality_code IS NOT NULL;

-- ── Provider verification audit trail ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS provider_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  verification_state text NOT NULL
    CHECK (verification_state IN ('unverified', 'pending', 'verified', 'expired', 'suspended', 'rejected')),
  verified_by text,
  notes text,
  expires_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_provider_verifications ON provider_verifications(provider_id, created_at);

-- ── Referrals (case → provider navigation handoff) ─────────────────────────
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_number text NOT NULL UNIQUE,
  workspace_id text NOT NULL,
  case_id uuid NOT NULL REFERENCES navigation_cases(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'acknowledged', 'scheduled', 'completed', 'declined', 'cancelled')),
  purpose text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  initiated_by text,
  scheduled_follow_up date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referrals_workspace ON referrals(workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_referrals_case ON referrals(case_id);

-- ── Appointments (coordination, not clinical booking) ────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id text NOT NULL,
  case_id uuid NOT NULL REFERENCES navigation_cases(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE RESTRICT,
  referral_id uuid REFERENCES referrals(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested', 'confirmed', 'reminder_sent', 'completed', 'missed', 'cancelled', 'rescheduled')),
  appointment_date date NOT NULL,
  appointment_time text,
  location text,
  accompaniment_required boolean NOT NULL DEFAULT false,
  interpretation_required boolean NOT NULL DEFAULT false,
  reminder_sent_at timestamptz,
  notes text NOT NULL DEFAULT '',
  created_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_appointments_workspace ON appointments(workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_appointments_case ON appointments(case_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date) WHERE status NOT IN ('completed', 'cancelled');

-- ── Attendance outcomes (follow-up workflow) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  outcome text NOT NULL
    CHECK (outcome IN ('attended', 'missed', 'partial', 'rescheduled', 'cancelled_provider', 'cancelled_beneficiary', 'no_show')),
  follow_up_required boolean NOT NULL DEFAULT false,
  follow_up_action text,
  next_appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
  notes text NOT NULL DEFAULT '',
  recorded_by text,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attendance_appointment ON attendance_outcomes(appointment_id, recorded_at);

-- ── Seed verification for existing providers ───────────────────────────────
UPDATE providers
SET verification_state = 'verified',
    country_code = COALESCE(country_code, 'RO'),
    category_slugs = CASE type
      WHEN 'clinic' THEN '["gp_registration","vaccination","child_health"]'::jsonb
      WHEN 'hospital' THEN '["emergency_followup","hospital_discharge","chronic_disease"]'::jsonb
      WHEN 'maternity' THEN '["maternity"]'::jsonb
      WHEN 'mental_health' THEN '["mental_health"]'::jsonb
      WHEN 'dental' THEN '["dental"]'::jsonb
      WHEN 'mediator_office' THEN '["administrative_docs","insurance_entitlement"]'::jsonb
      ELSE '["other"]'::jsonb
    END
WHERE verification_state = 'unverified' AND verified_at IS NOT NULL;

INSERT INTO provider_verifications (provider_id, verification_state, verified_by, notes)
SELECT id, 'verified', 'system_seed', 'Migrated from existing verified_at'
FROM providers
WHERE verified_at IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM provider_verifications pv WHERE pv.provider_id = providers.id
  );
