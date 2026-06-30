# CLAUDE.md — Informed App

Persistent project context for AI assistants (Claude Code and others). Lives at
the repo root so it loads every session. Keep it short and current; prune stale
lines as the project moves.

## What this is

**Informed** is an open-source, non-profit-first civic-transparency web app for
U.S. voters, focused on the **November 2026 elections** with **Virginia races**
as the primary v1 target. MIT-licensed (commercial use permitted, but the
mission is civic good). Three core functions:

1. **Register** — zip code → upcoming elections, deadlines, official
   registration portal links, polling info.
2. **Research** — candidate profiles (legislative record, finance, policy
   positions, endorsements, public records), AI plain-language summaries with
   citations, and side-by-side comparison.
3. **Track** — post-election accountability: monitor officials' activity vs.
   campaign promises, with notifications.

Mission constraints that shape every change: **unbiased** (official sources, not
opinion — cite the primary source), **transparent** (every claim links to source
data), **privacy-first** (collect the minimum; never sell or share user data),
**nonpartisan** (no formal co-branding with political orgs for the first
12–18 months).

## Builder context (read before suggesting anything)

- **Solo builder, self-described non-coder working with AI assistance.** Explain
  what code does and why — don't just emit it. Favor understanding over
  cleverness.
- **Four goals:** (1) learn AI-assisted coding and understand what's written,
  (2) launch a usable app by Nov 2026, (3) reach funding-readiness, (4) build an
  AI/eval portfolio (see Phase 3).
- **Cost rule:** stay on free tiers; zero cost until funding exists. Flag
  anything that would push past a free-tier limit *before* doing it.
- **UI bar:** highly usable, clean, objective-oriented. Treat UI quality as a
  first-class requirement, not polish.
- **Cadence:** planned pause July 2026 · refinement September 2026 · marketing
  push November 2026. Prefer ending a session on a clean, verified win over
  starting the next task depleted.

## ⚠️ README vs. reality

`README.md` describes the *target* architecture (Express backend,
`components/`/`hooks/`/`pages/` folders, many `docs/*.md`, full API
integrations). **Most of that does not exist yet.** Trust this file and the
actual tree over the README. What exists today:

```
informed-app/
├── frontend/                  # The only running code. Next.js 16 + React 19 (App Router)
│   ├── app/
│   │   ├── page.tsx           # THE ENTIRE APP — ~600 lines, one client component
│   │   ├── layout.tsx         # Root layout + site metadata
│   │   ├── globals.css        # @tailwind directives (utilities largely unused — see Styling)
│   │   └── api/
│   │       ├── elections/route.ts  # zip → upcoming elections (Google Civic, server-side)
│   │       └── test-db/route.ts    # Supabase connectivity smoke-test endpoint
│   ├── lib/supabase.ts        # Supabase browser client (publishable/anon key)
│   ├── lib/civic.ts           # Google Civic API client (SERVER ONLY — secret key)
│   ├── next.config.ts         # Security headers (HSTS, CSP, etc.) for all routes
│   └── package.json           # name is "frontend-next"
├── backend/                   # EMPTY (.gitkeep only). No Express server exists yet.
├── db/migrations/             # SQL migrations + per-migration READMEs
├── docs/DATABASE_SCHEMA.md    # 16-table schema reference (the only real doc)
├── .env.example               # Env var template (no secrets)
├── README.md                  # Aspirational — see warning above
└── SECURITY_TODOS.md          # Empty placeholder
```

No backend, no test suite, no real API integration, and no auth flow are wired
up yet. The frontend renders entirely from in-file mock data.

## Frontend architecture (read before editing `page.tsx`)

`frontend/app/page.tsx` is a single `"use client"` component that is the whole
app. Conventions to respect:

- **State-based routing, not file routing.** Navigation is `useState` (`page`,
  `params`) plus a `navigate(page, params)` helper — not Next.js routes or
  `next/link`. Add a screen by adding a page component and a
  `{page === "x" && <XPage .../>}` branch in `InformedApp`; nav buttons call
  `navigate(...)`.
- **Inline styles + a `theme` object.** All styling is inline `style={{...}}`
  referencing the `theme` color constants at the top of the file. Tailwind v4 is
  installed and `globals.css` imports `@tailwind` directives, but the app does
  **not** use utility classes (the only `className` is `animate-spin`). Match
  the inline-style approach and reuse `theme.*` colors instead of hardcoding hex
  values.
- **Mock data drives everything.** `MOCK_RACES`, `MOCK_CANDIDATES` (typed via the
  `CandidateData` interface) supply all content. **Always render
  `<SampleDataBanner />`** on any screen showing placeholder data, and keep
  source attributions ("Source: FEC.gov", "GovTrack.us", etc.) — they mark where
  real data will come from.
