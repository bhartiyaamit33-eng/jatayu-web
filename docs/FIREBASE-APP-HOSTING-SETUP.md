# Deploying Jatayu Web to **your own** Firebase App Hosting (Windows + VS Code + Cloud SQL)

This guide takes a fresh clone of this repo and gets it running on **your own**
Firebase project, using **Google Cloud SQL for PostgreSQL** as the database.
It is written for **Windows 10/11 with VS Code**, and it also explains *what we
already changed in the code* so you understand why the build works.

> The app is **Next.js + Payload CMS**. Payload needs a real **PostgreSQL**
> server — it does **not** use Firestore/Realtime Database. Firebase App Hosting
> runs your app on Cloud Run under the hood, so server-side rendering, the
> `/admin` panel, and `/api/*` routes all work.

---

## 1. Versions (what this project is pinned to)

| Thing | Version | Notes |
|---|---|---|
| **Node.js** | **20 LTS** locally, **22** on the build server | Firebase App Hosting builds with Node `22.x`. Node 20 or 22 both work locally. |
| **npm** | 10.x | Ships with Node 20/22. |
| **firebase-tools** (CLI) | **15.19.0** | `npm i -g firebase-tools` |
| **Next.js** | `^16.2.4` | Turbopack build. |
| **React / React DOM** | `^19.2.5` | |
| **Payload CMS** | **3.84.1** | All `@payloadcms/*` packages are pinned to `3.84.1`. |
| `@payloadcms/db-postgres` | 3.84.1 | Postgres adapter. |
| `@payloadcms/next` | 3.84.1 | |
| `@payloadcms/storage-gcs` | 3.84.1 | Media on Google Cloud Storage (optional). |
| `@payloadcms/storage-azure` | 3.84.1 | Media on Azure Blob (optional). |
| **sharp** | `^0.34.5` | Native image lib — see the cross-platform note in §7. |
| **graphql** | `^16.13.2` | |
| **TypeScript** | `^5` | |
| **Tailwind CSS** | `^3.4.1` | |
| **PostgreSQL** | 15 / 16 (Cloud SQL) | Any modern Postgres works. |
| Firebase Next.js build adapter | `14.0.21` | Installed automatically by App Hosting. |

---

## 2. Install the tools on Windows

Use **PowerShell** (not the old cmd). Run these one at a time.

1. **Git** — https://git-scm.com/download/win (or `winget install Git.Git`)
2. **Node.js 20 LTS** — https://nodejs.org (or `winget install OpenJS.NodeJS.LTS`)
3. **VS Code** — https://code.visualstudio.com (or `winget install Microsoft.VisualStudioCode`)
4. **Firebase CLI**:
   ```powershell
   npm install -g firebase-tools@15.19.0
   ```
5. **Google Cloud CLI (`gcloud`)** — https://cloud.google.com/sdk/docs/install (needed only for Cloud SQL admin tasks).

Verify:
```powershell
node -v      # v20.x.x
npm -v       # 10.x.x
firebase --version   # 15.19.0
git --version
```

**Recommended VS Code extensions:** *ESLint*, *Prettier*, *Tailwind CSS IntelliSense*, *Firebase* (Google).

---

## 3. Get the code

```powershell
cd $HOME\Desktop
git clone <your-fork-or-this-repo-url> jatayu-web
cd jatayu-web
code .                 # opens VS Code
npm install            # installs dependencies (uses package-lock.json)
```

---

## 4. Create your Firebase project

1. Go to https://console.firebase.google.com → **Add project**.
2. Name it (e.g. `my-jatayu-site`). Note the **Project ID** (e.g. `my-jatayu-site-ab12c`) — you need it everywhere below.
3. **Upgrade to the Blaze (pay-as-you-go) plan.** App Hosting *requires billing*. Console → ⚙ → *Usage and billing*.
4. Point this repo at your project:
   ```powershell
   firebase login
   firebase use --add        # pick your project, give it alias "default"
   ```
   (This writes `.firebaserc`. If it already lists our project ID, replace it with yours.)

---

## 5. Create your Cloud SQL (PostgreSQL) database

