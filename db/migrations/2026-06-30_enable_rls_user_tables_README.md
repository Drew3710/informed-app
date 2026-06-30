# Migration: 2026-06-30 Enable RLS on user-scoped tables

## What this migration does

Enables Row-Level Security (RLS) and adds **owner-only** access policies on the
five user-scoped tables. This clears the active Supabase RLS dashboard warnings
and is sequenced **before the first Vercel deploy** (the top queued item in
`CLAUDE.md`).

| Table                   | RLS | Browser-key (anon) access granted        |
|-------------------------|-----|------------------------------------------|
| `users`                 | ON  | SELECT, UPDATE own row (`id = auth.uid()`) |
| `voter_registrations`   | ON  | ALL own rows (`user_id = auth.uid()`)    |
| `tracked_candidates`    | ON  | ALL own rows                             |
| `user_promises_tracker` | ON  | ALL own rows                             |
| `user_notifications`    | ON  | SELECT, UPDATE own rows                  |

Public-data tables (`elections`, `candidates`, and the candidate_* data tables)
are intentionally **not** touched — they stay readable. If those still show
"RLS disabled" warnings, the intended pattern is RLS-on + a public read-only
`SELECT USING (true)` policy; that's a separate, follow-up migration.

### How access works

- Ownership is matched against `auth.uid()` — the id of the currently
  authenticated Supabase user.
- `users.id` **is** the auth user id (the table extends `auth.users`); the other
  four tables carry a `user_id` column referencing it.
- The **`service_role`** key bypasses RLS entirely. Server-side / backend writes
  (e.g. system-generated `user_notifications`) use `service_role` and are
  unaffected — RLS only constrains the anon/publishable (browser) key.
- No browser INSERT/DELETE on `users` or `user_notifications`: user rows come
  from the auth sign-up flow, and notifications are system-generated. Add
  explicit policies later if user-side delete/dismiss is wanted.

## ⚠️ Before applying — verify the column assumption

The migration assumes each non-`users` table has a column named exactly
`user_id` of type `uuid`. Confirm first:

```sql
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('voter_registrations','tracked_candidates',
                     'user_promises_tracker','user_notifications')
  AND column_name = 'user_id'
ORDER BY table_name;
-- Expected: 4 rows, all data_type = uuid
```

If any name differs, edit the `USING` / `WITH CHECK` clauses in the up script to
match before running. Also take a Supabase backup first (Project Settings →
Database → Backups).

## Applying the migration

### Option A: Supabase Studio SQL Editor (recommended)

1. Open Supabase Studio → SQL Editor.
2. Paste the contents of `2026-06-30_enable_rls_user_tables_up.sql`.
3. Click **Run**, confirm the transaction committed with no errors.
4. Run the verification queries below.

### Option B: psql

```bash
psql "$DATABASE_URL" -f 2026-06-30_enable_rls_user_tables_up.sql
```

## Verification queries (run after applying)

```sql
-- RLS is enabled on all five tables (rowsecurity = true)
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname IN ('users','voter_registrations','tracked_candidates',
                  'user_promises_tracker','user_notifications')
ORDER BY relname;
-- Expected: 5 rows, all relrowsecurity = true

-- Policies exist on each table
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('users','voter_registrations','tracked_candidates',
                    'user_promises_tracker','user_notifications')
ORDER BY tablename, policyname;
-- Expected: users(2), voter_registrations(1), tracked_candidates(1),
--           user_promises_tracker(1), user_notifications(2)
```

After this, also do a quick behavioral check: signed in as user A with the
browser/anon client, confirm you can read your own rows and cannot read user
B's rows.

## Rollback

`2026-06-30_enable_rls_user_tables_down.sql` drops the policies and disables RLS.

**Do NOT run the down migration** in any environment with real users or real
data — it re-exposes user data to the browser key. It exists only to restore the
exact pre-migration state during local development.

## Not in this migration (deferred)

- Public-read RLS policies for `elections` / `candidates` / candidate_* tables.
- Security headers (HSTS, CSP) — app/edge config, not SQL.
- Indexes on `user_id` columns (add when query patterns are known).
