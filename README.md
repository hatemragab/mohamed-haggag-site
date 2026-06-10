# منصة الأستاذ محمد حجاج التعليمية — Haggag Academy

Production-grade Arabic, RTL-first e-learning platform: Arabic language foundation, UAE/Egypt/Azhar school curricula, Arabic for non-native speakers, and Quran — with an admin panel that controls **every** piece of content on the site.

Built from the hi-fi prototype in [`mohammed-haggag-courses_UI/`](mohammed-haggag-courses_UI/) (the design source of truth).

## Architecture

```
                        ┌──────────────────────────────┐
                        │   MongoDB (docker, :27018)    │
                        │   + mongo-express (:8081)     │
                        └──────────────▲───────────────┘
                                       │ Mongoose
                        ┌──────────────┴───────────────┐
                        │        api/  NestJS 11        │
                        │  :4000 · Swagger at /docs     │
                        │  JWT (httpOnly cookies)       │
                        │  roles: student / admin       │
                        │  PaymentProvider:             │
                        │    paymob │ stripe (mock)     │
                        └───▲───────────────────▲──────┘
                  cookies + │ REST               │ REST + cookies
                            │                    │
        ┌───────────────────┴────┐      ┌────────┴────────────────┐
        │   web/  Next.js 16     │      │   admin/  Next.js 16    │
        │   :3000 — student site │      │   :3001 — admin panel   │
        │   SSR (SEO, Arabic OG) │      │   dark navy theme       │
        └────────────────────────┘      └─────────────────────────┘
```

- **`api/`** — NestJS + Mongoose. Schemas: User, Category (embedded groups/levels), Lesson, Plan, Order, Testimonial, SiteContent (singleton), ContactMessage. Global JWT guard + roles guard.
- **`web/`** — public student site. Server components fetch from the API with `no-store` (admin edits show on the next refresh); interactivity in client components.
- **`admin/`** — separate admin app. Client-side pages behind an auth guard; every API mutation re-checked server-side by the `admin` role guard.

### The video rule (core business rule)

Lessons are **unlisted YouTube videos**. The DB stores only the validated 11-char `youtubeId` (any pasted URL form is parsed server-side). Public catalog payloads **never** contain `youtubeId`; `GET /lessons/:id/watch` returns it only when the lesson is a free preview, the user unlocked that category/plan, or the user is an admin. Enforced by `api/test/lesson-access.e2e-spec.ts`.

## Getting started (one command per line)

```bash
docker compose up -d                                          # MongoDB + mongo-express
pnpm --dir api i && pnpm --dir web i && pnpm --dir admin i    # install all three
pnpm i                                                        # root tools (concurrently)
pnpm seed                                                     # all content + admin user
pnpm dev                                                      # api :4000 + web :3000 + admin :3001
```

| URL | What |
|---|---|
| http://localhost:3000 | Student site |
| http://localhost:3001 | Admin panel — sign in with `admin` / `admin123` |
| http://localhost:4000/docs | Swagger API docs |
| http://localhost:8081 | mongo-express (`admin` / `admin123`) |

Tests: `pnpm --dir api test:e2e` (lesson-gating e2e; needs the docker Mongo, uses a separate `haggag_e2e` database).

## Environment variables

Copied automatically from the committed `.env` / `.env.local` defaults; `.env.example` files document them.

**`api/.env`**

| var | default | purpose |
|---|---|---|
| `PORT` | `4000` | API port |
| `MONGO_URI` | `mongodb://127.0.0.1:27018/haggag` | database |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | dev values | sign tokens — change in prod |
| `WEB_ORIGIN` / `ADMIN_ORIGIN` | `http://localhost:3000` / `:3001` | CORS allow-list |
| `COOKIE_SECURE` | `false` | set `true` behind HTTPS |

**`web/.env.local`**

| var | default | purpose |
|---|---|---|
| `API_URL` | `http://localhost:4000` | server-side fetches |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | browser fetches (cookies) |
| `NEXT_PUBLIC_ADMIN_URL` | `http://localhost:3001` | footer «دخول الإدارة» link |

**`admin/.env.local`**

| var | default | purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | browser fetches (cookies) |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | «عرض الموقع» link |

## Content management

