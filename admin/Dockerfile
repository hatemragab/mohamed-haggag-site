# syntax=docker/dockerfile:1
# ---------------------------------------------------------------------------
# admin/ — Next.js 16 admin panel, standalone output (multi-stage, non-root)
#
# NEXT_PUBLIC_* values are inlined into the client bundle at BUILD time, so
# they must be passed as --build-arg (changing them requires a rebuild).
# ---------------------------------------------------------------------------

FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate
WORKDIR /app

# --- deps: cached install layer ----------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# --- builder: next build (standalone) ----------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Baked into the browser bundle — override per environment with --build-arg.
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# --- runner: minimal standalone server, non-root ------------------------------
FROM node:24-alpine AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3001 \
    HOSTNAME=0.0.0.0
WORKDIR /app
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3001
CMD ["node", "server.js"]
