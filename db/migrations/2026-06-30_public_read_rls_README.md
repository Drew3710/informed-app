# Migration: 2026-06-30 Public-read RLS on public-data tables

## What this migration does

Enables Row-Level Security on the **11 public-data tables** and grants a single
read-only policy (`public_read`, `FOR SELECT USING (true)`) to everyone. This
clears the remaining "RLS disabled" dashboard warnings **without hiding** any
public civic data.

Run **after** `2026-06-30_enable_rls_user_tables`. Together the two migrations
put every one of the 16 tables under RLS.

| Posture                | Tables | Browser (anon) key can…           |
|------------------------|--------|-----------------------------------|
| Owner-only (other migration) | 5  | read/write only their own rows    |
| **Public read (this one)**   | 11 | **read all rows; cannot write**   |

### Why this is the right posture

Public civic data should be readable by anyone, but only written by the backend.
RLS on + a `SELECT` policy + **no** write policy gives exactly that: the
anon/publishable (browser) key can `SELECT` everything and cannot
`INSERT/UPDATE/DELETE`. Data ingestion runs server-side with the `service_role`
key, which bypasses RLS and is unaffected.

### Tables covered (11)

`elections`, `election_deadlines`, `candidates`, `candidate_bills`,
`candidate_donations`, `candidate_stock_trades`, `candidate_policy_positions`,
`candidate_endorsements`, `candidate_public_records`, `candidate_summaries`,
`candidate_activity_log`.

> If your DB still has `candidate_controversies` (i.e. the earlier rename
> migration was not applied), this script will error on that line. Apply the
> soft-data migration first, or temporarily skip that table.

## Applying

1. Open Supabase Studio → SQL Editor.
2. Paste the contents of `2026-06-30_public_read_rls_up.sql`.
3. Click **Run**; confirm the transaction committed with no errors.

(Or via psql: `psql "$DATABASE_URL" -f 2026-06-30_public_read_rls_up.sql`)

## Verification queries

```sql
-- All 11 tables now have RLS on
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname IN ('elections','election_deadlines','candidates','candidate_bills',
                  'candidate_donations','candidate_stock_trades',
                  'candidate_policy_positions','candidate_endorsements',
                  'candidate_public_records','candidate_summaries',
                  'candidate_activity_log')
ORDER BY relname;
-- Expected: 11 rows, all relrowsecurity = true

-- Each has exactly one SELECT policy named public_read
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public' AND policyname = 'public_read'
ORDER BY tablename;
-- Expected: 11 rows, cmd = SELECT
```

## Rollback

`2026-06-30_public_read_rls_down.sql` drops the policies and disables RLS. Safe
in development (these tables are public anyway); avoid in production since it
reverts the hardening and re-triggers the dashboard warnings.
