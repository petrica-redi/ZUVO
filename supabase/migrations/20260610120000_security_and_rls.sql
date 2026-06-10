-- Workspace sync secret + row-level security for Supabase-hosted deployments.
-- App routes using Drizzle still enforce authorization server-side; RLS is the
-- database backstop when clients connect via Supabase PostgREST.

ALTER TABLE mediator_workspaces
  ADD COLUMN IF NOT EXISTS secret_hash text;

-- ── Enable RLS on user-data tables ─────────────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE mediator_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Users: own row only
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth_id = auth.uid());
CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth_id = auth.uid());

-- Health logs: own rows
CREATE POLICY health_logs_select_own ON health_logs
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY health_logs_insert_own ON health_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY health_logs_update_own ON health_logs
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY health_logs_delete_own ON health_logs
  FOR DELETE USING (user_id = auth.uid());

-- Progress: own rows
CREATE POLICY progress_select_own ON progress
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY progress_insert_own ON progress
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY progress_update_own ON progress
  FOR UPDATE USING (user_id = auth.uid());

-- Notifications: own rows
CREATE POLICY notifications_select_own ON notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY notifications_update_own ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Audit log: users read own entries; inserts via service role only
CREATE POLICY audit_log_select_own ON audit_log
  FOR SELECT USING (user_id = auth.uid());

-- Mediator workspaces: no direct client access (API + service role only)
CREATE POLICY mediator_workspaces_deny_all ON mediator_workspaces
  FOR ALL USING (false);

-- Providers: public read for directory
CREATE POLICY providers_public_read ON providers
  FOR SELECT USING (true);
