-- =============================================================================
-- Migration: 2026-06-30_enable_rls_user_tables (UP)
-- Purpose:   Enable Row-Level Security and add owner-only policies on the five
--            user-scoped tables. Clears the active Supabase RLS dashboard
--            warnings and is sequenced BEFORE the first Vercel deploy.
-- Author:    Andrew (with Claude)
-- Reverses:  Run 2026-06-30_enable_rls_user_tables_down.sql
-- =============================================================================
--
-- WHAT THIS MIGRATION DOES:
--   Enables RLS and creates owner-only access policies on:
--     1. users                  (SELECT/UPDATE own row only)
--     2. voter_registrations    (full owner access)
--     3. tracked_candidates     (full owner access)
--     4. user_promises_tracker  (full owner access)
--     5. user_notifications     (SELECT/UPDATE own; inserts come from system)
--
-- MODEL: Ownership is matched against auth.uid() (the authenticated user's id).
--   - users.id IS the auth user id (this table extends auth.users).
--   - the other four tables carry a user_id column referencing that id.
--
-- WHO BYPASSES RLS: the service_role key bypasses RLS entirely. Server-side /
--   backend writes (e.g. system-generated notifications) use service_role and
--   are unaffected. RLS only constrains the anon/publishable (browser) key.
--
-- SAFETY: Wrapped in a transaction. If any step fails, ALL changes roll back.
-- IDEMPOTENT: ENABLE RLS is a no-op if already on; every policy is dropped
--   with IF EXISTS before being recreated, so re-running is safe.
--
-- ⚠️ ASSUMPTION TO VERIFY before running: the four non-users tables each have a
--   column named exactly `user_id` of type uuid. If a name differs, adjust the
--   USING/WITH CHECK clauses below to match. Run the inventory query in the
--   README first.
-- =============================================================================

BEGIN;  -- Start transaction. Nothing is committed until COMMIT at the end.

-- -----------------------------------------------------------------------------
-- 1 of 5: users
-- A user may read and update only their own row. No INSERT/DELETE policy:
-- rows are created by the Supabase auth sign-up flow (service_role), and
-- account deletion is handled through auth, not the browser client.
-- -----------------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_select_own ON users;
CREATE POLICY users_select_own ON users
  FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS users_update_own ON users;
CREATE POLICY users_update_own ON users
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- -----------------------------------------------------------------------------
-- 2 of 5: voter_registrations  — full owner access (the user owns these rows)
-- -----------------------------------------------------------------------------
ALTER TABLE voter_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS voter_registrations_owner_all ON voter_registrations;
CREATE POLICY voter_registrations_owner_all ON voter_registrations
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 3 of 5: tracked_candidates  — full owner access
-- -----------------------------------------------------------------------------
ALTER TABLE tracked_candidates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tracked_candidates_owner_all ON tracked_candidates;
CREATE POLICY tracked_candidates_owner_all ON tracked_candidates
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 4 of 5: user_promises_tracker  — full owner access
-- -----------------------------------------------------------------------------
ALTER TABLE user_promises_tracker ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_promises_tracker_owner_all ON user_promises_tracker;
CREATE POLICY user_promises_tracker_owner_all ON user_promises_tracker
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 5 of 5: user_notifications
-- A user may read and update (e.g. mark-as-read) only their own notifications.
-- INSERTs are produced by the system (service_role, which bypasses RLS), so no
-- INSERT policy is granted to the browser client. No DELETE policy either —
-- if user-side dismissal/delete is wanted later, add an explicit DELETE policy.
-- -----------------------------------------------------------------------------
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_notifications_select_own ON user_notifications;
CREATE POLICY user_notifications_select_own ON user_notifications
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS user_notifications_update_own ON user_notifications;
CREATE POLICY user_notifications_update_own ON user_notifications
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Migration complete. Commit the transaction.
-- -----------------------------------------------------------------------------
COMMIT;