You can do this in the [Cloud SQL console](https://console.cloud.google.com/sql) or with `gcloud`:

```powershell
# 1) Create a Postgres instance (pick your own region & a strong root password)
gcloud sql instances create jatayu-sql `
  --database-version=POSTGRES_16 `
  --tier=db-custom-1-3840 `
  --region=asia-south1 `
  --project=YOUR_PROJECT_ID

# 2) Create the database
gcloud sql databases create jatayu_cms --instance=jatayu-sql --project=YOUR_PROJECT_ID

# 3) Create an app user
gcloud sql users create jatayu --instance=jatayu-sql --password="YOUR_DB_PASSWORD" --project=YOUR_PROJECT_ID

# 4) Note the instance connection name and public IP
gcloud sql instances describe jatayu-sql --project=YOUR_PROJECT_ID `
  --format="value(connectionName, ipAddresses[0].ipAddress)"
```

### Connecting App Hosting to Cloud SQL

The simplest, most portable way (and the one this guide uses) is **Public IP + SSL**.
App Hosting runs on Cloud Run with **dynamic outbound IPs**, so:

- Enable **Public IP** on the instance (default).
- Under the instance → **Connections → Networking**, add an **Authorized network**.
  For a first deploy you can use `0.0.0.0/0` (open) to confirm everything works,
  **then lock it down** (see §11). Cloud Run egress IPs are dynamic, so a true
  lockdown needs a **VPC connector + Cloud NAT static IP** — that's the advanced path.

Your connection string (`DATABASE_URI`) will look like:
```
postgresql://jatayu:YOUR_DB_PASSWORD@PUBLIC_IP:5432/jatayu_cms?sslmode=require
```

> **Advanced (private) option:** instead of public IP you can use the Cloud SQL
> connector via a unix socket: `postgresql://jatayu:PW@/jatayu_cms?host=/cloudsql/CONNECTION_NAME`.
> This requires extra VPC/connector setup and is out of scope here.

### Load the schema

This repo runs Payload with **`push: false` in production** (see `src/payload.config.ts`),
so the live container will **not** auto-create tables. Create the schema once before
your first real deploy. The easiest way during local setup:

```powershell
# temporarily allow your machine's IP on the Cloud SQL instance, then:
# set DATABASE_URI to your Cloud SQL string in .env.local (see §6) and run:
npm run dev          # dev mode has push:true and will create the tables
# stop it once tables exist, OR use: npm run sync-prod-schema
```

---

## 6. Local environment file

Copy the example and fill it in. In PowerShell:
```powershell
Copy-Item .env.example .env.local
code .env.local
```

Minimum values:
```dotenv
# Postgres (your Cloud SQL string)
DATABASE_URI=postgresql://jatayu:YOUR_DB_PASSWORD@PUBLIC_IP:5432/jatayu_cms?sslmode=require

# Payload — generate a long random string and KEEP IT STABLE forever
PAYLOAD_SECRET=replace-with-a-64-char-random-string

# Public URLs (use localhost for dev)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_LOGIN_URL=http://localhost:3000/admin
NEXT_PUBLIC_HERO_VIDEO_URL=/voicedocai-hero-30s.mp4
```

> ⚠️ **`PAYLOAD_SECRET` must never change** once you have data. It signs login
> tokens and encrypts some fields. If you rotate it, existing sessions and any
> encrypted values break. Generate it once:
> ```powershell
> node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
> ```

Run locally to confirm it works before deploying:
```powershell
npm run dev
# open http://localhost:3000  and  http://localhost:3000/admin
```

---

## 7. ⚠️ Two code fixes that are ALREADY in this repo (don't undo them)

These were the two non-obvious things that make the App Hosting build succeed.
They are committed already — listed here so you don't accidentally revert them.

**a) `tsconfig.json` excludes `functions/` and `dataconnect-generated/`.**
The root `tsconfig` globs `**/*.ts`. Without the exclude, Next's build type-checks
the Firebase **Cloud Functions** sample under `functions/`, which imports
`firebase-functions` — a package that is only installed inside `functions/node_modules`
and is **not** installed by the root `npm ci` on the build server. Result: the build
fails with *“Cannot find module 'firebase-functions'”*. The fix:
```jsonc
"exclude": ["node_modules", "functions", "dataconnect-generated"]
```

**b) `package-lock.json` contains `sharp` binaries for ALL platforms.**
`sharp` ships a different native binary per OS/CPU. If you ever regenerate the
lock file on Windows or macOS, npm may record only *your* platform's binary, and
the **Linux x64** build server then fails with *“Could not load the sharp module
using the linux-x64 runtime”* while collecting page data. If you must regenerate
the lock file, immediately re-add all platforms:
```powershell
npm install --package-lock-only --include=optional --os=linux --cpu=x64 --libc=glibc sharp@0.34.5
```
Then commit `package-lock.json`.

> A handy way to catch both before deploying: simulate the clean build server
> by temporarily deleting `functions\node_modules` and your `.env.local`, then
> running `npm run build`. If it exits 0, the App Hosting build will too.

---

## 8. Configure App Hosting (`apphosting.yaml`)

This file is already in the repo. It declares the runtime and which env vars /
secrets the app gets. Only the **names** of secrets live here — never the values.
Update the `NEXT_PUBLIC_*` URLs to your own backend URL (you'll know it after §9,
or after you attach a custom domain):

