# Jatayu Web — Firebase App Hosting docs

This site (**Next.js 16 + Payload CMS 3 + PostgreSQL**) runs on **Firebase App
Hosting** (Cloud Run under the hood, so SSR / `/admin` / `/api/*` all work).
Three docs cover deploying and operating it:

| Doc | Use it when |
|---|---|
| **[FIREBASE-APP-HOSTING-SETUP.md](./FIREBASE-APP-HOSTING-SETUP.md)** | You want to set this code up on **your own** Firebase project + Cloud SQL, from scratch (Windows + VS Code). Includes all version pins and the two build fixes. |
| **[FIREBASE-DEPLOYMENT-PROCESS.md](./FIREBASE-DEPLOYMENT-PROCESS.md)** | You want the **record of the original go-live** — the 5 blockers we hit, how each was diagnosed and fixed, the commits made, and the open follow-ups. |
| **[MEDIA-STORAGE-SETUP.md](./MEDIA-STORAGE-SETUP.md)** | You want to put **media on a Google Cloud Storage bucket** — how storage is wired, the bucket structure, enabling GCS, and migrating existing media. |

## 30-second mental model

- **App** → Firebase App Hosting backend, auto-deploys on push to `main`.
- **Database** → PostgreSQL. Connection + Payload secret are **Cloud Secret
  Manager** secrets, referenced by name in `apphosting.yaml` (values never committed).
- **Media** → chosen by env var: `GCS_BUCKET` → Google Cloud Storage, else Azure
  Blob, else local disk. Files live in the bucket; **records live in the database**.
- **Config files:** `apphosting.yaml` (runtime + env/secrets),
  `src/payload.config.ts` (DB + storage wiring), `src/collections/Media.ts`
  (upload rules), `tsconfig.json` (must exclude `functions/`).

## Versions (pinned)

Node 20 local / 22 build · firebase-tools 15.19.0 · Next.js 16.2.4 · React 19.2.5 ·
Payload 3.84.1 (all `@payloadcms/*`) · sharp 0.34.5 · TypeScript 5 · Tailwind 3.4.1 ·
PostgreSQL 15/16. (Full table in the setup doc.)

## Golden rules

1. **Don't undo the build fixes** — `tsconfig` excludes `functions/` +
   `dataconnect-generated/`; the lock file holds **all-platform `sharp`** binaries.
2. **`PAYLOAD_SECRET` is forever** — changing it breaks existing logins/encrypted data.
3. **Media: upload via `/admin`**, not by dropping files in the bucket (no DB row = invisible).
4. **Don't open/lock the DB firewall blindly** — Cloud Run egress IPs are dynamic;
   a real lockdown needs a VPC connector + Cloud NAT static IP first.
