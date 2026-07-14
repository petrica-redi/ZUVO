-- Phase 4: Structured outcomes, programme indicators, restricted exports, data-quality flags

-- ── Structured case outcomes ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS case_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES navigation_cases(id) ON DELETE CASCADE,
  workspace_id text NOT NULL,
  outcome_type text NOT NULL CHECK (outcome_type IN (
    'gp_registered',
    'appointment_attended',
    'appointment_booked',
    'insurance_obtained',
    'vaccination_completed',
    'screening_completed',
    'referral_completed',
    'documents_obtained',
    'entitlement_confirmed',
    'other'
  )),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'achieved', 'not_achieved', 'unknown')),
  achieved_at timestamptz,
  notes text NOT NULL DEFAULT '',
  evidence_ref text,
  recorded_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_case_outcomes_case_type
  ON case_outcomes(case_id, outcome_type);
CREATE INDEX IF NOT EXISTS idx_case_outcomes_workspace
  ON case_outcomes(workspace_id, outcome_type, status);
CREATE INDEX IF NOT EXISTS idx_case_outcomes_achieved
  ON case_outcomes(outcome_type, achieved_at) WHERE status = 'achieved';

-- ── Data-quality flags for supervisors ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS quality_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES navigation_cases(id) ON DELETE SET NULL,
  workspace_id text NOT NULL,
  flag_type text NOT NULL CHECK (flag_type IN (
    'missing_outcome',
    'stale_case',
    'missing_consent',
    'duplicate_entry',
    'incomplete_barriers',
    'overdue_followup',
    'no_recent_contact'
  )),
  severity text NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'critical')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved', 'dismissed')),
  message text NOT NULL DEFAULT '',
  raised_by text,
  resolved_by text,
  resolved_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quality_flags_workspace
  ON quality_flags(workspace_id, status, severity);
CREATE INDEX IF NOT EXISTS idx_quality_flags_case
  ON quality_flags(case_id) WHERE case_id IS NOT NULL;

-- ── Restricted export audit log ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS data_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by text NOT NULL,
  role text NOT NULL,
  export_type text NOT NULL CHECK (export_type IN (
    'outcomes_aggregate',
    'outcomes_workspace',
    'cases_workspace',
    'quality_report'
  )),
  scope text NOT NULL DEFAULT 'workspace' CHECK (scope IN ('workspace', 'organisation', 'national')),
  row_count integer NOT NULL DEFAULT 0,
  includes_identifiable boolean NOT NULL DEFAULT false,
  file_name text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_data_exports_role
  ON data_exports(role, export_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_exports_requester
  ON data_exports(requested_by, created_at DESC);