```yaml
runConfig:
  minInstances: 0
  maxInstances: 100
  cpu: 1
  memoryMiB: 1024
  concurrency: 80

env:
  - variable: NEXT_PUBLIC_SITE_URL
    value: https://YOUR-BACKEND--YOUR-PROJECT.REGION.hosted.app
    availability: [BUILD, RUNTIME]
  - variable: NEXT_PUBLIC_LOGIN_URL
    value: https://YOUR-BACKEND--YOUR-PROJECT.REGION.hosted.app/admin
    availability: [BUILD, RUNTIME]
  - variable: NEXT_PUBLIC_HERO_VIDEO_URL
    value: /voicedocai-hero-30s.mp4
    availability: [BUILD, RUNTIME]
  - variable: DATABASE_URI
    secret: DATABASE_URI
    availability: [BUILD, RUNTIME]
  - variable: PAYLOAD_SECRET
    secret: PAYLOAD_SECRET
    availability: [BUILD, RUNTIME]
```

---

## 9. Create the App Hosting backend + store the secrets

**a) Create the backend** (connects your GitHub repo so pushes auto-deploy):
```powershell
firebase init apphosting
# choose: create a new backend, pick a region, connect your GitHub repo + branch (main)
```

**b) Store the two secrets in Cloud Secret Manager** (values are read from a prompt
or a file — never committed). The CLI also grants the backend permission to read them:
```powershell
firebase apphosting:secrets:set DATABASE_URI
firebase apphosting:secrets:set PAYLOAD_SECRET
```
Paste the same values you used in `.env.local`. If it asks *“add to apphosting.yaml?”*
answer **No** — they are already in the file from §8.

---

## 10. Deploy and verify

A push to your connected branch auto-deploys. To deploy manually:
```powershell
firebase apphosting:rollouts:create YOUR_BACKEND_ID --git-branch main --project=YOUR_PROJECT_ID
```

Watch progress in **Console → App Hosting**. A build takes ~5–8 minutes.

When it finishes, verify (PowerShell):
```powershell
$U = "https://YOUR-BACKEND--YOUR-PROJECT.REGION.hosted.app"
curl.exe -s -o NUL -w "home %{http_code}`n" "$U/"
curl.exe -s -o NUL -w "admin %{http_code}`n" "$U/admin"
curl.exe -s -w "`n" "$U/api/users/me"
```
Expected: `home 200`, `admin 200`, and `/api/users/me` returns `{"user":null,...}`.
A **500** with *“There was an error initializing Payload”* almost always means the
app can't reach Postgres (wrong `DATABASE_URI`, SSL, or the Cloud SQL authorized
network is blocking Cloud Run — see §5/§11).

---

## 11. Lock down the database (do this after it works)

Opening Cloud SQL to `0.0.0.0/0` is fine for the first deploy but **must not stay**.
Because Cloud Run egress IPs are dynamic, a real lockdown means:
1. Create a **Serverless VPC Access connector** in your App Hosting region.
2. Route the backend's egress through it, and give it a **Cloud NAT static IP**.
3. Authorize **only that static IP** on the Cloud SQL instance.

Until that's in place, keep the database password strong and rotate it if it's
ever been shared. (For a fully private setup, use the Cloud SQL connector / unix
socket mentioned in §5.)

---

## 12. Optional: media storage & custom domain

- **Media on GCS:** set `GCS_BUCKET` (and `GCS_PROJECT_ID`) as env/secret in
  `apphosting.yaml`; `src/payload.config.ts` switches to the GCS adapter when
  `GCS_BUCKET` is present. (It falls back to Azure Blob when
  `AZURE_STORAGE_CONNECTION_STRING` is set, else local disk.)
- **Custom domain:** Console → App Hosting → your backend → **Add custom domain**,
  follow the DNS records, then update `NEXT_PUBLIC_SITE_URL` /
  `NEXT_PUBLIC_LOGIN_URL` in `apphosting.yaml` and redeploy.

---

## 13. Quick troubleshooting reference

| Symptom in build/runtime | Cause | Fix |
|---|---|---|
| `npm ci ... can only install when package.json and package-lock.json are in sync` | lock file out of date | `npm install`, commit `package-lock.json` |
| `Cannot find module 'firebase-functions/...'` during build | `functions/` got type-checked | keep `functions` in `tsconfig` `exclude` (§7a) |
| `Could not load the "sharp" module using the linux-x64 runtime` | lock file missing Linux sharp binary | re-add all platforms (§7b) |
| Build deploys an **old commit** | App Hosting built a stale rollout | `firebase apphosting:rollouts:create ... --git-branch main` |
| `There was an error initializing Payload` / `ECONNREFUSED 127.0.0.1:5432` | `DATABASE_URI` not reaching app, or DB unreachable | check the secret is set & referenced in `apphosting.yaml`; check Cloud SQL authorized networks/SSL (§5) |
| App Hosting `init` errors about billing | project not on Blaze | enable billing (§4.3) |

---

### Appendix — what we did on the original deployment

For reference, the original go-live differed only in the database: it pointed at an
existing **Azure Database for PostgreSQL** (public host + `sslmode=require`) instead
of Cloud SQL, with `DATABASE_URI`/`PAYLOAD_SECRET` stored as the same kind of
Secret Manager secrets. The build fixes in §7 and the deploy flow in §8–§10 are
identical regardless of which Postgres you use.
