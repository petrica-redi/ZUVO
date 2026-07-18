-- Field OS scale: org binding, invites, geography, approver flags
-- Safe to re-run (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS patterns).

ALTER TABLE staff_accounts
  ADD COLUMN IF NOT EXISTS organisation_id uuid REFERENCES organisations(id),
  ADD COLUMN IF NOT EXISTS country_code text NOT NULL DEFAULT 'RO',
  ADD COLUMN IF NOT EXISTS region_code text,
  ADD COLUMN IF NOT EXISTS can_approve boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS invited_by text;

CREATE INDEX IF NOT EXISTS idx_staff_accounts_org
  ON staff_accounts (organisation_id, status);

CREATE INDEX IF NOT EXISTS idx_staff_accounts_country
  ON staff_accounts (country_code, region_code);

CREATE TABLE IF NOT EXISTS staff_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  display_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'mediator',
  organisation_id uuid REFERENCES organisations(id),
  country_code text NOT NULL DEFAULT 'RO',
  region_code text,
  token text NOT NULL UNIQUE,
  invited_by text NOT NULL,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staff_invites_email ON staff_invites (email);
CREATE INDEX IF NOT EXISTS idx_staff_invites_token ON staff_invites (token);

-- Seed default organisations for RO + IT field programmes (idempotent by name).
INSERT INTO organisations (name, org_type, country_code)
SELECT 'Redi Romania — ECI field', 'ngo', 'RO'
WHERE NOT EXISTS (
  SELECT 1 FROM organisations WHERE name = 'Redi Romania — ECI field'
);

INSERT INTO organisations (name, org_type, country_code)
SELECT 'Redi Italy — mediatore sanitario', 'ngo', 'IT'
WHERE NOT EXISTS (
  SELECT 1 FROM organisations WHERE name = 'Redi Italy — mediatore sanitario'
);
