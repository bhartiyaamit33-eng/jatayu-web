# Deploy Jatayu Web to Google Cloud (Windows)

Step-by-step to host the Jatayu marketing site (Next.js 16 + Payload 3) on
Google Cloud, with the database on **Cloud SQL for PostgreSQL** and media on
**Cloud Storage (GCS)**.

> **Do NOT use the "Firebase SQL Connect" / Data Connect extension for this
> site.** Data Connect owns its own schema; Payload also owns its Postgres
> schema. Pointing both at one database breaks the CMS. We use a *plain* Cloud
> SQL Postgres instance that Payload connects to directly via `DATABASE_URI`.
> (Data Connect is only appropriate for a separate, brand-new app — e.g. the
> Clinika/FastAPI service — not for this Payload site.)

There are two hosting options. Both are 100% Google Cloud:

- **Option A — Cloud Run** (recommended): matches the existing `Dockerfile` and
  the `host=/cloudsql/...` connection string already in `.env.example`.
- **Option B — Firebase App Hosting**: the Firebase-branded layer on top of
  Cloud Run; adds git-push-to-deploy.

---

## 0. Install tools (PowerShell as Administrator)

```powershell
winget install OpenJS.NodeJS.LTS
winget install Google.CloudSDK
npm install -g firebase-tools
```

Close & reopen PowerShell, then verify:

```powershell
node -v ; gcloud --version ; firebase --version
```

---

## 1. Create the project + enable billing

Cloud SQL, Cloud Run, and App Hosting require the **Blaze (pay-as-you-go)** plan.

```powershell
gcloud auth login
gcloud projects create jatayu-prod --name="Jatayu"
gcloud config set project jatayu-prod
```

Link a billing account in the console:
https://console.cloud.google.com/billing → link to `jatayu-prod`.

Enable APIs:

```powershell
gcloud services enable sqladmin.googleapis.com run.googleapis.com `
  cloudbuild.googleapis.com artifactregistry.googleapis.com `
  storage.googleapis.com secretmanager.googleapis.com `
  firebase.googleapis.com firebasehosting.googleapis.com
```

---

## 2. Create the database (Cloud SQL for PostgreSQL)

```powershell
# Postgres instance (smallest tier; bump later as needed)
gcloud sql instances create jatayu-pg `
  --database-version=POSTGRES_16 `
  --tier=db-f1-micro `
  --region=us-central1

# admin password
gcloud sql users set-password postgres --instance=jatayu-pg --password="STRONG_ADMIN_PW"

# app database + dedicated user
gcloud sql databases create jatayu_cms --instance=jatayu-pg
gcloud sql users create jatayu --instance=jatayu-pg --password="STRONG_APP_PW"
```

Get the instance connection name (`PROJECT:REGION:INSTANCE`):

```powershell
gcloud sql instances describe jatayu-pg --format="value(connectionName)"
# -> jatayu-prod:us-central1:jatayu-pg
```

Your connection string (unix-socket form, as documented in `.env.example`):

```
postgres://jatayu:STRONG_APP_PW@/jatayu_cms?host=/cloudsql/jatayu-prod:us-central1:jatayu-pg
```

---

## 3. Create the media bucket (GCS)

```powershell
gcloud storage buckets create gs://jatayu-prod-media --location=us-central1
```

This maps to the `GCS_BUCKET=jatayu-prod-media` env var the app already reads.

---

## 4. Store secrets in Secret Manager

```powershell
# Payload secret (generate a strong random value)
echo "REPLACE_WITH_RANDOM_48_CHARS" | gcloud secrets create PAYLOAD_SECRET --data-file=-

# Database URI
echo "postgres://jatayu:STRONG_APP_PW@/jatayu_cms?host=/cloudsql/jatayu-prod:us-central1:jatayu-pg" | gcloud secrets create DATABASE_URI --data-file=-
```

---

## Option A — Deploy to Cloud Run (recommended)

The existing `Dockerfile` builds a Next.js standalone image. Deploy straight
from source — Cloud Build builds the Dockerfile for you:

```powershell
cd D:\JatayuProducts\website\jatayu-web

gcloud run deploy jatayu-web `
  --source . `
  --region us-central1 `
  --allow-unauthenticated `
  --add-cloudsql-instances jatayu-prod:us-central1:jatayu-pg `
  --set-env-vars "NODE_ENV=production,GCS_BUCKET=jatayu-prod-media,NEXT_PUBLIC_SITE_URL=https://jatayuhealth.com" `
  --set-secrets "DATABASE_URI=DATABASE_URI:latest,PAYLOAD_SECRET=PAYLOAD_SECRET:latest"
```

`--add-cloudsql-instances` mounts the Cloud SQL unix socket at
`/cloudsql/...`, which is exactly what the `DATABASE_URI` above expects.

Cloud Run prints a service URL when done — open it to confirm the site and
`/admin` load.

---

## Option B — Deploy to Firebase App Hosting

App Hosting deploys from a **GitHub repo**, so push the code to GitHub first
(the repo already has `.git` + a `.github/` workflow).

```powershell
cd D:\JatayuProducts\website\jatayu-web
firebase login
firebase init apphosting     # link GitHub repo + branch (main)
```

Create `apphosting.yaml` in the repo root:

```yaml
runConfig:
  cpu: 1
  memoryMiB: 1024
env:
  - variable: NODE_ENV
    value: production
  - variable: GCS_BUCKET
    value: jatayu-prod-media
  - variable: NEXT_PUBLIC_SITE_URL
    value: https://jatayuhealth.com
  - variable: DATABASE_URI
    secret: DATABASE_URI
  - variable: PAYLOAD_SECRET
    secret: PAYLOAD_SECRET
```

Grant the App Hosting backend's service account the **Cloud SQL Client** role
and attach the instance (console → App Hosting → backend → settings), then:

```powershell
git push origin main     # triggers build + deploy
```

---

## 5. Initialize the Payload schema

On first boot Payload's Postgres adapter pushes its schema automatically. To run
it manually/controlled from Windows:

1. Start the Cloud SQL Auth Proxy pointing at the instance, **or** temporarily
   enable a public IP + authorized network.
2. Set `DATABASE_URI` locally to the proxy/public-IP connection string.
3. Run `npm run payload migrate` (or just let the first deploy auto-push).

---

## 6. Custom domain

Cloud Run: console → Cloud Run → service → **Manage custom domains** → add
`jatayuhealth.com` → add the DNS records shown at your registrar.

App Hosting: console → App Hosting → backend → **Add custom domain**.

---

## Summary of what maps to what

| Diagram box            | Real Google Cloud resource                |
|------------------------|-------------------------------------------|
| "Local Code Base"      | this repo in VSCode                       |
| "SQL Connect" / "DB"   | **Cloud SQL for PostgreSQL** (`jatayu-pg`)|
| Website hosting        | Cloud Run *or* Firebase App Hosting       |
| Media uploads          | Cloud Storage bucket (`jatayu-prod-media`)|

**Not used:** Firebase Data Connect extension (conflicts with Payload's schema).
