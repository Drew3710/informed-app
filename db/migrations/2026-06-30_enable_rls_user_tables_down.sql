-- =============================================================================
-- Migration: 2026-06-30_enable_rls_user_tables (DOWN)
-- Purpose:   Reverse the user-table RLS migration — drop the owner-only
--            policies and disable Row-Level Security on the five user-scoped
--            tables. Also drops the interim duplicate policy names, if present.
-- =============================================================================
--
-- ⚠️ SECURITY WARNING: Disabling RLS re-exposes user data to the
-- anon/publishable (browser) key. DO NOT run this in any environment with real
-- users or real data. It exists only to restore the pre-migration state during
-- local development.
--
-- SAFETY: Wrapped in a transaction. IDEMPOTENT via IF EXISTS.
-- =============================================================================

BEGIN;

-- users
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS users_select_own ON users;            -- interim, if present
DROP POLICY IF EXISTS users_update_own ON users;            -- interim, if present
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- voter_registrations
DROP POLICY IF EXISTS "Users can view own registrations" ON voter_registrations;
DROP POLICY IF EXISTS "Users can insert own registrations" ON voter_registrations;
DROP POLICY IF EXISTS "Users can update own registrations" ON voter_registrations;
DROP POLICY IF EXISTS "Users can delete own registrations" ON voter_registrations;
DROP POLICY IF EXISTS voter_registrations_owner_all ON voter_registrations;  -- interim
ALTER TABLE voter_registrations DISABLE ROW LEVEL SECURITY;

-- tracked_candidates
DROP POLICY IF EXISTS "Users can view own tracked candidates" ON tracked_candidates;
DROP POLICY IF EXISTS "Users can insert own tracked candidates" ON tracked_candidates;
DROP POLICY IF EXISTS "Users can update own tracked candidates" ON tracked_candidates;
DROP POLICY IF EXISTS "Users can delete own tracked candidates" ON tracked_candidates;
DROP POLICY IF EXISTS tracked_candidates_owner_all ON tracked_candidates;    -- interim
ALTER TABLE tracked_candidates DISABLE ROW LEVEL SECURITY;

-- user_promises_tracker
DROP POLICY IF EXISTS "Users can view own promise tracking" ON user_promises_tracker;
DROP POLICY IF EXISTS "Users can insert own promise tracking" ON user_promises_tracker;
DROP POLICY IF EXISTS "Users can update own promise tracking" ON user_promises_tracker;
DROP POLICY IF EXISTS "Users can delete own promise tracking" ON user_promises_tracker;
DROP POLICY IF EXISTS user_promises_tracker_owner_all ON user_promises_tracker;  -- interim
ALTER TABLE user_promises_tracker DISABLE ROW LEVEL SECURITY;

-- user_notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON user_notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON user_notifications;
DROP POLICY IF EXISTS user_notifications_select_own ON user_notifications;    -- interim
DROP POLICY IF EXISTS user_notifications_update_own ON user_notifications;    -- interim
ALTER TABLE user_notifications DISABLE ROW LEVEL SECURITY;

COMMIT;
