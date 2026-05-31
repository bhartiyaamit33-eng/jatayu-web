# Deploying jatayu-web to Google Cloud (Cloud Run)

This runbook moves the app from Azure Container Apps to **Google Cloud Run**, with
**Cloud SQL for PostgreSQL** for the database and **Cloud Storage (GCS)** for media
uploads.

> **Why not Firebase?** Payload CMS requires a real PostgreSQL server. Firebase's
> databases (Firestore / Realtime DB) are NoSQL and are not compatible with
> Payload's Postgres adapter. The Google-native database for this app is **Cloud
> SQL for PostgreSQL**.

The app-side code changes are already done:
- `@payloadcms/storage-gcs` added; `payload.config.ts` uses GCS when `GCS_BUCKET`
  is set (Azure remains as a fallback during the transition).
- `.env.example` documents the GCS + Cloud SQL variables.

What remains is the cloud setup below. None of it has been run for you.

---

## 0. Prerequisites

```bash
gcloud components install beta            # if needed
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

Set some shell variables used throughout:

```bash
export PROJECT_ID=your-gcp-project-id
export REGION=asia-south1                 # Mumbai; pick the region nearest users
export REPO=jatayu                         # Artifact Registry repo name
export SERVICE=jatayu-web                  # Cloud Run service name
export SQL_INSTANCE=jatayu-pg              # Cloud SQL instance name
export DB_NAME=jatayu_cms
export DB_USER=jatayu
export BUCKET=${PROJECT_ID}-jatayu-media
```

Enable the APIs:

```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  storage.googleapis.com
```

---

## 1. Cloud SQL for PostgreSQL (the database)

```bash
# Create the instance (Postgres 16). Adjust tier/size for your load.
gcloud sql instances create ${SQL_INSTANCE} \
  --database-version=POSTGRES_16 \
  --tier=db-custom-1-3840 \
  --region=${REGION} \
  --storage-size=20GB \
  --storage-auto-increase

# Database + application user
gcloud sql databases create ${DB_NAME} --instance=${SQL_INSTANCE}
gcloud sql users create ${DB_USER} --instance=${SQL_INSTANCE} --password='CHOOSE_A_STRONG_PASSWORD'

# Note the connection name (PROJECT:REGION:INSTANCE) — you'll need it below.
gcloud sql instances describe ${SQL_INSTANCE} --format='value(connectionName)'
```

The Cloud Run → Cloud SQL connection uses a **Unix socket**, so the
`DATABASE_URI` looks like:

```
postgres://jatayu:STRONG_PASSWORD@/jatayu_cms?host=/cloudsql/PROJECT:REGION:INSTANCE
```

---

## 2. Cloud Storage bucket (media uploads)

Cloud Run's filesystem is **ephemeral**, so uploaded media MUST live in GCS.

```bash
gcloud storage buckets create gs://${BUCKET} --location=${REGION} --uniform-bucket-level-access

# If media must be publicly readable on the site (typical for a marketing site):
gcloud storage buckets add-iam-policy-binding gs://${BUCKET} \
  --member=allUsers --role=roles/storage.objectViewer
```

`next.config.mjs` already allows `storage.googleapis.com` as a remote image host.

---

## 3. Secrets (Secret Manager)

```bash
# Payload secret (sign/encrypt cookies). Generate with: openssl rand -base64 48
printf '%s' 'YOUR_PAYLOAD_SECRET' | gcloud secrets create payload-secret --data-file=-

# Full DB connection string (use the Unix-socket form from step 1).
printf '%s' 'postgres://jatayu:STRONG_PASSWORD@/jatayu_cms?host=/cloudsql/PROJECT:REGION:INSTANCE' \
  | gcloud secrets create database-uri --data-file=-
```

---

## 4. Service account for Cloud Run

```bash
gcloud iam service-accounts create jatayu-run --display-name="jatayu-web Cloud Run"
export SA=jatayu-run@${PROJECT_ID}.iam.gserviceaccount.com

# Read media bucket + connect to Cloud SQL + read the secrets.
gcloud projects add-iam-policy-binding ${PROJECT_ID} --member="serviceAccount:${SA}" --role=roles/cloudsql.client
gcloud projects add-iam-policy-binding ${PROJECT_ID} --member="serviceAccount:${SA}" --role=roles/secretmanager.secretAccessor
gcloud storage buckets add-iam-policy-binding gs://${BUCKET} --member="serviceAccount:${SA}" --role=roles/storage.objectAdmin
```

The service account is how GCS auth works in production via **Application Default
Credentials** — no key file is shipped in the image.

---

## 5. Build & push the image (Artifact Registry + Cloud Build)

```bash
gcloud artifacts repositories create ${REPO} \
  --repository-format=docker --location=${REGION}

