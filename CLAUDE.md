# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.

## What this project is

**Informed** is an open-source civic-transparency web app that helps U.S.
citizens (1) register to vote, (2) research candidates from official government
data, (3) contact their representatives, and (4) track whether elected officials
keep their promises after the election. Mission constraints matter here and
should shape every change:

- **Unbiased** — information comes from official government sources, never
  opinion. When adding candidate data, cite the primary source.
- **Transparent** — every claim links to original source data.
- **Privacy-first** — collect the minimum needed; never sell or share user data.

## ⚠️ README vs. reality

`README.md` describes the *target* architecture (Express backend, `components/`,
`hooks/`, `pages/`, many `docs/*.md` files, full API integrations). **Most of
that does not exist yet.** Trust this file and the actual tree over the README
for the current state. What actually exists today:

```
informed-app/
├── frontend/                  # The only running code. Next.js 16 + React 19 (App Router)
│   ├── app/
│   │   ├── page.tsx           # THE ENTIRE APP — ~600 lines, one client component
│   │   ├── layout.tsx         # Root layout (still has default create-next-app metadata)
│   │   ├── globals.css        # @tailwind directives (mostly unused — see Styling)
│   │   └── api/test-db/route.ts  # Supabase connectivity smoke-test endpoint
│   ├── lib/supabase.ts        # Supabase browser client (anon key)
│   └── package.json           # name is "frontend-next"
├── backend/                   # EMPTY (.gitkeep only). No Express server exists yet.
├── db/migrations/             # SQL migrations + per-migration READMEs
├── docs/DATABASE_SCHEMA.md    # 16-table schema reference (the only real doc)
├── .env.example               # Env var template (no secrets)
├── README.md                  # Aspirational — see warning above
└── SECURITY_TODOS.md          # Empty placeholder
```

There is **no backend, no test suite, no real API integration, and no auth flow
wired up.** The frontend renders entirely from in-file mock data.

## Frontend architecture (read before editing `page.tsx`)

`frontend/app/page.tsx` is a single `"use client"` component that contains the
whole application. Understand these conventions before touching it:

- **State-based routing, not file routing.** Navigation is `useState` (`page`,
  `params`) plus a `navigate(page, params)` helper — not Next.js routes or
  `next/link`. Add a screen by adding a page component and a
  `{page === "x" && <XPage .../>}` branch in `InformedApp`. The nav bar buttons
  call `navigate(...)`.
- **Inline styles + a `theme` object.** All styling is inline `style={{...}}`
  referencing the `theme` color constants at the top of the file. Despite
  Tailwind v4 being installed and `globals.css` importing `@tailwind`
  directives, the app does **not** use Tailwind utility classes. Match the
  existing inline-style approach; reuse `theme.*` colors rather than hardcoding
  hex values.
- **Mock data drives everything.** Constants like `MOCK_RACES` and
  `MOCK_CANDIDATES` (typed via the `CandidateData` interface) supply all
  content. Real data will come from government APIs later. **Always render the
  `<SampleDataBanner />`** on any screen showing placeholder data, and keep
  source attributions ("Source: FEC.gov", "GovTrack.us", etc.) — they reflect
  where the real data will come from.
- **Shared building blocks** already exist: `FadeIn`, `PartyBadge`,
  `StatusBadge`, `BackButton`, `SampleDataBanner`, `HoverCard`, and the `Icons`
  object (inline SVGs). Reuse them instead of duplicating.
- **Self-contained.** No component/hook/util folders yet. If the file grows
  unwieldy, propose a split before doing a large refactor.

## Tech stack

| Layer    | Tech                                  | Notes |
|----------|---------------------------------------|-------|
| Frontend | Next.js 16.2.4, React 19, App Router  | TypeScript strict mode |
| Styling  | Inline styles + `theme` object        | Tailwind v4 installed but unused in app code |
| Database | Supabase (PostgreSQL)                 | Client in `lib/supabase.ts` |
| Auth     | Supabase Auth (planned)               | Not wired up yet |
| AI       | Claude API (planned)                  | For candidate summaries |
| Backend  | Node + Express (planned)              | `backend/` is empty |

Default to the latest Claude models for any AI features (e.g. `claude-opus-4-8`).

## Development workflow

All commands run from `frontend/` (the only npm project):

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — run before pushing significant changes
npm run lint     # ESLint (next/core-web-vitals + TypeScript rules)
npm start        # serve a production build
```

There is **no test runner configured.** Verify changes by running `npm run dev`
and exercising the UI, plus `npm run build` and `npm run lint` to catch type and
lint errors. Do not claim something is tested when only the build passed — say
what you actually ran.

### Environment variables

Copy `.env.example` and fill values into `frontend/.env.local` (gitignored —
`.env*` is excluded). The frontend requires:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

`lib/supabase.ts` **throws at import time** if these are missing, so the app
won't run without them. Other keys in `.env.example` (Google Civic, GovTrack,
OpenSecrets, Claude, backend URLs) are for future, not-yet-built features.

**Never commit secrets.** Only the anon/public Supabase key belongs in
`NEXT_PUBLIC_*` vars; service-role keys and API secrets must stay server-side
and out of the repo.

## Database & migrations

The canonical schema (16 tables across voter registration, candidate
understanding, and post-election tracking) is documented in
`docs/DATABASE_SCHEMA.md`. The live schema lives in Supabase; this repo tracks
changes as SQL migrations in `db/migrations/`.

When writing a migration, follow the established pattern (see
`2026-05-11_soft_data_tables_*.sql` and `MIGRATION_README.md` as the template):

- Provide both `_up.sql` and `_down.sql`, named `YYYY-MM-DD_description_*.sql`.
- Wrap changes in a `BEGIN; ... COMMIT;` transaction.
- Make it idempotent (`IF NOT EXISTS` / `IF EXISTS`) so re-runs are safe.
- Use `COMMENT ON TABLE/COLUMN` to document intent directly in the DB — this is
  treated as the canonical place for methodology notes.
- Write a `MIGRATION_README.md`-style note: what it does, backup/precondition
  steps, verification queries, and rollback guidance.
- RLS is enabled on user-specific tables (`users`, `voter_registrations`,
  `tracked_candidates`, `user_notifications`, `user_promises_tracker`) and
  disabled on public data (`elections`, `candidates`, etc.). Preserve this.

Note: `candidate_controversies` was renamed to `candidate_public_records` with a
stricter "official-record items only, every row needs a primary `document_url`"
methodology. Use that table/framing going forward.

## Conventions & guardrails

- **TypeScript strict** is on; type new code properly. The `@/*` path alias maps
  to the `frontend/` root (e.g. `import { supabase } from '@/lib/supabase'`).
- **Civic-tech bar:** this is a tool people may rely on to make voting
  decisions. Keep data sourced and cited, avoid editorializing, and don't
  introduce partisan framing. When unsure whether a claim is sourceable,
  surface the question rather than inventing data.
- **Don't trust SQL blindly** — including AI-written SQL. Read every line of a
  migration and confirm preconditions before suggesting it be run.
- Keep `.env.example` updated (placeholders only) when adding new config.

## Git workflow

- Active development branch for this work: `claude/claude-md-documentation-sguwtr`.
  Develop, commit, and push there; never push to `main` without explicit
  permission.
- Push with `git push -u origin <branch>`; retry on transient network failures.
- Do **not** open a pull request unless explicitly asked.
- Write clear, descriptive commit messages.
```
