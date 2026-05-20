# Azure deployment runbook

This directory contains everything needed to deploy `jatayu-web` to Microsoft Azure as a containerized Next.js + Payload CMS app.

## What gets created

| Resource | Service | Notes |
|---|---|---|
| `rg-jatayu-prod` | Resource Group | Region: `centralindia` |
| `jatayuprodacr...` | Container Registry | Basic SKU, no admin user. Pulled via managed identity. |
| `jatayu-prod-pg` | Postgres Flexible Server | v16, Burstable B2s, SSL required, public ingress with firewall. |
| `jatayuprodsa...` | Storage Account | Standard LRS, container `media` (blob-public read). |
| `jatayu-prod-kv-...` | Key Vault | RBAC mode. Holds `payload-secret`, `database-uri`, `pg-admin-password`, `azure-storage-connection-string`. |
| `jatayu-prod-law` | Log Analytics Workspace | Sink for Container Apps logs. |
| `jatayu-prod-ai` | Application Insights | Bound to the LAW. |
| `jatayu-prod-cae` | Container Apps Environment | Hosts the app. |
| `jatayu-prod-app` | Container App | 0.5 CPU / 1 Gi, 1-3 replicas, ingress on port 3000. |

## Two paths to deploy

### Path A — run from your Mac (fastest one-time deploy)

```bash
# 1. Install Azure CLI once.
brew install azure-cli

# 2. Sign in (opens a browser).
az login
az account set --subscription "<your-subscription-id>"

# 3. Deploy (idempotent - safe to re-run).
cd "/Users/amitbhartiya/Desktop/Jatayu Frontend/jatayu-web"
bash infra/azure-deploy.sh
```

The first run takes ~12-18 minutes (most of which is the Postgres Flexible Server provision and the initial `az acr build`). Subsequent runs that only roll a new revision take ~3-5 minutes.

To skip everything except the image build + revision roll:

```bash
PUSH_IMAGE_ONLY=1 bash infra/azure-deploy.sh
```

### Path B — push to GitHub and let CI deploy

Use this once everything is wired and you want every `main` push to deploy.

1. **One-time setup of OIDC federation** (no service principal secrets):
   ```bash
   # In Azure - create an App Registration for GitHub OIDC.
   APP_NAME="github-oidc-jatayu-web"
   APP_ID="$(az ad app create --display-name "$APP_NAME" --query appId -o tsv)"
   SP_ID="$(az ad sp create --id "$APP_ID" --query id -o tsv)"

   # Federate the GitHub repo + main branch.
   az ad app federated-credential create --id "$APP_ID" --parameters '{
     "name": "github-main",
     "issuer": "https://token.actions.githubusercontent.com",
     "subject": "repo:bhartiyaamit33-eng/jatayu-web:ref:refs/heads/main",
     "audiences": ["api://AzureADTokenExchange"]
   }'

   # Grant the SP Contributor over the resource group.
   az role assignment create \
     --assignee-object-id "$SP_ID" --assignee-principal-type ServicePrincipal \
     --role Contributor \
     --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/rg-jatayu-prod"
   ```

2. **Add three secrets to the GitHub repo** (`Settings -> Secrets and variables -> Actions`):
   - `AZURE_CLIENT_ID` -> the `APP_ID` printed above
   - `AZURE_TENANT_ID` -> `az account show --query tenantId -o tsv`
   - `AZURE_SUBSCRIPTION_ID` -> `az account show --query id -o tsv`

3. **Push to `main`.** The workflow in `.github/workflows/azure-deploy.yml` builds, pushes, and rolls a new revision.

## Verification checklist

After the first deploy completes, the script prints an FQDN like `jatayu-prod-app.<random>.centralindia.azurecontainerapps.io`. Hit these in order:

1. `GET https://<fqdn>/` -> 200, marketing site renders.
2. `GET https://<fqdn>/admin` -> 200, shows "Create your first user". Create it.
3. `GET https://<fqdn>/sitemap.xml` -> 200 with the curated routes.
4. Seed content (one-shot):
   ```bash
   SECRET="$(az keyvault secret show --vault-name <kv-name> --name payload-secret --query value -o tsv)"
   curl -X POST -H "x-seed-secret: $SECRET" https://<fqdn>/api/seed
   ```
