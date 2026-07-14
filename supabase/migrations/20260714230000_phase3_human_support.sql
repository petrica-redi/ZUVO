-- Phase 3: Human support & notifications
-- Callback/intake routing, in-app + email notifications, escalations, missed-appointment recovery

-- ── Routing rules (geography + language + help type → team) ─────────────────
CREATE TABLE IF NOT EXISTS routing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid REFERENCES organisations(id) ON DELETE CASCADE,
  country_code text NOT NULL,
  municipality_code text,
  preferred_language text,
  help_type text,
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  notify_workspace_id text,
  priority integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_routing_rules_lookup
  ON routing_rules(country_code, is_active, priority DESC);

-- ── Workspace notification preferences ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS notification_preferences (
  workspace_id text PRIMARY KEY,
  email_enabled boolean NOT NULL DEFAULT true,
  in_app_enabled boolean NOT NULL DEFAULT true,
  notify_email text,
  preferred_locale text NOT NULL DEFAULT 'ro',
  intake_alerts boolean NOT NULL DEFAULT true,
  escalation_alerts boolean NOT NULL DEFAULT true,
  missed_appointment_alerts boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── Workspace-scoped operational notifications ─────────────────────────────
CREATE TABLE IF NOT EXISTS operation_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id text NOT NULL,
  notification_type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  is_read boolean NOT NULL DEFAULT false,
  email_sent boolean NOT NULL DEFAULT false,
  email_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_op_notif_workspace
  ON operation_notifications(workspace_id, is_read, created_at DESC);

-- ── Supervisor escalation queue ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS escalation_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES navigation_cases(id) ON DELETE SET NULL,
  intake_id uuid REFERENCES intake_requests(id) ON DELETE SET NULL,
  workspace_id text NOT NULL,
  escalated_by text NOT NULL,
  assigned_supervisor text,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'acknowledged', 'resolved', 'dismissed')),
  priority text NOT NULL DEFAULT 'priority'
    CHECK (priority IN ('routine', 'priority', 'urgent', 'emergency')),
  resolution_notes text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_escalations_workspace
  ON escalation_records(workspace_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_escalations_open
  ON escalation_records(status) WHERE status IN ('open', 'acknowledged');

-- ── Seed default teams for routing ─────────────────────────────────────────
INSERT INTO teams (id, organisation_id, name, region_code, languages)
VALUES
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'REDI Bucharest', 'B', '["ro","en"]'),
  ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', 'REDI Cluj', 'CJ', '["ro","hu","en"]'),
  ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', 'REDI Timiș', 'TM', '["ro","en"]')
ON CONFLICT DO NOTHING;

-- ── Seed default routing rules ─────────────────────────────────────────────
INSERT INTO routing_rules (organisation_id, country_code, municipality_code, preferred_language, help_type, team_id, priority)
VALUES
  ('00000000-0000-4000-8000-000000000001', 'RO', NULL, 'ro', NULL, '00000000-0000-4000-8000-000000000101', 0),
  ('00000000-0000-4000-8000-000000000001', 'RO', 'B', NULL, NULL, '00000000-0000-4000-8000-000000000101', 10),
  ('00000000-0000-4000-8000-000000000001', 'RO', 'CJ', NULL, NULL, '00000000-0000-4000-8000-000000000102', 10),
  ('00000000-0000-4000-8000-000000000001', 'RO', 'TM', NULL, NULL, '00000000-0000-4000-8000-000000000103', 10),
  ('00000000-0000-4000-8000-000000000001', 'RO', NULL, 'en', 'language_support', '00000000-0000-4000-8000-000000000101', 20),
  ('00000000-0000-4000-8000-000000000001', 'RO', NULL, NULL, 'callback', '00000000-0000-4000-8000-000000000101', 5),
  ('00000000-0000-4000-8000-000000000001', 'RO', NULL, NULL, 'missed_appointment', '00000000-0000-4000-8000-000000000101', 15)
ON CONFLICT DO NOTHING;
