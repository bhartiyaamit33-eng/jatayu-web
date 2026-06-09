#!/usr/bin/env bash
#
# migrate-postgres.sh
# -------------------
# One-shot logical migration: pg_dump from SOURCE_URI → pg_restore into TARGET_URI.
#
# Usage:
#   SOURCE_URI='postgres://...' TARGET_URI='postgres://...' bash scripts/migrate-postgres.sh
#
# Requires: pg_dump and pg_restore (postgresql-client package / brew install libpq).
# Safe: does not modify or delete the source database.

set -euo pipefail

redact_uri() {
  local uri="$1"
  echo "${uri//:*@/:****@}"
}

if [[ -z "${SOURCE_URI:-}" ]]; then
  echo "❌ SOURCE_URI is required (current production Postgres)." >&2
  exit 1
fi

if [[ -z "${TARGET_URI:-}" ]]; then
  echo "❌ TARGET_URI is required (new Neon / Supabase / Railway Postgres)." >&2
  exit 1
fi

if ! command -v pg_dump >/dev/null 2>&1 || ! command -v pg_restore >/dev/null 2>&1; then
  echo "❌ pg_dump and pg_restore are required." >&2
  echo "   macOS: brew install libpq && brew link --force libpq" >&2
  echo "   Ubuntu: sudo apt install postgresql-client" >&2
  exit 1
fi

DUMP_FILE="$(mktemp /tmp/jatayu-pg-dump.XXXXXX.custom)"
trap 'rm -f "${DUMP_FILE}"' EXIT

echo "→ Source: $(redact_uri "${SOURCE_URI}")"
echo "→ Target: $(redact_uri "${TARGET_URI}")"
echo "→ Dumping (custom format, no owner/ACL)…"

pg_dump "${SOURCE_URI}" \
  --format=custom \
  --no-owner \
  --no-acl \
  --file="${DUMP_FILE}"

echo "→ Restoring into target (may take several minutes)…"

pg_restore \
  --dbname="${TARGET_URI}" \
  --no-owner \
  --no-acl \
  --verbose \
  "${DUMP_FILE}" 2>&1 | tail -20

echo ""
echo "✅ Migration finished."
echo "   Next steps:"
echo "   1. DATABASE_URI=\"\${TARGET_URI}\" npm run sync-prod-schema"
echo "   2. firebase apphosting:secrets:set DATABASE_URI"
echo "   3. Smoke-test /admin and the public site"
echo "   See docs/DATABASE-HOSTING-OPTIONS.md"
