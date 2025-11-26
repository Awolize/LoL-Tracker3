# syntax=docker/dockerfile:1

# 1. Base Stage
FROM node:24-alpine AS base
# Install compatibility libraries for Sharp/libc
RUN apk add --no-cache libc6-compat
# Enable corepack for pnpm
RUN corepack enable

WORKDIR /app

# 2. Dependencies Stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
# If you have a workspace file, keep this
COPY pnpm-workspace.yaml* ./ 

# Install dependencies (frozen lockfile is safer for reproducible builds)
RUN pnpm install --frozen-lockfile

# 3. Builder Stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .


# Build args for Sentry
ARG VITE_SENTRY_ORG=""
ARG VITE_SENTRY_PROJECT=""
ARG SENTRY_AUTH_TOKEN=""
ENV VITE_SENTRY_ORG=$VITE_SENTRY_ORG
ENV VITE_SENTRY_PROJECT=$VITE_SENTRY_PROJECT
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ENV NODE_ENV=production

# Build the app
RUN pnpm run build

# 4. Runner Stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Create user first
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 tanstack

# Copy the standalone output directory
# Nitro produces a self-contained .output folder containing server and public assets
COPY --from=builder --chown=tanstack:nodejs /app/.output ./.output
COPY --chown=tanstack:nodejs ./instrument.server.mjs ./.output/server

# Copy package.json just in case your start script relies on it (optional but good practice)
COPY --from=builder /app/package.json ./package.json

USER tanstack

EXPOSE 3000

# Health check (adjusted to use the PORT env var)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use the start script logic directly or the output file
# If you need the Sentry instrumentation (instrument.server.mjs), use the command below:
CMD ["node", "--import", "./.output/server/instrument.server.mjs", ".output/server/index.mjs"]