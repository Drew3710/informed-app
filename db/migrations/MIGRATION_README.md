# Migration: 2026-05-11 Soft-Data Tables

## What this migration does

Captures four schema decisions made on 2026-05-11 covering the four soft-data
tables in the Informed app schema:

| Table                          | Change                                                |
|--------------------------------|-------------------------------------------------------|
| `candidate_summaries`          | Add `content_hash` for content-addressed caching       |
| `candidate_policy_positions`   | Add `created_by` + `promise_specificity`               |
| `candidate_endorsements`       | Add `verified_by`                                      |
| `candidate_controversies`      | Rename to `candidate_public_records` + restructure     |

For the full reasoning behind each decision, see Claude's project memory or
the session notes from 2026-05-11.

## Files

- **`2026-05-11_soft_data_tables_up.sql`** — applies all four changes
- **`2026-05-11_soft_data_tables_down.sql`** — reverses all four changes

## Before applying

1. **Take a backup of your Supabase database.**
   - In Supabase Studio: Project Settings → Database → Backups
   - For free-tier Supabase, daily backups are kept for 7 days. Confirm a recent
     backup exists before running this migration.

2. **Confirm `candidate_controversies` is empty.**
   ```sql
   SELECT COUNT(*) FROM candidate_controversies;
   ```
   Expected result: `0`. If non-zero, STOP and revisit the migration —
   the up script assumes empty and drops columns without preserving data.

3. **Read the up migration end-to-end.** Don't trust any SQL — including
   SQL written with AI assistance — without reading every line and
   understanding what it does.

## Applying the migration

### Option A: Supabase Studio SQL Editor (recommended for first run)

1. Open Supabase Studio → SQL Editor
2. Paste the contents of `2026-05-11_soft_data_tables_up.sql`
3. Click "Run"
4. Verify the transaction committed (no error messages)
5. Run the verification queries below

### Option B: psql command line

```bash
psql "$DATABASE_URL" -f 2026-05-11_soft_data_tables_up.sql
```

## Verification queries (run after applying)

```sql
-- Verify content_hash exists on candidate_summaries
SELECT column_name FROM information_schema.columns
  WHERE table_name = 'candidate_summaries' AND column_name = 'content_hash';
-- Expected: 1 row returned

-- Verify the two new columns on candidate_policy_positions
SELECT column_name FROM information_schema.columns
  WHERE table_name = 'candidate_policy_positions'
    AND column_name IN ('created_by', 'promise_specificity');
-- Expected: 2 rows returned

-- Verify verified_by exists on candidate_endorsements
SELECT column_name FROM information_schema.columns
  WHERE table_name = 'candidate_endorsements' AND column_name = 'verified_by';
-- Expected: 1 row returned

-- Verify candidate_controversies has been renamed
SELECT table_name FROM information_schema.tables
  WHERE table_name IN ('candidate_controversies', 'candidate_public_records');
-- Expected: only 'candidate_public_records' returned

-- Verify the new columns on candidate_public_records
SELECT column_name FROM information_schema.columns
  WHERE table_name = 'candidate_public_records'
    AND column_name IN ('record_type', 'document_url', 'jurisdiction', 'status', 'record_date');
-- Expected: 5 rows returned

-- Verify the removed columns are gone
SELECT column_name FROM information_schema.columns
  WHERE table_name = 'candidate_public_records'
    AND column_name IN ('severity', 'verified');
-- Expected: 0 rows returned
```

## If something goes wrong

The up migration is wrapped in a transaction. If any step fails, Postgres
will automatically roll back ALL changes — you'll be back to the pre-migration
state with no partial damage.

If the migration committed successfully but you want to reverse it:

```bash
psql "$DATABASE_URL" -f 2026-05-11_soft_data_tables_down.sql
```

**Do NOT run the down migration** if:
- Application code has been deployed that reads from the new columns
- Production data has been written to the new columns
- More than a week has passed (take a fresh backup and consider whether you really want to do this)

## What's NOT in this migration

Deferred to future migrations:

- ENUM types and normalization for `candidate_bills` (queued from last session)
- Indexes on the new columns (add when query patterns are known)
- Row-Level Security (RLS) policies — next session's work
- Application code updates referencing `candidate_public_records` instead of
  `candidate_controversies`
