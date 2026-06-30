-- =============================================================================
-- Migration: 2026-06-30_enable_rls_user_tables (UP)
-- Purpose:   Enable Row-Level Security and define owner-only policies on the
--            five user-scoped tables. Clears the Supabase RLS dashboard
--            warnings and is sequenced BEFORE the first Vercel deploy.
-- Author:    Andrew (with Claude)
-- Reverses:  Run 2026-06-30_enable_rls_user_tables_down.sql
-- =============================================================================
--
-- HISTORY / WHY THIS FILE LOOKS LIKE IT DOES:
--   When first applied, the live DB was found to ALREADY contain a set of
--   plain-English policies ("Users can view own ...", etc.), created in an
--   earlier session that was never committed to this repo. An interim version
--   of this migration added a parallel set (`*_owner_all`, `*_select_own`,
--   `*_update_own`) which duplicated them. Those interim policies were dropped.
--   This file now reproduces the CANONICAL final state: RLS on + the
--   plain-English policy set. It also drops the interim names so re-running
--   from any prior state converges to the same clean result.
--
-- MODEL: ownership is matched against auth.uid().
--   - users.id IS the auth user id (this table extends auth.users).
--   - the other four tables carry a user_id column referencing that id.
--   - service_role bypasses RLS (backend/system writes are unaffected).
--
-- SAFETY: Wrapped in a transaction. IDEMPOTENT — every policy is dropped
--   IF EXISTS before being (re)created, and ENABLE RLS is a no-op if already on.
-- =============================================================================

BEGIN;

-- Drop any interim duplicate policies from the superseded version of this
-- migration (no-ops if they don't exist).
DROP POLICY IF EXISTS users_select_own ON users;
DROP POLICY IF EXISTS users_update_own ON users;
DROP POLICY IF EXISTS voter_registrations_owner_all ON voter_registrations;
DROP POLICY IF EXISTS tracked_candidates_owner_all ON tracked_candidates;
DROP POLICY IF EXISTS user_promises_tracker_owner_all ON user_promises_tracker;
DROP POLICY IF EXISTS user_notifications_select_own ON user_notifications;
DROP POLICY IF EXISTS user_notifications_update_own ON user_notifications;

-- -----------------------------------------------------------------------------
-- 1 of 5: users  — read/update own row only. Rows are created by the Supabase
-- auth sign-up flow (service_role); deletion is handled through auth.
-- -----------------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- 2 of 5: voter_registrations  — full owner access (view/insert/update/delete).
-- -----------------------------------------------------------------------------
ALTER TABLE voter_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own registrations" ON voter_registrations;
CREATE POLICY "Users can view own registrations" ON voter_registrations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own registrations" ON voter_registrations;
CREATE POLICY "Users can insert own registrations" ON voter_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own registrations" ON voter_registrations;
CREATE POLICY "Users can update own registrations" ON voter_registrations
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own registrations" ON voter_registrations;
CREATE POLICY "Users can delete own registrations" ON voter_registrations
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 3 of 5: tracked_candidates  — full owner access.
-- -----------------------------------------------------------------------------
ALTER TABLE tracked_candidates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tracked candidates" ON tracked_candidates;
CREATE POLICY "Users can view own tracked candidates" ON tracked_candidates
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own tracked candidates" ON tracked_candidates;
CREATE POLICY "Users can insert own tracked candidates" ON tracked_candidates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tracked candidates" ON tracked_candidates;
CREATE POLICY "Users can update own tracked candidates" ON tracked_candidates
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own tracked candidates" ON tracked_candidates;
CREATE POLICY "Users can delete own tracked candidates" ON tracked_candidates
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 4 of 5: user_promises_tracker  — full owner access.
-- -----------------------------------------------------------------------------
ALTER TABLE user_promises_tracker ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own promise tracking" ON user_promises_tracker;
CREATE POLICY "Users can view own promise tracking" ON user_promises_tracker
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own promise tracking" ON user_promises_tracker;
CREATE POLICY "Users can insert own promise tracking" ON user_promises_tracker
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own promise tracking" ON user_promises_tracker;
CREATE POLICY "Users can update own promise tracking" ON user_promises_tracker
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own promise tracking" ON user_promises_tracker;
CREATE POLICY "Users can delete own promise tracking" ON user_promises_tracker
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 5 of 5: user_notifications  — read + update (mark-as-read) own rows.
-- INSERTs are system-generated (service_role, bypasses RLS); no INSERT/DELETE
-- policy is granted to the browser client.
-- -----------------------------------------------------------------------------
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON user_notifications;
CREATE POLICY "Users can view own notifications" ON user_notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON user_notifications;
CREATE POLICY "Users can update own notifications" ON user_notifications
  FOR UPDATE USING (auth.uid() = user_id);

COMMIT;
