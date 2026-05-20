# CMS access (super admin)

The site is now backed by [Payload CMS v3](https://payloadcms.com), embedded inside this Next.js app. The admin panel lives on the same domain as the marketing site.

## Local: how to log in for the first time

1. Make sure Postgres is running: `npm run db:up`
2. Start the app: `npm run dev`
3. Open [http://localhost:3000/admin](http://localhost:3000/admin)
4. The screen will say **"Create your first user"**. Fill it in.

The first user you create is automatically a super-admin. There's only one super-admin slot until you invite others from inside the admin (`Users` → `+ Create new`).

## Local: seeding content

Run once after the first `npm run dev`:

```bash
npm run seed
```

This pushes everything in `src/content/*.ts` into the database (idempotent — safe to re-run, but be careful: re-running overwrites edits made via `/admin` for any field defined in those files).

Confirmation looks like:

```
OK 42 ops
  global site-meta
  global home-hero
  ...
  created posts: hmis-integration-checklist
```

After the first successful seed, you can edit content at `/admin` and the database becomes the source of truth.

## What is editable in /admin

**Globals** (single-instance, no list):
- `site-meta`, `home-hero`, `home-metrics`, `audience-split`, `patient-consent`, `compliance-band`, `deployment-modes`, `founder-note`, `logo-wall`, `how-it-works-steps`, `homepage-concise-answer`

**Collections** (lists of items):
- `users` — admins
- `media` — uploaded images
- `posts` — blog posts
- `specialties`
- `case-studies`
- `testimonials`
- `awards`
- `home-faqs`
- `trial-emails` — Day 0 / 1 / 3 / 5 / 6 / 7 drip copy
- `leads` — every trial signup lands here automatically

## What is NOT in /admin yet (still file-based)

These pages still pull copy from `src/content/site-config.ts`:
- `/about`, `/about/facts`
- `/careers`, `/contact`, `/press`
- `/pricing`
- `/privacy`, `/terms`, `/cookies`
- `/security` (the six pillars are inline in `src/app/security/page.tsx`)
- `SiteHeader`, `SiteFooter`, layout metadata fallbacks

Move them into Payload incrementally by adding new globals/collections and updating the relevant page to read from `@/lib/cms`.

## Production deployment

### Azure (current path)

The full runbook lives at [`infra/README.md`](./infra/README.md). Short version:

1. `brew install azure-cli && az login && az account set --subscription <id>`
2. `bash infra/azure-deploy.sh` — idempotent, provisions Resource Group → ACR → Key Vault → Postgres Flexible Server → Storage Account → Log Analytics → App Insights → Container Apps Environment → Container App. Builds the image with `az acr build` and rolls a revision.
3. Visit the FQDN it prints and create the first super-admin at `/admin`.
4. Seed content:
   ```bash
   SECRET=$(az keyvault secret show --vault-name <kv> --name payload-secret --query value -o tsv)
   curl -X POST -H "x-seed-secret: $SECRET" https://<fqdn>/api/seed
   ```
5. For continuous deploys on every `main` push, set up OIDC federation per `infra/README.md` and add the three GitHub Actions secrets — `.github/workflows/azure-deploy.yml` handles the rest.

**Security posture in production:** secrets live in Key Vault, referenced by Container Apps via the system-assigned managed identity. No plaintext PAYLOAD_SECRET or DB password is stored in env files, ACR, or GitHub. The `/api/seed` route is still gated by the same secret — disable or rename it after the first seed for defense in depth.

### Generic (any host)

1. Provision a Postgres database (Azure Flexible Server, Cloud SQL, RDS, Neon — all work).
2. Set environment variables in your hosting provider:
   - `DATABASE_URI` — production Postgres connection string (include `sslmode=require` for managed databases).
   - `PAYLOAD_SECRET` — generate with `openssl rand -base64 48`.
   - `NEXT_PUBLIC_SITE_URL` — production domain.
   - `NEXT_PUBLIC_LOGIN_URL` — production app login URL.
   - `AZURE_STORAGE_*` (only if using Azure Blob for media; otherwise leave unset and uploads land on disk).
3. Build a Docker image with the bundled `Dockerfile` and run it on any container host.
4. Visit `<your-domain>/admin` and create the first super-admin user.
5. Seed once: `curl -X POST -H "x-seed-secret: <PAYLOAD_SECRET>" https://<your-domain>/api/seed`
6. **Disable or rate-limit `/api/seed`** in production by adding the route to a middleware allowlist or simply renaming the file after seeding (it requires the secret already, but defense in depth).

## Operational scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Next.js + Payload admin |
| `npm run devsafe` | Same as above but clears `.next` first (use after broken builds) |
| `npm run build` | **Do not run while `npm run dev` is also running.** It corrupts the dev server cache. |
| `npm run start` | Production Next.js server |
| `npm run db:up` | Start local Postgres in Docker |
| `npm run db:down` | Stop local Postgres |
| `npm run db:logs` | Tail Postgres logs |
| `npm run seed` | Push `src/content/*` into Payload (idempotent) |
| `npm run generate:types` | Regenerate `src/payload-types.ts` *(known issue: Payload's CLI fails on Next 16 — see "Known issues" below)* |

## Trial signups end-to-end

1. Visitor submits the form at `/trial`.
2. `POST /api/trial` validates and writes a row to the `leads` table via Payload's Local API.
3. The row appears in `/admin` → `Leads` immediately, with `status = new`, IP, user agent, and timestamp.
4. Sales workflow: change `status` to `Contacted` / `Qualified` / `Converted` / `Not a fit` and add notes inline. Filter by status to triage.
5. Drip emails are stored in `trial-emails`. The dispatcher (separate Cloud Scheduler job, not yet wired) reads them and sends Day 0 / 1 / 3 / 5 / 6 / 7 from Gmail SMTP using token replacement.

## Known issues

**Payload CLI commands fail on Next.js 16.** The `loadEnv` helper that ships with Payload v3.84 does an ESM default import of `@next/env`, but Node's CJS interop returns `undefined` for that import shape under tsx. Affects `payload generate:types` and the standalone `scripts/seed.ts`. Workaround used here: the seed runs as a one-shot Next.js API route at `/api/seed`. Type generation can be deferred (Payload's runtime types still work via `import config from "@payload-config"`).

**Hydration warning about `body { overflow: hidden }`.** Cosmetic warning visible in dev; comes from the Payload admin layout's body styles being injected on cross-route navigations. Does not affect production rendering.
