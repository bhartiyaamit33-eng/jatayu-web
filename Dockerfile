# syntax=docker/dockerfile:1.7

# ---- deps: install production + dev deps with the lockfile ----
FROM node:20-bookworm-slim AS deps
WORKDIR /app

# libc6, libstdc++, ca-certs are already present in bookworm-slim.
# sharp ships prebuilt binaries for linux-x64/glibc - no native build needed here.
# (We avoid BuildKit-specific `RUN --mount=type=cache` so this image can be
# built by ACR's default builder, which does not enable BuildKit.)
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# ---- builder: produce .next/standalone ----
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Build needs devDeps (TypeScript, tailwind, eslint-config-next).
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry, force production posture for `next build`.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Payload's admin importMap (no-op if already up to date).
# This step needs DB env vars unset so it doesn't try to connect during the
# admin generation pass; payload.config.ts already falls back to the local
# Docker default if DATABASE_URI is unset, and unstable_cache wrappers in
# generateStaticParams swallow connection errors.
RUN npm run build

# ---- runner: minimal runtime image ----
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user.
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs --shell /usr/sbin/nologin nextjs

# Standalone output - server.js + the minimal node_modules subset Next traced.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# `next start` is replaced by `node server.js` in standalone mode.
CMD ["node", "server.js"]
