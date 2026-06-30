# Migration: 2026-06-30 Enable RLS on user-scoped tables

## What this migration does

Enables Row-Level Security (RLS) and defines **owner-only** policies on the five
user-scoped tables, matched against `auth.uid()`. This clears the active Supabase
RLS dashboard warnings and is sequenced **before the first Vercel deploy**.

| Table                   | RLS | Browser-key (anon) policies                  |
|-------------------------|-----|----------------------------------------------|
| `users`                 | ON  | view, update own row (`auth.uid() = id`)     |
| `voter_registrations`   | ON  | view, insert, update, delete own rows        |
| `tracked_candidates`    | ON  | view, insert, update, delete own rows        |
| `user_promises_tracker` | ON  | view, insert, update, delete own rows        |
| `user_notifications`    | ON  | view, update own rows                        |

Pairs with `2026-06-30_public_read_rls` (public read on the 11 public-data
tables). Together they put all 16 tables under RLS.

## ⚠️ History — read this before re-running

This migration was **reconciled after first application**. When first run against
the live Supabase DB, those five tables **already had** a set of plain-English
policies (`"Users can view own ..."`, etc.) created in an earlier session that
was never committed here. An interim version of this script added a *parallel*
set (`*_owner_all`, `*_select_own`, `*_update_own`), creating duplicates. The
duplicates were verified harmless (same `auth.uid()` ownership check) and then
dropped.

This file now reflects the **canonical final state**: RLS on + the plain-English
policy set. It is idempotent and also drops the interim names, so running it from
any prior state converges to the same clean result. The live DB and this file are
in sync as of 2026-06-30.

### How access works

- `users.id` **is** the auth user id (the table extends `auth.users`); the other
  four tables carry a `user_id` referencing it.
- The **`service_role`** key bypasses RLS. Backend / system writes (e.g.
  system-generated `user_notifications`) are unaffected — RLS only constrains the
  anon/publishable (browser) key.
- For UPDATE policies, Postgres reuses the `USING` condition as the write-check
  when `WITH CHECK` is omitted, so a user cannot reassign a row to another user.
- No browser INSERT/DELETE on `users` (auth-managed) or `user_notifications`
  (system-generated).

## Applying

1. Supabase Studio → SQL Editor → paste `2026-06-30_enable_rls_user_tables_up.sql`
   → **Run**. (Or `psql "$DATABASE_URL" -f ...`)

## Verification (matches the live state as confirmed on 2026-06-30)

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname='public'
  AND tablename IN ('users','voter_registrations','tracked_candidates',
                    'user_promises_tracker','user_notifications')
ORDER BY tablename, policyname;
```

Expect only the plain-English policies:
- `tracked_candidates` — 4 (view/insert/update/delete)
- `user_promises_tracker` — 4
- `voter_registrations` — 4
- `users` — 2 (view/update)
- `user_notifications` — 2 (view/update)

No `*_owner_all` / `*_select_own` / `*_update_own` rows should appear.

## Rollback

`..._down.sql` drops the policies and disables RLS. **Do NOT run in production** —
it re-exposes user data to the browser key. Development-only.
