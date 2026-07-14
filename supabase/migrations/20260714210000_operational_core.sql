-- Phase 1: Operational core — case management, tasks, intake, consent, geography
-- Health-access navigation platform (not clinical records)

-- ── Configurable geography ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS geography_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_type text NOT NULL CHECK (node_type IN ('country', 'region', 'county', 'municipality', 'settlement')),
  parent_id uuid REFERENCES geography_nodes(id) ON DELETE SET NULL,
  country_code text NOT NULL,
  code text,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_geography_country ON geography_nodes(country_code, node_type);

-- ── Organisations & teams ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS organisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  org_type text NOT NULL DEFAULT 'ngo',
  country_code text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  name text NOT NULL,
  region_code text,
  languages jsonb NOT NULL DEFAULT '[]',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Configurable case categories (admin-managed) ───────────────────────────
CREATE TABLE IF NOT EXISTS case_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label_key text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  organisation_id uuid REFERENCES organisations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Barrier reference types ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS barrier_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label_key text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

-- ── Households & beneficiaries (pseudonymised) ───────────────────────────
CREATE TABLE IF NOT EXISTS households (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code text NOT NULL,
  country_code text NOT NULL,
  municipality_code text,
  organisation_id uuid REFERENCES organisations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pseudonym text NOT NULL,
  household_id uuid REFERENCES households(id) ON DELETE SET NULL,
  preferred_language text NOT NULL DEFAULT 'ro',
  contact_method text,
  contact_value text,
  country_code text NOT NULL,
  municipality_code text,
  organisation_id uuid REFERENCES organisations(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_beneficiaries_org ON beneficiaries(organisation_id);

-- ── Navigation cases ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS navigation_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text NOT NULL UNIQUE,
  workspace_id text NOT NULL,
  beneficiary_id uuid REFERENCES beneficiaries(id) ON DELETE SET NULL,
  household_id uuid REFERENCES households(id) ON DELETE SET NULL,
  beneficiary_pseudonym text NOT NULL DEFAULT '',
  responsible_mediator_id text,
  team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
  organisation_id uuid REFERENCES organisations(id) ON DELETE SET NULL,
  country_code text NOT NULL DEFAULT 'RO',
  municipality_code text,
  preferred_language text NOT NULL DEFAULT 'ro',
  contact_method text,
  consent_status text NOT NULL DEFAULT 'pending',
  source text NOT NULL DEFAULT 'mediator_dashboard',
  category_slug text NOT NULL DEFAULT 'other',
  main_problem text NOT NULL DEFAULT '',
  urgency text NOT NULL DEFAULT 'routine' CHECK (urgency IN ('routine', 'priority', 'urgent', 'emergency')),
  status text NOT NULL DEFAULT 'new',
  next_action text,
  target_date date,
  notes text NOT NULL DEFAULT '',
  barriers jsonb NOT NULL DEFAULT '[]',
  barrier_notes text,
  metadata jsonb NOT NULL DEFAULT '{}',
  opened_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_cases_workspace ON navigation_cases(workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_cases_org ON navigation_cases(organisation_id, status);
CREATE INDEX IF NOT EXISTS idx_cases_urgency ON navigation_cases(urgency) WHERE status NOT IN ('completed', 'closed_incomplete', 'cancelled');

-- ── Case status history ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS case_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES navigation_cases(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  changed_by text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_case_history ON case_status_history(case_id, created_at);

-- ── Operational tasks ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS operation_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES navigation_cases(id) ON DELETE CASCADE,
  workspace_id text NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  task_type text NOT NULL DEFAULT 'other',
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'waiting', 'blocked', 'completed', 'cancelled')),
  priority text NOT NULL DEFAULT 'routine' CHECK (priority IN ('routine', 'priority', 'urgent')),
  assignee text,
  created_by text,
  due_date date,
  reminder_date date,
  depends_on uuid REFERENCES operation_tasks(id) ON DELETE SET NULL,
  completion_evidence text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON operation_tasks(workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_case ON operation_tasks(case_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due ON operation_tasks(due_date) WHERE status NOT IN ('completed', 'cancelled');

-- ── Field visits (operational) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS field_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id text NOT NULL,
  case_id uuid REFERENCES navigation_cases(id) ON DELETE SET NULL,
  mediator_ref text,
  beneficiary_pseudonym text,
  visit_date timestamptz NOT NULL DEFAULT now(),
  location text,
  purpose text NOT NULL DEFAULT '',
  consent_confirmed boolean NOT NULL DEFAULT false,
  barriers_identified jsonb NOT NULL DEFAULT '[]',
  actions_completed text,
  referrals_initiated text,
  follow_up_required boolean NOT NULL DEFAULT false,
  next_contact_date date,
  observations text NOT NULL DEFAULT '',
  outcome text,
  sync_status text NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('draft', 'synced')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_visits_workspace ON field_visits(workspace_id, visit_date);

-- ── Consent records ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS consent_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id) ON DELETE SET NULL,
  case_id uuid REFERENCES navigation_cases(id) ON DELETE SET NULL,
  purpose text NOT NULL,
  version text NOT NULL DEFAULT '1.0',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'granted', 'withdrawn', 'expired')),
  granted_at timestamptz,
  withdrawn_at timestamptz,
  captured_by text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Intake / help requests ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS intake_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code text NOT NULL UNIQUE,
  preferred_language text NOT NULL DEFAULT 'ro',
  contact_method text NOT NULL,
  contact_value text,
  country_code text NOT NULL DEFAULT 'RO',
  municipality_code text,
  help_type text NOT NULL,
  consent_granted boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'routed', 'assigned', 'converted', 'closed')),
  routed_team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
  converted_case_id uuid REFERENCES navigation_cases(id) ON DELETE SET NULL,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_intake_status ON intake_requests(status, country_code);