- **Reuse shared building blocks:** `FadeIn`, `PartyBadge`, `StatusBadge`,
  `BackButton`, `SampleDataBanner`, `HoverCard`, and the `Icons` object (inline
  SVGs).
- **Vertical slices, not horizontal layers.** Every unit of work should produce
  something visible in the running app; DB changes ride inside the slice that
  first needs them. If `page.tsx` grows unwieldy, propose a split before a large
  refactor.

## Stack (current — supersedes older setup docs)

| Layer    | Tech                                  | Notes |
|----------|---------------------------------------|-------|
| Frontend | Next.js **16.2.4** (App Router), React 19, TypeScript | Older "Next 14" docs are stale (upgraded April 2026) |
| Styling  | Tailwind v4 installed; app uses inline styles + `theme` | |
| DB/Auth  | Supabase (free tier)                  | Client in `lib/supabase.ts`; **16-table schema retained** (7-table simplification was abandoned) |
| AI       | Claude API                            | Summarization/reasoning over curated data **only — never fact retrieval** |
| Deploy   | Vercel (free tier)                    | Not yet deployed |
| Mobile   | PWA-first                             | Capacitor wrapping deferred until post-funding |

Repo: `Drew3710/informed-app`. Default to the latest Claude models for any AI
features (e.g. `claude-opus-4-8`).

## Architectural principles (load-bearing)

- **Curated data is the moat.** Deterministic, hand-curated structured data is
  the product's edge. The Claude API summarizes/reasons *over* it; it never
  fetches facts. This also gives the Phase 3 eval clean inputs.
- **Official records only** (`candidate_public_records`): indictments,
  convictions, ethics findings, FEC violations, civil judgments, censures — each
  with a required `document_url`. No news scandals, no severity editorializing.
  This is a publishable methodology principle.
- **Pre-flight before destructive ops.** Before any `DROP`/`ALTER`, run an
  FK-dependency query (`information_schema.table_constraints` +
  `key_column_usage` + `constraint_column_usage`, filtered to `FOREIGN KEY`,
  `table_schema='public'`) to see what depends on the object.
- **Don't trust SQL blindly** — including AI-written SQL. Read every line and
  confirm preconditions before it's run.

## Development workflow

