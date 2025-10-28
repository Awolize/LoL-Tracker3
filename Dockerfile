# syntax=docker/dockerfile:1

# Base stage with Node.js
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Dependencies stage
FROM base AS deps

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set build-time environment variables
ARG DATABASE_URL
ARG RIOT_API_KEY
ARG MINIO_ENDPOINT
ARG MINIO_PORT
ARG MINIO_ACCESS_KEY
ARG MINIO_SECRET_KEY
ARG VITE_SENTRY_ORG
ARG VITE_SENTRY_PROJECT
ARG SENTRY_AUTH_TOKEN

ENV DATABASE_URL=$DATABASE_URL
ENV RIOT_API_KEY=$RIOT_API_KEY
ENV MINIO_ENDPOINT=$MINIO_ENDPOINT
ENV MINIO_PORT=$MINIO_PORT
ENV MINIO_ACCESS_KEY=$MINIO_ACCESS_KEY
ENV MINIO_SECRET_KEY=$MINIO_SECRET_KEY
ENV VITE_SENTRY_ORG=$VITE_SENTRY_ORG
ENV VITE_SENTRY_PROJECT=$VITE_SENTRY_PROJECT
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ENV NODE_ENV=production

# Build the application
RUN pnpm run build

# Runner stage
FROM base AS runner

# Set working directory
WORKDIR /app

# Copy built application from builder (Nitro output)
COPY --from=builder /app/.output ./.output

# Set runtime environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S tanstack -u 1001 -G nodejs && \
    chown -R tanstack:nodejs /app

USER tanstack

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application using Nitro's output
CMD ["node", ".output/server/index.mjs"]