-- ── Seed default case categories ───────────────────────────────────────────
INSERT INTO case_categories (slug, label_key, sort_order) VALUES
  ('gp_registration', 'operations.categoryGpRegistration', 1),
  ('insurance_entitlement', 'operations.categoryInsurance', 2),
  ('maternity', 'operations.categoryMaternity', 3),
  ('child_health', 'operations.categoryChildHealth', 4),
  ('vaccination', 'operations.categoryVaccination', 5),
  ('chronic_disease', 'operations.categoryChronic', 6),
  ('screening', 'operations.categoryScreening', 7),
  ('dental', 'operations.categoryDental', 8),
  ('mental_health', 'operations.categoryMentalHealth', 9),
  ('medication_access', 'operations.categoryMedication', 10),
  ('disability_support', 'operations.categoryDisability', 11),
  ('administrative_docs', 'operations.categoryAdministrative', 12),
  ('emergency_followup', 'operations.categoryEmergencyFollowup', 13),
  ('hospital_discharge', 'operations.categoryHospitalDischarge', 14),
  ('cross_border', 'operations.categoryCrossBorder', 15),
  ('other', 'operations.categoryOther', 99)
ON CONFLICT (slug) DO NOTHING;

-- ── Seed barrier types ─────────────────────────────────────────────────────
INSERT INTO barrier_types (slug, label_key, sort_order) VALUES
  ('no_gp', 'operations.barrierNoGp', 1),
  ('no_insurance', 'operations.barrierNoInsurance', 2),
  ('missing_documents', 'operations.barrierMissingDocs', 3),
  ('language', 'operations.barrierLanguage', 4),
  ('digital_literacy', 'operations.barrierDigital', 5),
  ('transport', 'operations.barrierTransport', 6),
  ('childcare', 'operations.barrierChildcare', 7),
  ('mobility', 'operations.barrierMobility', 8),
  ('financial', 'operations.barrierFinancial', 9),
  ('discrimination', 'operations.barrierDiscrimination', 10),
  ('fear_trust', 'operations.barrierFear', 11),
  ('negative_experience', 'operations.barrierNegativeExperience', 12),
  ('missed_appointment', 'operations.barrierMissedAppt', 13),
  ('unstable_housing', 'operations.barrierHousing', 14),
  ('cross_border', 'operations.barrierCrossBorder', 15),
  ('no_phone_internet', 'operations.barrierNoContact', 16),
  ('medication_understanding', 'operations.barrierMedication', 17),
  ('other', 'operations.barrierOther', 99)
ON CONFLICT (slug) DO NOTHING;

-- ── Seed default organisation (REDI) ─────────────────────────────────────
INSERT INTO organisations (id, name, org_type, country_code)
VALUES ('00000000-0000-4000-8000-000000000001', 'REDI Health', 'ngo', 'RO')
ON CONFLICT DO NOTHING;
