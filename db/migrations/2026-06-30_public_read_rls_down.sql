-- =============================================================================
-- Migration: 2026-06-30_public_read_rls (DOWN)
-- Purpose:   Reverse the public-read migration — drop the public_read policies
--            and disable RLS on the 11 public-data tables.
-- =============================================================================
--
-- NOTE: Disabling RLS here re-triggers the Supabase "RLS disabled" warnings but
-- does not expose private data (these tables are public by design). Safe to run
-- in development; prefer not to in production since it reverts the hardening.
--
-- SAFETY: Wrapped in a transaction. IDEMPOTENT via IF EXISTS.
-- =============================================================================

BEGIN;

DROP POLICY IF EXISTS public_read ON elections;
ALTER TABLE elections DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read ON election_deadlines;
ALTER TABLE election_deadlines DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read ON candidates;
ALTER TABLE candidates DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read ON candidate_bills;
ALTER TABLE candidate_bills DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read ON candidate_donations;
ALTER TABLE candidate_donations DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read ON candidate_stock_trades;
ALTER TABLE candidate_stock_trades DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read ON candidate_policy_positions;
ALTER TABLE candidate_policy_positions DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read ON candidate_endorsements;
ALTER TABLE candidate_endorsements DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read ON candidate_public_records;
ALTER TABLE candidate_public_records DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read ON candidate_summaries;
ALTER TABLE candidate_summaries DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read ON candidate_activity_log;
ALTER TABLE candidate_activity_log DISABLE ROW LEVEL SECURITY;

COMMIT;
