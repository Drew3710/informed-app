-- =============================================================================
-- Migration: 2026-05-11_soft_data_tables (DOWN)
-- Purpose:   Reverse the soft-data table migration if needed
-- Author:    Andrew (with Claude)
-- Reverses:  2026-05-11_soft_data_tables_up.sql
-- =============================================================================
--
-- WHEN TO RUN THIS:
--   - If the up migration caused unexpected problems and you need to roll back
--   - If you decided one of the schema decisions was wrong and want to revisit
--
-- WHEN NOT TO RUN THIS:
--   - After any application code has been deployed that depends on the new schema
--   - After any production data has been written to the new columns
--   - Without taking a database backup first
--
-- SAFETY: Wrapped in a transaction. If any step fails, ALL changes roll back.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- REVERSE CHANGE 4: candidate_public_records → candidate_controversies
-- -----------------------------------------------------------------------------

-- Drop new columns added in the up migration.
ALTER TABLE IF EXISTS candidate_public_records DROP COLUMN IF EXISTS status;
ALTER TABLE IF EXISTS candidate_public_records DROP COLUMN IF EXISTS jurisdiction;
ALTER TABLE IF EXISTS candidate_public_records DROP COLUMN IF EXISTS document_url;
ALTER TABLE IF EXISTS candidate_public_records DROP COLUMN IF EXISTS record_type;

-- Reverse the date column rename.
ALTER TABLE IF EXISTS candidate_public_records
  RENAME COLUMN record_date TO date;

-- Restore the columns we dropped (with their original types/constraints).
ALTER TABLE IF EXISTS candidate_public_records
  ADD COLUMN IF NOT EXISTS verified BOOLEAN;

ALTER TABLE IF EXISTS candidate_public_records
  ADD COLUMN IF NOT EXISTS severity TEXT
    CHECK (severity IN ('minor', 'moderate', 'serious'));

-- Rename the table back.
ALTER TABLE IF EXISTS candidate_public_records
  RENAME TO candidate_controversies;


-- -----------------------------------------------------------------------------
-- REVERSE CHANGE 3: candidate_endorsements
-- -----------------------------------------------------------------------------
ALTER TABLE candidate_endorsements DROP COLUMN IF EXISTS verified_by;


-- -----------------------------------------------------------------------------
-- REVERSE CHANGE 2: candidate_policy_positions
-- -----------------------------------------------------------------------------
ALTER TABLE candidate_policy_positions DROP COLUMN IF EXISTS promise_specificity;
ALTER TABLE candidate_policy_positions DROP COLUMN IF EXISTS created_by;


-- -----------------------------------------------------------------------------
-- REVERSE CHANGE 1: candidate_summaries
-- -----------------------------------------------------------------------------
ALTER TABLE candidate_summaries DROP COLUMN IF EXISTS content_hash;


COMMIT;
