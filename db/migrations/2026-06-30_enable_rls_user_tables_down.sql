-- =============================================================================
-- Migration: 2026-06-30_enable_rls_user_tables (DOWN)
-- Purpose:   Reverse the RLS migration — drop the owner-only policies and
--            disable Row-Level Security on the five user-scoped tables.
-- =============================================================================
--
-- ⚠️ SECURITY WARNING: Disabling RLS re-exposes user data to the
-- anon/publishable (browser) key. DO NOT run this in any environment that has
-- real user data or is reachable by real users. It exists only to restore the
-- exact pre-migration state during local development.
--
-- SAFETY: Wrapped in a transaction. IDEMPOTENT via IF EXISTS.
-- =============================================================================

BEGIN;

-- 1 of 5: users
DROP POLICY IF EXISTS users_select_own ON users;
DROP POLICY IF EXISTS users_update_own ON users;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2 of 5: voter_registrations
DROP POLICY IF EXISTS voter_registrations_owner_all ON voter_registrations;
ALTER TABLE voter_registrations DISABLE ROW LEVEL SECURITY;

-- 3 of 5: tracked_candidates
DROP POLICY IF EXISTS tracked_candidates_owner_all ON tracked_candidates;
ALTER TABLE tracked_candidates DISABLE ROW LEVEL SECURITY;

-- 4 of 5: user_promises_tracker
DROP POLICY IF EXISTS user_promises_tracker_owner_all ON user_promises_tracker;
ALTER TABLE user_promises_tracker DISABLE ROW LEVEL SECURITY;

-- 5 of 5: user_notifications
DROP POLICY IF EXISTS user_notifications_select_own ON user_notifications;
DROP POLICY IF EXISTS user_notifications_update_own ON user_notifications;
ALTER TABLE user_notifications DISABLE ROW LEVEL SECURITY;

COMMIT;