5. Upload an image in `/admin -> Media`. Confirm it lands in the Azure Blob `media` container:
   ```bash
   az storage blob list --account-name <storage-name> --container-name media --output table
   ```
6. Submit the trial form at `/trial`. Confirm a row appears in `/admin -> Leads`.

## Custom domain (optional, do after the app is verified)

```bash
# 1. Add a CNAME at your DNS provider:
#    www.jatayuhealth.com  ->  <fqdn>

# 2. Add the hostname to the Container App and let Azure provision a managed cert.
az containerapp hostname add -n jatayu-prod-app -g rg-jatayu-prod --hostname www.jatayuhealth.com
az containerapp hostname bind -n jatayu-prod-app -g rg-jatayu-prod \
  --hostname www.jatayuhealth.com --validation-method CNAME --environment jatayu-prod-cae

# 3. Update env vars so CORS / CSRF / canonical URLs match.
az containerapp update -n jatayu-prod-app -g rg-jatayu-prod \
  --set-env-vars NEXT_PUBLIC_SITE_URL=https://www.jatayuhealth.com
```

For global edge + WAF, layer Azure Front Door Standard on top of the Container App's FQDN. The script does not provision Front Door by default - add it once you have a domain pointed at the app.

## Logs and rollback

```bash
# Tail live logs.
az containerapp logs tail -n jatayu-prod-app -g rg-jatayu-prod --follow

# List revisions.
az containerapp revision list -n jatayu-prod-app -g rg-jatayu-prod -o table

# Roll back to a previous revision.
az containerapp revision set-mode -n jatayu-prod-app -g rg-jatayu-prod --mode single
az containerapp revision activate -n jatayu-prod-app -g rg-jatayu-prod --revision <name>
```

## Postgres operations

```bash
# Connect with psql from your Mac (your IP must be in the firewall allowlist).
PGPASSWORD="$(az keyvault secret show --vault-name <kv> --name pg-admin-password --query value -o tsv)" \
  psql "host=jatayu-prod-pg.postgres.database.azure.com port=5432 dbname=jatayu_cms user=jatayu sslmode=require"

# Add your IP to the firewall (one-off).
MYIP="$(curl -s https://api.ipify.org)"
az postgres flexible-server firewall-rule create -g rg-jatayu-prod -n jatayu-prod-pg \
  --rule-name "my-laptop" --start-ip-address "$MYIP" --end-ip-address "$MYIP"

# Backups are automatic (7-day PITR by default on Flexible Server).
```

## Known constraints and what to do about them

- **`payload generate:types` does not work on Next 16.** Documented in `CMS-ACCESS.md`. The image build skips it. Runtime types still work via `import config from "@payload-config"`.
- **`generateStaticParams` on dynamic routes** is wrapped in try/catch so the image build does not need DB access. Pages still cache via `unstable_cache` at runtime.
- **Storage account public-blob read** is enabled at the container level so `/api/media/<id>` redirects resolve without SAS tokens. If you need private media, switch to SAS URLs and update the Payload adapter config.
- **No drip-email dispatcher is wired.** `trial-emails` rows exist in the CMS; deploying the dispatcher is separate work.

## Cost estimate at idle vs modest load (centralindia, May 2026 list prices)

| Resource | Idle / month | Modest load* / month |
|---|---:|---:|
| Container Apps (0.5 CPU / 1 Gi, 1 replica) | ~$15 | ~$25 |
| Postgres Flexible Server B2s + 32 GB | ~$32 | ~$32 |
| Container Registry Basic | ~$5 | ~$5 |
| Storage Account (LRS, <5 GB) | <$1 | ~$2 |
| Log Analytics + App Insights | ~$3 | ~$8 |
| Key Vault | <$1 | <$1 |
| **Total** | **~$56** | **~$73** |

*Modest load = ~1k daily visitors, ~10 daily admin users, ~10 MB/day media uploads. Front Door Standard (optional, +~$35/mo) and Azure Communication Services Email (separate) not included.
