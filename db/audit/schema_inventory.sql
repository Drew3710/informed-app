-- =============================================================================
-- Schema inventory / health check  (READ-ONLY — safe to run anytime)
-- =============================================================================
-- Purpose: snapshot the live Supabase schema so it can be diffed against
--          docs/DATABASE_SCHEMA.md and the RLS migrations. Nothing is modified.
--
-- HOW TO USE: run each numbered block separately in the Supabase SQL Editor
-- (it returns one result grid per block), or run the whole file via psql. Paste
-- the results back to review for drift.
-- =============================================================================

-- 1. TABLE INVENTORY + RLS STATUS ---------------------------------------------
-- Expect 16 tables. relrowsecurity should be true on all of them after both
-- 2026-06-30 RLS migrations are applied.
SELECT c.relname        AS table_name,
       c.relrowsecurity  AS rls_enabled,
       s.n_live_tup      AS approx_rows
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_stat_user_tables s ON s.relid = c.oid
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY c.relname;

-- 2. RLS POLICIES --------------------------------------------------------------
-- Expect: 5 user tables with owner-only policies, 11 public tables with
-- public_read. A table with rls_enabled = true but NO policy here is locked
-- down to nobody (anon can't read it) — investigate if unexpected.
SELECT tablename, policyname, cmd, qual AS using_expr, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. COLUMNS PER TABLE ---------------------------------------------------------
-- Diff against docs/DATABASE_SCHEMA.md to catch added/missing/renamed columns
-- (e.g. confirm content_hash, created_by, promise_specificity, verified_by,
-- record_type/document_url/jurisdiction/status, and the controversies rename).
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 4. FOREIGN KEYS --------------------------------------------------------------
-- The relationship map. Confirms e.g. candidate_activity_log -> user_notifications
-- chain and that user tables reference the auth user id.
SELECT tc.table_name        AS from_table,
       kcu.column_name      AS from_column,
       ccu.table_name       AS to_table,
       ccu.column_name      AS to_column,
       tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
ORDER BY from_table, from_column;

-- 5. INDEXES -------------------------------------------------------------------
-- Confirms the indexes documented in DATABASE_SCHEMA.md exist and flags the
-- queued candidate_bills index audit.
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
