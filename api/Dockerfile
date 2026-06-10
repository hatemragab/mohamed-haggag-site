# syntax=docker/dockerfile:1
# ---------------------------------------------------------------------------
# api/ — NestJS 11 production image (multi-stage, pnpm, non-root)
#   build:  docker build -t haggag-api ./api
#   run:    docker run -p 4000:4000 --env-file .env haggag-api
# ---------------------------------------------------------------------------

FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate
WORKDIR /app

# --- deps: full install (dev deps are needed for `nest build`) --------------
# Only package.json + pnpm-lock.yaml here, so this layer caches across
# source-only changes.
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# --- build: compile TypeScript -> dist/ (includes dist/seed/seed.js) --------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# --- prod-deps: fresh install with production deps only ---------------------
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# --- runtime: dist + prod node_modules, non-root -----------------------------
FROM node:24-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
USER node
EXPOSE 4000
CMD ["node", "dist/main.js"]
