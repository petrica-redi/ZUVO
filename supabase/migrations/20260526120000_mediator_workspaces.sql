-- Mediator field workspace sync.
--
-- One row per mediator workspace. The workspace_id is a durable client-side
-- identifier (UUID), independent of the anonymous session id so that clearing
-- the anonymous browsing cookie does not orphan a mediator's case load.

CREATE TABLE IF NOT EXISTS mediator_workspaces (
  workspace_id text PRIMARY KEY,
  user_id uuid,
  county_code text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mediator_workspaces_user
  ON mediator_workspaces (user_id);

CREATE INDEX IF NOT EXISTS idx_mediator_workspaces_updated
  ON mediator_workspaces (updated_at DESC);