export IMAGE=${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${SERVICE}

# Cloud Build uses the existing Dockerfile (standalone Next.js output).
gcloud builds submit --tag ${IMAGE}:latest .
```

---

## 6. Sync the database schema BEFORE first deploy

Production runs with `push: false` (see `payload.config.ts`), so the schema must
be applied deliberately. Run the existing sync script against Cloud SQL using the
**Cloud SQL Auth Proxy**:

```bash
# Terminal A — start the proxy (downloads from cloud.google.com/sql/docs/postgres/sql-proxy)
./cloud-sql-proxy PROJECT:REGION:INSTANCE --port 5432

# Terminal B — point the sync script at the proxy
DATABASE_URI='postgres://jatayu:STRONG_PASSWORD@localhost:5432/jatayu_cms' \
  npm run sync-prod-schema
```

Re-run this step before any future deploy that adds/changes collections or fields.

---

## 7. Deploy to Cloud Run

```bash
gcloud run deploy ${SERVICE} \
  --image=${IMAGE}:latest \
  --region=${REGION} \
  --service-account=${SA} \
  --allow-unauthenticated \
  --add-cloudsql-instances=PROJECT:REGION:INSTANCE \
  --min-instances=1 \
  --cpu=1 --memory=1Gi \
  --set-env-vars=NODE_ENV=production,GCS_BUCKET=${BUCKET},NEXT_PUBLIC_SITE_URL=https://jatayuhealth.com \
  --set-secrets=PAYLOAD_SECRET=payload-secret:latest,DATABASE_URI=database-uri:latest
```

Notes:
- `--min-instances=1` avoids slow cold starts (Payload init is heavy). Drop to 0
  to scale to zero if cost matters more than first-request latency.
- `--add-cloudsql-instances` is what makes the `/cloudsql/...` Unix socket appear.
- Only `GCS_BUCKET` is needed for storage — credentials come from `--service-account`.

After deploy, create the first admin user at `https://<run-url>/admin`.

---

## 8. Custom domain & CORS

- Map your domain in Cloud Run (`gcloud run domain-mappings create`) or front it
  with a global HTTPS load balancer / Cloud CDN.
- Ensure `NEXT_PUBLIC_SITE_URL` matches the public origin — Payload derives its
  CORS and CSRF allowlists from it (`payload.config.ts` lines ~157–162).

---

## 9. CI/CD — GitHub Actions

`.github/workflows/gcp-deploy.yml` replaces the old Azure workflow. On push to
`main` it authenticates via **Workload Identity Federation** (no JSON keys),
builds with Cloud Build, pushes to Artifact Registry, and rolls a Cloud Run
revision.

One-time setup so it can run:

1. **Workload Identity Federation** — create a pool + provider bound to this
   GitHub repo, and a deploy service account the provider can impersonate:
   ```bash
   gcloud iam workload-identity-pools create github --location=global
   gcloud iam workload-identity-pools providers create-oidc github \
     --location=global --workload-identity-pool=github \
     --issuer-uri="https://token.actions.githubusercontent.com" \
     --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
     --attribute-condition="assertion.repository=='bhartiyaamit33-eng/jatayu-web'"

   gcloud iam service-accounts create jatayu-deploy --display-name="jatayu-web CI deploy"
   export DEPLOY_SA=jatayu-deploy@${PROJECT_ID}.iam.gserviceaccount.com
   for role in run.admin cloudbuild.builds.editor artifactregistry.writer iam.serviceAccountUser; do
     gcloud projects add-iam-policy-binding ${PROJECT_ID} \
       --member="serviceAccount:${DEPLOY_SA}" --role="roles/${role}"
   done
   # Let the GitHub repo impersonate the deploy SA:
   gcloud iam service-accounts add-iam-policy-binding ${DEPLOY_SA} \
     --role=roles/iam.workloadIdentityUser \
     --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/bhartiyaamit33-eng/jatayu-web"
   ```

2. **GitHub repo Secrets:** `GCP_WORKLOAD_IDENTITY_PROVIDER` (full provider
   resource name), `GCP_DEPLOY_SERVICE_ACCOUNT` (the `jatayu-deploy@...` email).

3. **GitHub repo Variables:** `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_AR_REPO`,
   `GCP_RUN_SERVICE`, `GCP_RUN_SERVICE_ACCOUNT` (the runtime SA from step 4),
   `GCP_SQL_CONNECTION` (`PROJECT:REGION:INSTANCE`), `GCS_BUCKET`,
   `NEXT_PUBLIC_SITE_URL`.

> ⚠️ Until this setup is done, pushes to `main` will trigger the workflow and it
> will **fail** at the auth step. That's expected during migration — finish the
> resource setup (steps 1–8) before relying on auto-deploy.

---

## Rollback / coexistence

The Azure path still works: if `GCS_BUCKET` is unset and the Azure vars + 
`NODE_ENV=production` are present, Payload uses Azure Blob. This lets you keep the
Azure deployment live until the Cloud Run cutover is verified.
