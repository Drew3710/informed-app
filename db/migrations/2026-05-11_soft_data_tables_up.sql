-- =============================================================================
-- Migration: 2026-05-11_soft_data_tables (UP)
-- Purpose:   Apply all four soft-data table decisions from May 2026 session
-- Author:    Andrew (with Claude)
-- Reverses:  Run 2026-05-11_soft_data_tables_down.sql
-- =============================================================================
--
-- WHAT THIS MIGRATION DOES (4 changes, one per soft-data table decision):
--
--   1. candidate_summaries: ADD content_hash column for content-addressed caching
--   2. candidate_policy_positions: ADD created_by + promise_specificity columns
--   3. candidate_endorsements: ADD verified_by column
--   4. candidate_controversies: RENAME to candidate_public_records + restructure
--
-- SAFETY: Wrapped in a transaction. If any step fails, ALL changes roll back.
-- IDEMPOTENT: Uses IF NOT EXISTS / IF EXISTS so re-running is safe.
-- =============================================================================

BEGIN;  -- Start transaction. Nothing is committed until COMMIT at the end.

-- -----------------------------------------------------------------------------
-- CHANGE 1 of 4: candidate_summaries
-- Add content_hash for content-addressed cache invalidation.
-- When the hash of the underlying source data changes, regenerate the summary.
-- -----------------------------------------------------------------------------
ALTER TABLE candidate_summaries
  ADD COLUMN IF NOT EXISTS content_hash TEXT;

COMMENT ON COLUMN candidate_summaries.content_hash IS
  'SHA-256 hash of the source data used to generate this summary. '
  'Used for cache invalidation: regenerate summary when hash of current '
  'underlying data does not match this stored hash.';


-- -----------------------------------------------------------------------------
-- CHANGE 2 of 4: candidate_policy_positions
-- Add two columns supporting the manual-first + Phase 3 eval strategy:
--   created_by: tracks whether each position was hand-curated or AI-extracted
--   promise_specificity: tags how trackable each promise is
-- -----------------------------------------------------------------------------
ALTER TABLE candidate_policy_positions
  ADD COLUMN IF NOT EXISTS created_by TEXT
    CHECK (created_by IN ('manual', 'ai_extracted', 'ai_extracted_verified'));

ALTER TABLE candidate_policy_positions
  ADD COLUMN IF NOT EXISTS promise_specificity TEXT
    CHECK (promise_specificity IN ('specific', 'directional', 'vague'));

COMMENT ON COLUMN candidate_policy_positions.created_by IS
  'How this row was created. manual = hand-curated by team. '
  'ai_extracted = AI-proposed, not yet reviewed. '
  'ai_extracted_verified = AI-proposed AND human-approved.';

COMMENT ON COLUMN candidate_policy_positions.promise_specificity IS
  'How trackable this promise is. '
  'specific = "I will introduce legislation X" (matchable to bills). '
  'directional = "I support expanded healthcare" (matchable to votes). '
  'vague = "I care about families" (not trackable, exclude from eval).';


-- -----------------------------------------------------------------------------
-- CHANGE 3 of 4: candidate_endorsements
-- Add verified_by column tracking the data source for each endorsement.
-- Supports the phased-B2 strategy (Claude search now, Ballotpedia later).
-- -----------------------------------------------------------------------------
ALTER TABLE candidate_endorsements
  ADD COLUMN IF NOT EXISTS verified_by TEXT
    CHECK (verified_by IN ('manual', 'claude_web_search', 'ballotpedia'));

COMMENT ON COLUMN candidate_endorsements.verified_by IS
  'Source path that confirmed this endorsement. '
  'manual = hand-verified by team. '
  'claude_web_search = AI-extracted with source URL validation. '
  'ballotpedia = pulled from Ballotpedia (added in Phase 2 if needed).';


-- -----------------------------------------------------------------------------
-- CHANGE 4 of 4: candidate_controversies → candidate_public_records
-- Reframe table to "Public Record Items" methodology.
-- Only official-record items (indictments, convictions, ethics findings, etc.)
-- Removes editorial judgment columns; adds primary-document requirement.
--
-- SAFETY NOTE: Confirmed empty before migration. No data preservation needed.
-- -----------------------------------------------------------------------------

-- Step 4a: Rename the table itself.
ALTER TABLE IF EXISTS candidate_controversies
  RENAME TO candidate_public_records;

-- Step 4b: Drop the columns we no longer want.
-- 'severity' was editorial judgment. 'verified' is replaced by document_url
-- requirement (if there's a document, it's verified; if not, the row doesn't exist).
ALTER TABLE candidate_public_records
  DROP COLUMN IF EXISTS severity;

ALTER TABLE candidate_public_records
  DROP COLUMN IF EXISTS verified;

-- Step 4c: Rename 'date' to 'record_date' for clarity (date is also a Postgres keyword).
ALTER TABLE candidate_public_records
  RENAME COLUMN date TO record_date;

-- Step 4d: Add the new columns.
ALTER TABLE candidate_public_records
  ADD COLUMN IF NOT EXISTS record_type TEXT
    CHECK (record_type IN (
      'indictment',
      'conviction',
      'ethics_finding',
      'civil_judgment',
      'censure',
      'fec_violation'
    ));

ALTER TABLE candidate_public_records
  ADD COLUMN IF NOT EXISTS document_url TEXT;  -- Made NOT NULL below after backfill window

ALTER TABLE candidate_public_records
  ADD COLUMN IF NOT EXISTS jurisdiction TEXT;

ALTER TABLE candidate_public_records
  ADD COLUMN IF NOT EXISTS status TEXT
    CHECK (status IN ('pending', 'concluded', 'overturned', 'dismissed'));

-- Step 4e: Document the methodology directly on the table.
-- This appears in any tool that inspects the DB (TablePlus, Supabase Studio, etc.)
-- and is the canonical place for the methodology statement.
COMMENT ON TABLE candidate_public_records IS
  'Official-record items only. Methodology: a row exists ONLY when backed by '
  'an official document (court filing, ethics report, FEC settlement, etc.) '
  'in document_url. No news-reported scandals. No severity judgments. '
  'See docs/METHODOLOGY.md for the full rubric.';

COMMENT ON COLUMN candidate_public_records.record_type IS
  'Category of official record. Each value corresponds to a specific kind of '
  'government or court document. Adding new values requires a methodology review.';

COMMENT ON COLUMN candidate_public_records.document_url IS
  'URL to the PRIMARY document (court filing, ethics report, FEC settlement). '
  'Load-bearing: if no document_url is available, the row should not exist. '
  'This is the verification mechanism (no separate verified boolean needed).';

COMMENT ON COLUMN candidate_public_records.status IS
  'Current state of the record. pending = filed but not concluded. '
  'concluded = final judgment reached. overturned = reversed on appeal. '
  'dismissed = dropped without prejudice or with prejudice.';


-- -----------------------------------------------------------------------------
-- Migration complete. Commit the transaction.
-- -----------------------------------------------------------------------------
COMMIT;
