-- =============================================================================
-- Migration: 2026-06-30_public_read_rls (UP)
-- Purpose:   Enable Row-Level Security on the 11 public-data tables and grant a
--            read-only (SELECT) policy to everyone. Clears the remaining "RLS
--            disabled" dashboard warnings WITHOUT hiding public civic data.
-- Author:    Andrew (with Claude)
-- Reverses:  Run 2026-06-30_public_read_rls_down.sql
-- Pairs with: 2026-06-30_enable_rls_user_tables (run that one first)
-- =============================================================================
--
-- WHY: With RLS disabled, Supabase flags these tables as a risk. The correct
-- posture for PUBLIC civic data is: RLS on + an explicit public read policy +
-- NO public write policy. Result: the anon/publishable (browser) key can READ
-- everything, but cannot INSERT/UPDATE/DELETE. Data ingestion runs server-side
-- with the service_role key, which bypasses RLS and is unaffected.
--
-- TABLES (11): elections, election_deadlines, candidates, candidate_bills,
--   candidate_donations, candidate_stock_trades, candidate_policy_positions,
--   candidate_endorsements, candidate_public_records, candidate_summaries,
--   candidate_activity_log
--
-- SAFETY: Wrapped in a transaction. IDEMPOTENT (ENABLE RLS is a no-op if on;
--   each policy is dropped IF EXISTS before recreate). Re-running is safe.
-- =============================================================================

BEGIN;

-- One ENABLE + one public-read policy per table. The policy name is uniform so
-- it's easy to find/drop. `USING (true)` = every row is readable by anyone.

ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_read ON elections;
CREATE POLICY public_read ON elections FOR SELECT USING (true);

ALTER TABLE election_deadlines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_read ON election_deadlines;
CREATE POLICY public_read ON election_deadlines FOR SELECT USING (true);

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_read ON candidates;
CREATE POLICY public_read ON candidates FOR SELECT USING (true);

ALTER TABLE candidate_bills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_read ON candidate_bills;
CREATE POLICY public_read ON candidate_bills FOR SELECT USING (true);

ALTER TABLE candidate_donations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_read ON candidate_donations;
CREATE POLICY public_read ON candidate_donations FOR SELECT USING (true);

ALTER TABLE candidate_stock_trades ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_read ON candidate_stock_trades;
CREATE POLICY public_read ON candidate_stock_trades FOR SELECT USING (true);

ALTER TABLE candidate_policy_positions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_read ON candidate_policy_positions;
CREATE POLICY public_read ON candidate_policy_positions FOR SELECT USING (true);

ALTER TABLE candidate_endorsements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_read ON candidate_endorsements;
CREATE POLICY public_read ON candidate_endorsements FOR SELECT USING (true);

ALTER TABLE candidate_public_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_read ON candidate_public_records;
CREATE POLICY public_read ON candidate_public_records FOR SELECT USING (true);

ALTER TABLE candidate_summaries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_read ON candidate_summaries;
CREATE POLICY public_read ON candidate_summaries FOR SELECT USING (true);

ALTER TABLE candidate_activity_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_read ON candidate_activity_log;
CREATE POLICY public_read ON candidate_activity_log FOR SELECT USING (true);

COMMIT;