All commands run from `frontend/` (the only npm project):

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — run before pushing significant changes
npm run lint     # ESLint (next/core-web-vitals + TypeScript)
npm start        # serve a production build
```

There is **no test runner configured.** Verify changes by running `npm run dev`
and exercising the UI, plus `npm run build`/`npm run lint` for type and lint
errors. Don't claim something is tested when only the build passed — say what you
actually ran.

### Environment variables

Copy `.env.example` into `frontend/.env.local` (gitignored — `.env*` is
excluded). The frontend requires and **throws at import time** without:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the Supabase **publishable** key
  (`sb_publishable_...`); safe for the browser.

Other keys in `.env.example` (Google Civic, GovTrack, OpenSecrets, Claude,
backend URLs) are for future, not-yet-built features. **Never commit secrets.**
Service-role keys and API secrets stay server-side and out of the repo.

## Database & schema

Canonical reference: `docs/DATABASE_SCHEMA.md`. **16 tables** (2 core, 2
registration, 8 candidate, 4 tracking). The live schema lives in Supabase; this
repo tracks changes as SQL migrations. All **soft-data table decisions are
applied to the live DB and committed**:

- `candidate_summaries` — KEEP + `content_hash` (cache invalidation); provenance
  via `model_used`, `citations` (JSONB), `generated_at`.
- `candidate_policy_positions` — KEEP; manual-first. Hand-curate ~160 rows for
  the Nov 2026 VA cycle as the **Phase 3 eval golden set**. Columns:
  `created_by` (`manual`/`ai_extracted`/`ai_extracted_verified`),
  `promise_specificity` (`specific`/`directional`/`vague`).
- `candidate_endorsements` — KEEP, phased. Now→July: Claude web-search
  extraction with structured-output validation + source-URL verification
  (`verified_by`). Post-July: add Ballotpedia only if coverage gaps justify it.
- `candidate_controversies` → **reframed to `candidate_public_records`** (see
  official-records principle): `record_type`, `document_url` (required),
  `jurisdiction`, `status`. Removed `severity`, `verified` bool.
- Hard-data tables (`candidate_bills`, `candidate_donations` [federal-only v1],
  `candidate_stock_trades`, `candidate_activity_log`) — all KEEP.
  `candidate_bills` has a queued ENUM/normalization/index audit.
  `candidate_activity_log` is load-bearing for `user_notifications` via FK.

RLS is enabled on user-scoped tables (`users`, `voter_registrations`,
`tracked_candidates`, `user_notifications`, `user_promises_tracker`) and disabled
on public data (`elections`, `candidates`, etc.). Preserve this.

### Migration discipline

Follow the pattern in `2026-05-11_soft_data_tables_*.sql` /
`MIGRATION_README.md`:

- `up`/`down` files named `YYYY-MM-DD_description_*.sql`, plus a
  `MIGRATION_README.md`-style note (what it does, backup/preconditions,
  verification queries, rollback guidance).
- Wrap in a `BEGIN; ... COMMIT;` transaction; make it idempotent
  (`IF NOT EXISTS` / `IF EXISTS`).
- Use `COMMENT ON TABLE/COLUMN` to document intent in the DB — the canonical
  place for methodology notes.
- **Commit to `db/migrations/` before applying to the live DB**, then verify
  with targeted `information_schema` queries.

### Diagnostic queries to reuse

- Table inventory: `SELECT table_name FROM information_schema.tables WHERE table_schema='public';`
- Row counts (no full scan): `n_live_tup` from `pg_stat_user_tables`.
- FK map: see "pre-flight before destructive ops" above.

## Known security debt (clear before public launch)

- ~~**RLS not enabled on all tables**~~ — **DONE (2026-06-30).** All 16 tables are
  under RLS: owner-only (`auth.uid()`) policies on the 5 user-scoped tables,
  public read-only on the 11 public-data tables. Writes to public data stay
  `service_role`-only. See `db/migrations/2026-06-30_*`.
- ~~Security headers (HSTS, CSP)~~ — **DONE (2026-06-30).** Set for all routes in
  `frontend/next.config.ts` (also X-Content-Type-Options, Referrer-Policy,
  X-Frame-Options, Permissions-Policy). CSP allows inline styles + Supabase;
  `'unsafe-eval'`/`ws:` are dev-only for HMR. Tighten script-src with nonces
  later if wanted.
- Supabase free tier has **no automated backups** — acceptable during dev (no
  real users). **Upgrade to Pro ($25/mo) trigger: first real user with real
  data.** Add to the pre-launch checklist.
- Store-readiness for Capacitor/iOS/Android (post-funding).

## Roadmap

**Immediately queued — pick one to start:**

1. ~~**RLS hardening** on the user-scoped tables~~ — **DONE 2026-06-30** (all 16
   tables under RLS; see security section + `db/migrations/2026-06-30_*`).
2. **zip-code → upcoming-elections lookup** — **first slice landed (2026-06-30).**
   `/api/elections` calls Google Civic server-side (key stays secret) and the
   races screen renders live elections with graceful fallback to labeled sample
   data. **Still to do:** add a real `GOOGLE_CIVIC_API_KEY` to
   `frontend/.env.local`; then location-specific filtering + candidate matching
   via `voterInfoQuery(zip)` (the natural next PRD).
3. ~~**Security headers**~~ — **DONE 2026-06-30** (see security section).

**Later pipeline:** `candidate_bills` schema improvements → Vercel deploy →
security headers + PWA config → Phase 3 eval build → Supabase Pro (on first real
user) → 501(c)(3) before grant apps → post-July Ballotpedia eval → August
endorsement mini-eval → post-funding Capacitor wrapping.

## Spec→issues pipeline (skill-file workflow)

Reusable prompt-driven skills are intended to live in
`.claude/skills/<name>/SKILL.md`:
`/grill-me` (interrogate a feature until fully specified) → `/write-a-prd`
(→ `docs/prds/YYYY-MM-DD-feature.md`) → `/prd-to-issues` (→ vertical-slice
GitHub issues). Trigger: "Run /grill-me on: [feature]". **Note:** these skill
files and `docs/prds/` are not yet committed to this repo — full text currently
lives in the Claude Project file `Informed_App_-_Tier_1_Skill_files_`. Create
them under `.claude/skills/` when formalizing the workflow.

## Phase 3 — AI/eval portfolio (the career artifact)

Starts ~September 2026, ~6 hrs/week, **strictly separated from app feature
hours.** Build a **promise-to-activity matching eval**
(advances / contradicts / neutral) with a hand-labeled golden set, run it across
Claude / GPT-4 / Gemini / an open model, and publish the methodology + a
failure-mode taxonomy as a standalone MIT-licensed deliverable. Frame:
*"I'm publishing an eval methodology for civic-accountability AI agents;
Informed is one application of it."* Build the eval **before** the agent, in a
**separate repo** — don't bury it in the app codebase.

## Git workflow

- Active development branch for this work:
  `claude/claude-md-documentation-sguwtr`. Develop, commit, and push there;
  never push to `main` without explicit permission.
- Git identity is the personal account ("Andrew Boyd II" / personal Gmail),
  separate from the work Microsoft account.
- Push with `git push -u origin <branch>`; retry on transient network failures.
- Do **not** open a pull request unless explicitly asked. Write clear,
  descriptive commit messages.
```
