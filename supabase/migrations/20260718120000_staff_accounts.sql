-- Staff accounts: self-registration, email verification, admin role approval

CREATE TABLE IF NOT EXISTS staff_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text,
  display_name text NOT NULL DEFAULT '',
  auth_provider text NOT NULL DEFAULT 'email', -- email | google
  supabase_auth_id uuid UNIQUE,
  email_verified_at timestamptz,
  verification_token text,
  verification_expires_at timestamptz,
  status text NOT NULL DEFAULT 'pending_verification',
  -- pending_verification | pending_approval | approved | rejected
  role text,
  -- professor | mediator | nurse | doctor | manager | administrator (null until approved)
  workspace_id text,
  county_code text,
  rejection_reason text,
  approved_at timestamptz,
  approved_by text,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staff_accounts_status ON staff_accounts (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_staff_accounts_verification ON staff_accounts (verification_token)
  WHERE verification_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_staff_accounts_role ON staff_accounts (role)
  WHERE role IS NOT NULL;
