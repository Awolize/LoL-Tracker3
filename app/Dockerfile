# syntax=docker/dockerfile:1

# 1. Base Stage
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable
WORKDIR /app

# 2. Dependencies Stage (All deps for building)
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml* ./ 
RUN pnpm install --frozen-lockfile

# 3. Production Dependencies Stage
# We need this to get a clean node_modules with only prod deps (drizzle-orm, pg, etc.)
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml* ./ 
RUN pnpm install --prod --frozen-lockfile

# 4. Builder Stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_SENTRY_ORG=""
ARG VITE_SENTRY_PROJECT=""
ARG SENTRY_AUTH_TOKEN=""
ENV VITE_SENTRY_ORG=$VITE_SENTRY_ORG
ENV VITE_SENTRY_PROJECT=$VITE_SENTRY_PROJECT
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ENV NODE_ENV=production

RUN pnpm run build

# 5. Runner Stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 tanstack

# --- COPY MIGRATION ASSETS ---
COPY --chown=tanstack:nodejs prod-migrate.mjs ./
COPY --from=builder --chown=tanstack:nodejs /app/drizzle ./drizzle
COPY --from=prod-deps --chown=tanstack:nodejs /app/node_modules ./node_modules
# -----------------------------

COPY --from=builder --chown=tanstack:nodejs /app/.output ./.output
COPY --chown=tanstack:nodejs ./instrument.server.mjs ./.output/server
COPY --from=builder /app/package.json ./package.json

USER tanstack

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Chain the migration script BEFORE the server start
CMD ["sh", "-c", "node prod-migrate.mjs && node --import ./.output/server/instrument.server.mjs .output/server/index.mjs"]