Everything the visitor sees comes from MongoDB and is editable in the admin panel: hero copy, instructor bio/credentials/stats, the six course tracks with their level trees, lessons (YouTube links with live validation, in-panel playback preview, reordering, free-preview toggle), plan prices in AED/EGP/USD, testimonials (first 3 appear on the homepage), FAQ, "why us" cards, learning outcomes, access steps, contact info, terms, and the footer blurb. Re-running `pnpm seed` restores the original content without touching registered students.

## Production deployment

Everything ships as Docker images: `api/Dockerfile` (NestJS, multi-stage pnpm build), `web/Dockerfile` and `admin/Dockerfile` (Next.js `output: "standalone"`), orchestrated by `docker-compose.prod.yml` (mongo:7 with a named volume and **no host port**, api `:4000`, web `:3000`, admin `:3001`, all `restart: unless-stopped`).

```bash
cp .env.prod.example .env.prod    # fill in REAL values (see table below)
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

Then seed the database (content + admin user) **inside** the running api container:

```bash
docker compose -f docker-compose.prod.yml exec api node dist/seed/seed.js
```

### `.env.prod` variables

| var | example | purpose |
|---|---|---|
| `JWT_ACCESS_SECRET` | `openssl rand -hex 32` | signs access tokens — **required**, never reuse dev values |
| `JWT_REFRESH_SECRET` | `openssl rand -hex 32` (different) | signs refresh tokens — **required** |
| `WEB_ORIGIN` | `https://example.com` | student-site origin for the API CORS allow-list |
| `ADMIN_ORIGIN` | `https://admin.example.com` | admin-panel origin for CORS |
| `NEXT_PUBLIC_API_URL` | `https://api.example.com` | API URL **baked into both browser bundles at build time** |
| `NEXT_PUBLIC_ADMIN_URL` | `https://admin.example.com` | «دخول الإدارة» footer link (web build arg) |
| `NEXT_PUBLIC_SITE_URL` | `https://example.com` | «عرض الموقع» link (admin build arg) |
| `COOKIE_SECURE` | `true` | secure auth cookies — keep `true` behind HTTPS |
| `COOKIE_SAMESITE` | `lax` | `none` only if the API is on a different registrable domain |
| `TRUST_PROXY` | `1` | trust `X-Forwarded-*` from your reverse proxy |
| `ADMIN_PASSWORD` | strong password | password applied to the `admin` user by the seed |

`NEXT_PUBLIC_*` values are **build args** — Next.js inlines them into the client JS, so changing one means re-running `up -d --build`. The web app's server-side fetches use the runtime env `API_URL` instead (compose sets it to `http://api:4000` on the internal network — no rebuild needed).

### Hardening checklist

- [ ] **Change the seeded admin password**: set a strong `ADMIN_PASSWORD` in `.env.prod` and re-run the seed command above (never keep `admin123`).
- [ ] **Strong JWT secrets**: two different `openssl rand -hex 32` values for access/refresh.
- [ ] **`COOKIE_SECURE=true`** — mandatory once you serve HTTPS (and you must serve HTTPS).
- [ ] **`SWAGGER_ENABLED=false`** — the prod compose pins it off; don't expose `/docs` publicly.
- [ ] **Reverse proxy + TLS in front** (nginx / Caddy / Traefik) terminating HTTPS for ports 3000/3001/4000, with `TRUST_PROXY=1` so the API sees real client IPs.
- [ ] **Same registrable domain** for web + admin + api (e.g. `example.com` / `admin.example.com` / `api.example.com`) so the `SameSite=Lax` auth cookies flow — otherwise set `COOKIE_SAMESITE=none` (HTTPS required).
- [ ] **Mongo is not exposed** — it has no host port; only the apps on the compose network can reach it.
- [ ] **Backups**: Mongo data lives in the `mongo_prod_data` named volume — e.g. `docker compose -f docker-compose.prod.yml exec mongo mongodump --archive --db haggag > backup-$(date +%F).archive` on a cron.

## Project docs

- [`PROGRESS.md`](PROGRESS.md) — build checklist.
- [`DECISIONS.md`](DECISIONS.md) — every architectural judgment call, with reasoning.
- [`CLAUDE.md`](CLAUDE.md) — orientation for AI-assisted development.
