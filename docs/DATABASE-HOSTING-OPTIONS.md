# Postgres hosting — cost comparison & migration

Jatayu CMS runs on **Payload 3 + `@payloadcms/db-postgres`**. The app only needs a
standard PostgreSQL connection string in `DATABASE_URI`. You can point that at Cloud
SQL, Azure, Neon, Supabase, Railway, or a VPS — no code changes required.

**Current production (as of May 2026):** Azure Database for PostgreSQL Flexible
Server (`jatayu-prod-pg.postgres.database.azure.com`), wired through Firebase App
Hosting via the `DATABASE_URI` secret.

---

## Quick recommendation

| Situation | Best fit |
|-----------|----------|
| Lowest cost, small CMS (~104 tables, low traffic) | **Neon** or **Supabase free tier** → paid only when you outgrow it |
| Stay fully inside Google Cloud | **Cloud SQL** db-f1-micro / smallest tier (simplest IAM, higher baseline cost) |
| Already on Azure, minimal change | Keep **Azure Flexible Server** but downsize SKU / stop dev instances |
| GoDaddy shared hosting | **Not suitable** — no Node.js + Postgres control for Payload |
| GoDaddy VPS / dedicated | Possible if you install Postgres yourself; you manage backups, SSL, patches |

**Do not migrate to MySQL.** Payload has no official MySQL adapter; you would rewrite
the data layer and lose draft/version support patterns that depend on Postgres.

---

## Monthly cost comparison (approximate, USD)

Estimates for a **single CMS database** with modest traffic (admin + public site reads).
Prices change — verify on each vendor's pricing page before committing.

| Provider | Typical tier | Est. monthly | Notes |
|----------|--------------|-------------|-------|
| **Neon** | Free → Launch | **$0–19** | Free: 0.5 GB storage, scales to zero; paid Launch from ~$19/mo. Serverless, `sslmode=require`. |
| **Supabase** | Free → Pro | **$0–25** | Free: 500 MB DB; Pro ~$25/mo includes more storage + daily backups. |
| **Railway** | Usage-based | **~$5–20** | Pay for vCPU/RAM/storage used; good for experiments. |
| **Azure Flexible Server** | Burstable B1ms | **~$25–45** | Current stack; B1ms + storage in Southeast Asia. |
| **Cloud SQL** | db-f1-micro / smallest | **~$30–50+** | Instance + storage + egress; simplest if app is already on GCP. |
| **GoDaddy VPS** | 4 GB RAM VPS | **~$20–40** | VPS fee only; **you** run Postgres, backups, firewall, OS updates. |
| **Self-managed on GCP VM** | e2-micro + disk | **~$10–25** | Cheapest “full control” on GCP; more ops work than Neon. |

### What you are probably paying for today

- **Firebase App Hosting** — Blaze plan (compute + egress when traffic hits the site).
- **Azure Postgres Flexible Server** — instance SKU + storage (often the largest fixed DB cost).
- **Media** — GCS or Azure Blob (separate from DB; not affected by this migration).

Moving Postgres to Neon/Supabase usually **cuts the database line item** while keeping
Firebase App Hosting unchanged.

---

## Connection string formats

All managed providers need **`sslmode=require`** (or `verify-full` where supported).

```bash
# Local Docker (from docker-compose.yml)
postgres://jatayu:jatayu_dev_password@localhost:5432/jatayu_cms

# Neon (dashboard → Connection string → pooled recommended for serverless)
postgres://USER:PASS@ep-xxxx.ap-southeast-1.aws.neon.tech/jatayu_cms?sslmode=require

# Supabase (Settings → Database → URI, use “Session mode” or direct port 5432)
postgres://postgres.PROJECT_REF:PASS@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require

# Railway (Variables → DATABASE_URL — rename mentally to DATABASE_URI)
postgres://postgres:PASS@containers-us-west-xxx.railway.app:5432/railway?sslmode=require

# Azure (current production pattern)
postgres://USER:PASS@jatayu-prod-pg.postgres.database.azure.com:5432/jatayu_cms?sslmode=require

# Cloud SQL (public IP)
postgres://jatayu:PASS@PUBLIC_IP:5432/jatayu_cms?sslmode=require

# Cloud SQL (unix socket on Cloud Run / App Hosting with connector)
postgres://jatayu:PASS@/jatayu_cms?host=/cloudsql/PROJECT:REGION:INSTANCE
```

