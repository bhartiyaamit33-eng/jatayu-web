#!/usr/bin/env bash
# Idempotent Azure deploy for Jatayu VoiceDocAI.
#
# Prereqs:
#   az login                            # interactive, once per machine
#   az account set --subscription <id>  # if you have multiple
#
# Usage:
#   bash infra/azure-deploy.sh                # full deploy from scratch (idempotent)
#   PUSH_IMAGE_ONLY=1 bash infra/azure-deploy.sh   # only rebuild + roll new revision
#
# Everything is named-prefixed with $PROJECT so you can deploy multiple
# environments side by side: PROJECT=jatayu-stg bash infra/azure-deploy.sh

set -euo pipefail

# ---------- configurable ----------
PROJECT="${PROJECT:-jatayu}"
ENV_NAME="${ENV_NAME:-prod}"
LOCATION="${LOCATION:-centralindia}"
PG_VERSION="${PG_VERSION:-16}"
PG_SKU="${PG_SKU:-Standard_B2s}"
PG_TIER="${PG_TIER:-Burstable}"
PG_STORAGE_GB="${PG_STORAGE_GB:-32}"
PG_ADMIN_USER="${PG_ADMIN_USER:-jatayu}"
PG_DB_NAME="${PG_DB_NAME:-jatayu_cms}"
IMAGE_TAG="${IMAGE_TAG:-$(date -u +%Y%m%d-%H%M%S)}"
PUBLIC_SITE_URL="${PUBLIC_SITE_URL:-}"  # set to https://www.jatayuhealth.com to wire CORS/CSRF
LOGIN_URL="${LOGIN_URL:-}"              # public URL for header Login button

# Derived names (lowercase, alphanumeric, prefix-deduplicated where Azure requires).
RG="rg-${PROJECT}-${ENV_NAME}"
ACR_NAME="${PROJECT}${ENV_NAME}acr$(printf '%s' "$RG" | shasum | head -c 4)"
KV_NAME="${PROJECT}-${ENV_NAME}-kv-$(printf '%s' "$RG" | shasum | head -c 4)"
PG_NAME="${PROJECT}-${ENV_NAME}-pg"
STORAGE_NAME="${PROJECT}${ENV_NAME}sa$(printf '%s' "$RG" | shasum | head -c 6)"
STORAGE_CONTAINER="media"
LAW_NAME="${PROJECT}-${ENV_NAME}-law"
AI_NAME="${PROJECT}-${ENV_NAME}-ai"
CAE_NAME="${PROJECT}-${ENV_NAME}-cae"
APP_NAME="${PROJECT}-${ENV_NAME}-app"
JOB_NAME="${PROJECT}-${ENV_NAME}-seed"
IMAGE_REPO="jatayu-web"

# Container names must be 5-50 chars, lowercase, alphanumeric or hyphen. Truncate if needed.
ACR_NAME="${ACR_NAME//-/}"
ACR_NAME="${ACR_NAME:0:50}"
STORAGE_NAME="${STORAGE_NAME//-/}"
STORAGE_NAME="${STORAGE_NAME:0:24}"

say() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m!! %s\033[0m\n' "$*"; }

# ---------- 0. preflight ----------
command -v az >/dev/null || { echo "az CLI is required."; exit 1; }
SUB_ID="$(az account show --query id -o tsv)"
say "Subscription: $SUB_ID"
say "Resource group: $RG  Location: $LOCATION"

# ---------- 1. resource group ----------
az group create -n "$RG" -l "$LOCATION" -o none

if [[ "${PUSH_IMAGE_ONLY:-0}" != "1" ]]; then
  # ---------- 2. providers ----------
  say "Registering resource providers (idempotent, may be a no-op)"
  for ns in Microsoft.ContainerRegistry Microsoft.App Microsoft.DBforPostgreSQL \
            Microsoft.Storage Microsoft.KeyVault Microsoft.OperationalInsights \
            Microsoft.Insights Microsoft.Cdn; do
    az provider register -n "$ns" --wait -o none
  done

  # ---------- 3. ACR ----------
  say "ACR: $ACR_NAME"
  az acr show -n "$ACR_NAME" -g "$RG" -o none 2>/dev/null \
    || az acr create -n "$ACR_NAME" -g "$RG" --sku Basic --admin-enabled false -o none

  # ---------- 4. Key Vault (RBAC mode) ----------
  say "Key Vault: $KV_NAME"
  az keyvault show -n "$KV_NAME" -g "$RG" -o none 2>/dev/null \
    || az keyvault create -n "$KV_NAME" -g "$RG" -l "$LOCATION" \
         --enable-rbac-authorization true --retention-days 7 -o none
  KV_ID="$(az keyvault show -n "$KV_NAME" -g "$RG" --query id -o tsv)"

  # Grant the current user temp access so we can write secrets.
  ME="$(az ad signed-in-user show --query id -o tsv)"
  az role assignment create --assignee-object-id "$ME" --assignee-principal-type User \
    --role "Key Vault Secrets Officer" --scope "$KV_ID" -o none 2>/dev/null || true

  # ---------- 5. Postgres Flexible Server ----------
  say "Postgres Flexible Server: $PG_NAME"
  if ! az postgres flexible-server show -n "$PG_NAME" -g "$RG" -o none 2>/dev/null; then
    PG_ADMIN_PASS="$(openssl rand -base64 24 | tr -d '+/=' | head -c 24)Aa1!"
    az postgres flexible-server create \
      --name "$PG_NAME" -g "$RG" -l "$LOCATION" \
      --tier "$PG_TIER" --sku-name "$PG_SKU" \
      --version "$PG_VERSION" --storage-size "$PG_STORAGE_GB" \
      --admin-user "$PG_ADMIN_USER" --admin-password "$PG_ADMIN_PASS" \
      --public-access 0.0.0.0 \
      --yes -o none
    az postgres flexible-server db create -g "$RG" --server-name "$PG_NAME" -d "$PG_DB_NAME" -o none
    az keyvault secret set --vault-name "$KV_NAME" --name pg-admin-password --value "$PG_ADMIN_PASS" -o none
    warn "Postgres admin password stored in Key Vault as 'pg-admin-password'."
  else
    PG_ADMIN_PASS="$(az keyvault secret show --vault-name "$KV_NAME" --name pg-admin-password --query value -o tsv 2>/dev/null || true)"
    if [[ -z "$PG_ADMIN_PASS" ]]; then
      warn "Postgres exists but password secret missing. Set 'pg-admin-password' in Key Vault manually."
    fi
  fi
  PG_HOST="$(az postgres flexible-server show -n "$PG_NAME" -g "$RG" --query fullyQualifiedDomainName -o tsv)"
  DATABASE_URI="postgres://${PG_ADMIN_USER}:${PG_ADMIN_PASS}@${PG_HOST}:5432/${PG_DB_NAME}?sslmode=require"

  # ---------- 6. Storage account + container ----------
  say "Storage: $STORAGE_NAME / container '$STORAGE_CONTAINER'"
  az storage account show -n "$STORAGE_NAME" -g "$RG" -o none 2>/dev/null \
    || az storage account create -n "$STORAGE_NAME" -g "$RG" -l "$LOCATION" \
         --sku Standard_LRS --kind StorageV2 --allow-blob-public-access false -o none
  STORAGE_KEY="$(az storage account keys list -n "$STORAGE_NAME" -g "$RG" --query '[0].value' -o tsv)"
  az storage container show -n "$STORAGE_CONTAINER" --account-name "$STORAGE_NAME" --account-key "$STORAGE_KEY" -o none 2>/dev/null \
    || az storage container create -n "$STORAGE_CONTAINER" --account-name "$STORAGE_NAME" --account-key "$STORAGE_KEY" --public-access blob -o none
  STORAGE_CONN="DefaultEndpointsProtocol=https;AccountName=${STORAGE_NAME};AccountKey=${STORAGE_KEY};EndpointSuffix=core.windows.net"

  # ---------- 7. Payload secret ----------
  PAYLOAD_SECRET="$(az keyvault secret show --vault-name "$KV_NAME" --name payload-secret --query value -o tsv 2>/dev/null || true)"
  if [[ -z "$PAYLOAD_SECRET" ]]; then
    PAYLOAD_SECRET="$(openssl rand -base64 48 | tr -d '\n')"
    az keyvault secret set --vault-name "$KV_NAME" --name payload-secret --value "$PAYLOAD_SECRET" -o none
    warn "PAYLOAD_SECRET generated and stored in Key Vault."
  fi
  az keyvault secret set --vault-name "$KV_NAME" --name database-uri --value "$DATABASE_URI" -o none
  az keyvault secret set --vault-name "$KV_NAME" --name azure-storage-connection-string --value "$STORAGE_CONN" -o none

  # ---------- 8. Log Analytics + App Insights ----------
  say "Log Analytics: $LAW_NAME, App Insights: $AI_NAME"
  az monitor log-analytics workspace show -n "$LAW_NAME" -g "$RG" -o none 2>/dev/null \
    || az monitor log-analytics workspace create -n "$LAW_NAME" -g "$RG" -l "$LOCATION" -o none
  LAW_ID="$(az monitor log-analytics workspace show -n "$LAW_NAME" -g "$RG" --query customerId -o tsv)"
  LAW_KEY="$(az monitor log-analytics workspace get-shared-keys -n "$LAW_NAME" -g "$RG" --query primarySharedKey -o tsv)"
  az monitor app-insights component show -a "$AI_NAME" -g "$RG" -o none 2>/dev/null \
    || az monitor app-insights component create -a "$AI_NAME" -g "$RG" -l "$LOCATION" --workspace "$LAW_NAME" -o none

  # ---------- 9. Container Apps Environment ----------
  say "Container Apps Environment: $CAE_NAME"
  az containerapp env show -n "$CAE_NAME" -g "$RG" -o none 2>/dev/null \
    || az containerapp env create -n "$CAE_NAME" -g "$RG" -l "$LOCATION" \
         --logs-workspace-id "$LAW_ID" --logs-workspace-key "$LAW_KEY" -o none
fi

# ---------- 10. Build + push image ----------
say "Building and pushing image: $ACR_NAME.azurecr.io/$IMAGE_REPO:$IMAGE_TAG"
az acr build -r "$ACR_NAME" -t "$IMAGE_REPO:$IMAGE_TAG" -t "$IMAGE_REPO:latest" \
  --file Dockerfile . -o none

ACR_LOGIN_SERVER="$(az acr show -n "$ACR_NAME" --query loginServer -o tsv)"

# ---------- 11. Container App (create or update) ----------
say "Container App: $APP_NAME"

PUBLIC_SITE_URL="${PUBLIC_SITE_URL:-}"
LOGIN_URL="${LOGIN_URL:-}"

if ! az containerapp show -n "$APP_NAME" -g "$RG" -o none 2>/dev/null; then
  # First-time create. Use managed identity + Key Vault secret references.
  az containerapp create \
    -n "$APP_NAME" -g "$RG" \
    --environment "$CAE_NAME" \
    --image "$ACR_LOGIN_SERVER/$IMAGE_REPO:$IMAGE_TAG" \
    --target-port 3000 --ingress external \
    --min-replicas 1 --max-replicas 3 \
    --cpu 0.5 --memory 1.0Gi \
    --system-assigned \
    --registry-server "$ACR_LOGIN_SERVER" --registry-identity system \
    -o none

  APP_IDENTITY_PID="$(az containerapp show -n "$APP_NAME" -g "$RG" --query identity.principalId -o tsv)"

  # Grant managed identity AcrPull + KV Secrets User.
  az role assignment create --assignee-object-id "$APP_IDENTITY_PID" --assignee-principal-type ServicePrincipal \
    --role AcrPull --scope "$(az acr show -n "$ACR_NAME" -g "$RG" --query id -o tsv)" -o none 2>/dev/null || true
  az role assignment create --assignee-object-id "$APP_IDENTITY_PID" --assignee-principal-type ServicePrincipal \
    --role "Key Vault Secrets User" --scope "$KV_ID" -o none 2>/dev/null || true

  # Wire secrets from Key Vault and env vars.
  az containerapp secret set -n "$APP_NAME" -g "$RG" \
    --secrets \
      payload-secret="keyvaultref:https://${KV_NAME}.vault.azure.net/secrets/payload-secret,identityref:system" \
      database-uri="keyvaultref:https://${KV_NAME}.vault.azure.net/secrets/database-uri,identityref:system" \
      azure-storage-connection-string="keyvaultref:https://${KV_NAME}.vault.azure.net/secrets/azure-storage-connection-string,identityref:system" \
    -o none

  az containerapp update -n "$APP_NAME" -g "$RG" \
    --set-env-vars \
      NODE_ENV=production \
      PAYLOAD_SECRET=secretref:payload-secret \
      DATABASE_URI=secretref:database-uri \
      AZURE_STORAGE_CONNECTION_STRING=secretref:azure-storage-connection-string \
      "AZURE_STORAGE_ACCOUNT_BASEURL=https://${STORAGE_NAME}.blob.core.windows.net" \
      "AZURE_STORAGE_CONTAINER_NAME=${STORAGE_CONTAINER}" \
      "NEXT_PUBLIC_SITE_URL=${PUBLIC_SITE_URL:-https://${APP_NAME}.placeholder}" \
      "NEXT_PUBLIC_LOGIN_URL=${LOGIN_URL:-https://${APP_NAME}.placeholder/admin}" \
    -o none
else
  # Subsequent deploys - just roll a new revision with the new image.
  az containerapp update -n "$APP_NAME" -g "$RG" \
    --image "$ACR_LOGIN_SERVER/$IMAGE_REPO:$IMAGE_TAG" -o none
fi

APP_FQDN="$(az containerapp show -n "$APP_NAME" -g "$RG" --query properties.configuration.ingress.fqdn -o tsv)"

say "Deploy complete."
printf '\n'
printf '  App URL    : https://%s\n' "$APP_FQDN"
printf '  Admin URL  : https://%s/admin\n' "$APP_FQDN"
printf '  Image      : %s/%s:%s\n' "$ACR_LOGIN_SERVER" "$IMAGE_REPO" "$IMAGE_TAG"
printf '  Key Vault  : %s\n' "$KV_NAME"
printf '  Postgres   : %s\n' "$PG_HOST"
printf '  Storage    : %s (container=%s)\n' "$STORAGE_NAME" "$STORAGE_CONTAINER"
printf '\nFirst-time login: visit /admin and create the first user.\n'
printf 'Then seed content:\n'
printf '  curl -X POST -H "x-seed-secret: $(az keyvault secret show --vault-name %s --name payload-secret --query value -o tsv)" \\\n' "$KV_NAME"
printf '    https://%s/api/seed\n\n' "$APP_FQDN"
