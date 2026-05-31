# Firebase App Hosting — Deployment Process Log

A chronological record of how this project was taken live on **Firebase App
Hosting**, including every error hit and the exact fix. This is the "what
happened" companion to the forward-looking
[FIREBASE-APP-HOSTING-SETUP.md](./FIREBASE-APP-HOSTING-SETUP.md).

- **Date:** 2026-05-31
- **Project:** `jatayu-company-website-a6a4c`
- **Backend:** `jatayu-web` (region `asia-southeast1`)
- **Live URL:** https://jatayu-web--jatayu-company-website-a6a4c.asia-southeast1.hosted.app
- **Repo:** `bhartiyaamit33-eng/jatayu-web` (branch `main`, auto-deploys on push)
- **Database:** existing **Azure Postgres** `jatayu-prod-pg.postgres.database.azure.com` / db `jatayu_cms` (~104 tables)

---

## Outcome

| Route | Result |
|---|---|
| `/` | 200 — `VoiceDocAI by Jatayu Healthcare …` |
| `/admin` | 200 — `Dashboard · Jatayu CMS` (Payload) |
| `/blog` | 200 |
| `/api/users/me` | 200 — `{"user":null,…}` |

Five distinct blockers were found and fixed, each diagnosed against the **actual
build/runtime logs** (pulled via the Cloud Logging API), not guessed.

---

## Timeline of blockers & fixes

### 0. Starting point
- Firebase project + App Hosting already created in the console.
- Repo had a scaffolded `functions/` (Cloud Functions sample) and
  `dataconnect-generated/` (Firebase Data Connect SDK) alongside the Next.js app.
- App Hosting requires the **Blaze** billing plan — `firebase init apphosting`
  errors until billing is enabled.

### 1. `npm ci` failed — lock file out of sync
**Symptom (build step 3, exit 51):**
```
npm ci can only install packages when package.json and package-lock.json are in sync
Missing: tsx@…, esbuild@…; Invalid: firebase@12.x does not satisfy 11.x, …
```
**Cause:** `package-lock.json` had drifted from `package.json`. The Firebase
peer-dep ranges came from the local `@firebasegen/default-connector`
(`file:dataconnect-generated/...`) whose peers (`firebase ^11.3.0`,
`@tanstack-query-firebase/react ^1.0.5`) didn't match the locked versions.

**Fix:** regenerated the lock file and verified `npm ci` passes locally.
→ commit `9f1c2b7` (and `4b415db`).

### 2. Firebase kept building a **stale commit**
**Symptom:** every build log showed `HEAD is now at 4653151` even after new pushes.
**Cause:** rollouts were pinned to an old commit; new pushes weren't auto-creating
rollouts from `HEAD`.
**Fix:** trigger rollouts explicitly from the branch tip:
```
firebase apphosting:rollouts:create jatayu-web --git-branch main --project=jatayu-company-website-a6a4c
```

### 3. `next build` failed on the `functions/` TypeScript
**Symptom (build got past `npm ci`, then exit 51):**
```
./functions/src/index.ts:10 Cannot find module 'firebase-functions/v2/https'
```
**Cause:** root `tsconfig.json` globbed `**/*.ts`, so Next's type-check pulled in
`functions/src/index.ts`, which imports `firebase-functions` — a package only
present in `functions/node_modules`. App Hosting runs `npm ci` at the **repo root
only**, so that module is absent on the build server.
**Diagnosis method:** reproduced locally by deleting `functions/node_modules` and
`.env.local`, then `npm run build` → same error.
**Fix:** exclude the non-app dirs from the Next build:
```jsonc
"exclude": ["node_modules", "functions", "dataconnect-generated"]
```
→ commit `2e50096`. Verified: clean-condition `npm run build` now exits 0.

