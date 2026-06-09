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

## Project docs

- [`PROGRESS.md`](PROGRESS.md) — build checklist.
- [`DECISIONS.md`](DECISIONS.md) — every architectural judgment call, with reasoning.
- [`CLAUDE.md`](CLAUDE.md) — orientation for AI-assisted development.
