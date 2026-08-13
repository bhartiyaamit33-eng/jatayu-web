# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single product: **jatayu-web**, a Next.js 16 (App Router, React 19) marketing
site with an embedded **Payload CMS 3** admin at `/admin`, backed by **PostgreSQL**. The
Firebase/`dataconnect`/`functions` scaffolding is not wired into the running app.

### Services

| Service | How to run | Notes |
|---|---|---|
| PostgreSQL | Runs as the system `postgresql@16-main` cluster | Required. Backs Payload CMS, leads, users, media metadata. |
| Next.js dev server | `npm run dev` (port 3000) | Serves marketing pages, `/admin`, and `/api/*`. |

Standard commands live in `package.json` scripts (`dev`, `build`, `start`, `seed`, `db:up`, etc.).

### Database

- The app defaults (`src/payload.config.ts`) to
  `postgres://jatayu:jatayu_dev_password@localhost:5432/jatayu_cms` and a dev `PAYLOAD_SECRET`
  when env vars are unset, so it runs with zero config once Postgres is up with those creds.
- The Cloud VM uses a **native** PostgreSQL 16 cluster (role `jatayu` / db `jatayu_cms`), not the
  `docker-compose.yml` Postgres, because Docker is not available. `npm run db:up` (docker compose)
  will NOT work here; the cluster is already running instead. Start it if needed with
  `sudo pg_ctlcluster 16 main start`.
- In dev (`NODE_ENV !== production`) Payload auto-pushes the schema on connect, so new
  fields/collections "just work" — no manual migration step is needed locally.

### Env / config

- Local config lives in `.env.local` (gitignored). It is created during environment setup and is
  not committed. Minimum useful contents: `DATABASE_URI`, `PAYLOAD_SECRET`,
  `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
- The `npm run seed` script reads `PAYLOAD_SECRET` from `.env.local` and POSTs to
  `http://localhost:3000/api/seed`, so the dev server must be running first. Seeding is idempotent
  and populates all marketing content.

### Gotchas

- **Lint is broken upstream.** `npm run lint` (`next lint`) fails because Next.js 16 removed the
  `next lint` command (it treats `lint` as a directory arg). Running ESLint 9 directly against the
  committed legacy `.eslintrc.json` also fails with a circular-structure error from the
  `next/core-web-vitals` config. Fixing this requires migrating to a flat `eslint.config.js`, which
  is a code change out of scope for environment setup.
- `npm run build` requires `DATABASE_URI` to reach a live Postgres, since pages render from CMS
  data at build time. Do not run `npm run build` while `npm run dev` is active (Next warns about
  a shared `.next` dir).
- The admin logs a non-fatal warning that `SessionEndProvider` is missing from
  `src/app/(payload)/admin/importMap.js`; the admin still loads. Regenerate with
  `npx payload generate:importmap` if you touch admin component registration.