### 4. `next build` failed loading `sharp` on Linux
**Symptom (TypeScript now passed; failed during page-data collection):**
```
Error: Could not load the "sharp" module using the linux-x64 runtime
Error: Failed to collect page data for /blog/rss.xml
```
**Cause:** regenerating the lock file in step 1 on **macOS** recorded only the
`darwin-arm64` sharp binary. App Hosting builds on **linux-x64**, so `npm ci`
there had no usable `sharp`.
**Diagnosis method:** read the raw build log via the Cloud Logging API
(`resource.type="build"`), which showed the sharp error verbatim.
**Fix:** add every platform's sharp binary to the lock file:
```
npm install --package-lock-only --include=optional --os=linux --cpu=x64 --libc=glibc sharp@0.34.5
```
→ commit `ba09045`. **Build went green** and deployed.

### 5. Live site returned 500 — database not wired in
**Symptom:** build/deploy succeeded but `/` and `/admin` returned 500;
`/api/users/me` → `{"message":"There was an error initializing Payload"}`.
Runtime logs (Cloud Logging) showed:
```
cannot connect to Postgres: connect ECONNREFUSED 127.0.0.1:5432
```
**Cause:** the deployed commit predated any runtime config, so `DATABASE_URI`
was undefined and `src/payload.config.ts` fell back to its `localhost` default
(`process.env.DATABASE_URI ?? "postgres://…@localhost:5432/…"`). `node-postgres`
with no connection string defaults to `127.0.0.1:5432`.
**Fix:**
1. Validated the Azure DB connection from a workstation (firewall was open) — OK,
   `jatayu_cms`, 104 tables.
2. Stored secrets in Cloud Secret Manager and granted the backend access:
   ```
   firebase apphosting:secrets:set DATABASE_URI
   firebase apphosting:secrets:set PAYLOAD_SECRET
   ```
   (Same `PAYLOAD_SECRET` as the prior Azure app, so existing tokens/encrypted
   fields stay valid.)
3. Added `apphosting.yaml` referencing the secrets + public `NEXT_PUBLIC_*` vars.
   → commit `dcf7553`.
4. Triggered the final rollout. After the revision swap, all routes returned 200.

---

## Commits made (in order)

| Commit | What |
|---|---|
| `9f1c2b7` / `4b415db` | Regenerate `package-lock.json` so `npm ci` passes |
| `2e50096` | `tsconfig` excludes `functions/` + `dataconnect-generated/`; stop tracking debug logs / `.firebase/` |
| `ba09045` | All-platform `sharp` binaries in the lock file |
| `dcf7553` | `apphosting.yaml`: wire `DATABASE_URI` + `PAYLOAD_SECRET` + public env vars |

---

## Secrets & config created

- **Cloud Secret Manager:** `DATABASE_URI`, `PAYLOAD_SECRET` (each with backend
  IAM read access granted by the CLI).
- **`apphosting.yaml`:** `runConfig` (cpu 1, 1024 MiB, concurrency 80) + env block.
  Only secret **names** are committed — never values.

---

## Diagnosis techniques that mattered

- **Read the real logs, don't guess.** App Hosting build logs were retrieved via
  the Cloud Logging API with `resource.type="build"`; runtime errors via
  `severity>=ERROR` on the Cloud Run logs. Each fix targeted the literal error.
- **Reproduce the clean build server locally.** Deleting `functions/node_modules`
  and `.env.local`, then `npm run build`, mimics what App Hosting does and catches
  both the `functions/` and env-independence issues before pushing.
- **Verify behaviour, not just exit codes.** Final confirmation was HTTP 200s and
  real page `<title>`s + a valid Payload API response — not merely "rollout
  succeeded".

---

## Known follow-ups (not yet done)

1. **Do NOT delete the Azure `AllowAllPublicIPs` firewall rule.** It's what lets
   Cloud Run (dynamic egress IPs) reach the DB. Removing it returns the site to
   500 until a **VPC connector + Cloud NAT static IP** is set up on the Firebase
   side and that single IP is authorized on the DB.
2. **Rotate credentials** (DB password + `PAYLOAD_SECRET`) once the egress
   lockdown is in place — they were shared during setup.
3. **Custom domain** — add via Console → App Hosting → *Add custom domain*, then
   update `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_LOGIN_URL` in `apphosting.yaml`.
4. **`NEXT_PUBLIC_SITE_URL`** currently points at the `hosted.app` URL; switch it
   to the custom domain when added.