Copy the exact string from the provider UI — do not guess the host.

---

## Migration: Azure (or Cloud SQL) → Neon / Supabase

**Downtime:** plan for 15–60 minutes of read-only or brief outage while you cut over.

### 1. Provision the new database

1. Create a project on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Pick region **close to Firebase App Hosting** (`asia-southeast1`) to reduce latency.
3. Create database `jatayu_cms` (or use default `postgres` and rename later).
4. Copy the connection string; add `?sslmode=require` if missing.

### 2. Copy data (pg_dump / pg_restore)

From a machine with `postgresql-client` installed and network access to **both** DBs:

```bash
# Source = current production (Azure example)
export SOURCE_URI='postgres://USER:PASS@jatayu-prod-pg.postgres.database.azure.com:5432/jatayu_cms?sslmode=require'
export TARGET_URI='postgres://USER:PASS@ep-xxxx.neon.tech/jatayu_cms?sslmode=require'

npm run db:migrate
```

Or run the script directly:

```bash
bash scripts/migrate-postgres.sh
```

The script dumps with `pg_dump --no-owner --no-acl` and restores with `pg_restore`.
It does **not** delete anything on the source.

### 3. Sync Payload schema (new columns from recent CMS work)

After restore, run additive schema sync against the **new** database:

```bash
DATABASE_URI="$TARGET_URI" npm run sync-prod-schema
```

This applies MFA fields, `audit_logs`, `reviewStatus`, etc., if they were missing from
the dump.

### 4. Point Firebase App Hosting at the new database

```bash
firebase apphosting:secrets:set DATABASE_URI --project=jatayu-company-website-a6a4c
# Paste the new connection string when prompted
```

`apphosting.yaml` already references `secret: DATABASE_URI` — no YAML change needed.

### 5. Allow Firebase egress to the new host

Managed Postgres providers usually allow connections from any IP initially. For Neon/
Supabase, use their dashboard “IP allow” if enabled; App Hosting egress IPs can change,
so prefer providers that allow SSL connections without a fixed IP list, or use Neon’s
default (SSL + password).

### 6. Smoke test

1. Open `/admin` — log in (MFA if enabled).
2. Edit a draft page → Submit for review → publish as super admin.
3. Check `/blog` and a product page on the public site.
4. Upload a media file (confirms DB + storage both work).

### 7. Decommission old database (after 1–2 weeks)

Take a final snapshot/backup of Azure/Cloud SQL, then delete the old instance to stop
billing.

---

## Wiring `DATABASE_URI` locally

Update `.env.local` (never commit secrets):

```bash
DATABASE_URI=postgres://...your-neon-or-supabase-uri...?sslmode=require
PAYLOAD_SECRET=same-as-production-or-dev-only
```

Restart `npm run dev`. Payload connects on first request.

See `.env.example` for commented templates per provider.

---

## GoDaddy FAQ

| Question | Answer |
|----------|--------|
| Can we use GoDaddy’s “database” on shared hosting? | **No** — shared plans don’t run Next.js 16 + Payload + Postgres the way this repo needs. |
| GoDaddy VPS with Postgres? | **Possible** but you become the DBA (backups, upgrades, SSL, firewall). Neon/Supabase is usually cheaper and less work. |
| Move everything to GoDaddy? | The **app** should stay on Firebase App Hosting (or Cloud Run); only Postgres can move to a cheaper host via `DATABASE_URI`. |

---

## Related docs

- [FIREBASE-APP-HOSTING-SETUP.md](./FIREBASE-APP-HOSTING-SETUP.md) — secrets & first deploy
- [FIREBASE-DEPLOYMENT-PROCESS.md](./FIREBASE-DEPLOYMENT-PROCESS.md) — production incident log
- [CMS-ACCESS.md](../CMS-ACCESS.md) — `sync-prod-schema` workflow
