# syntax=docker/dockerfile:1
# Simple single-stage build for smoke-testing
FROM node:25

RUN corepack enable
WORKDIR /app

# Install ALL deps (no split prod/dev)
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .

ARG VITE_SENTRY_ORG=""
ARG VITE_SENTRY_PROJECT=""
ARG SENTRY_AUTH_TOKEN=""
ENV VITE_SENTRY_ORG=$VITE_SENTRY_ORG
ENV VITE_SENTRY_PROJECT=$VITE_SENTRY_PROJECT
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ENV NODE_ENV=production

RUN pnpm run build \
  && test -f .output/server/index.mjs \
  && test -d .output/public/assets \
  && test -n "$(find .output/public/assets -maxdepth 1 -name '*.css' | head -n 1)"

# Runtime
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "--import", "./instrument.server.mjs", ".output/server/index.mjs"]