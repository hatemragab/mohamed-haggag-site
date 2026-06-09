# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Haggag Academy** (منصة الأستاذ محمد حجاج التعليمية) — an Arabic, RTL-first e-learning platform: Arabic language, school curricula (UAE/Egypt/Azhar), Arabic for non-native speakers, and Quran. The hi-fi prototype in `mohammed-haggag-courses_UI/` is the design/UX source of truth (screenshots in its `screenshots/`); the production system lives in three sibling projects. `DECISIONS.md` records every architectural judgment call; `PROGRESS.md` tracks build status.

## Workspace layout (3 independent pnpm projects + shared root)

- **`api/`** — NestJS 11 + Mongoose (MongoDB), TypeScript strict. Port **4000**. Swagger at `/docs`.
- **`web/`** — Next.js 16.2.8 App Router (TS, Tailwind v4) — public student site. Port **3000**.
- **`admin/`** — Next.js 16.2.8 App Router — separate admin panel app (dark navy theme). Port **3001**.
- Root: `docker-compose.yml` (mongo:7 + mongo-express on 8081), convenience `package.json` (`pnpm seed`, `pnpm dev`, `pnpm build`, `pnpm lint` fan out to the projects).

## Getting started

```bash
docker compose up -d        # MongoDB + mongo-express (8081, admin/admin123)
pnpm --dir api i && pnpm --dir web i && pnpm --dir admin i
pnpm seed                   # loads ALL content + admin user (admin / admin123)
pnpm dev                    # api:4000 + web:3000 + admin:3001 concurrently
```

E2e (lesson gating): `pnpm --dir api test:e2e` (uses the docker Mongo, separate `haggag_e2e` db).

## Core business rule — YouTube unlisted videos

Lessons are unlisted YouTube videos; the platform stores only the validated 11-char `youtubeId` (extracted server-side in `api/src/common/utils/youtube.ts`, same regex as the prototype's `ytId()`). **Locked ids must never reach any client**: public catalog payloads omit `youtubeId` entirely; `GET /lessons/:id/watch` returns it only when the lesson is `free` OR the user unlocked the category (single purchase) / everything (monthly/bundle) OR is admin. Covered by `api/test/lesson-access.e2e-spec.ts` — keep it green.

## Architecture notes (the parts that span multiple files)

- **Auth**: JWT access (15m) + refresh (7d) in httpOnly cookies (`access_token`/`refresh_token`, SameSite=Lax — works across localhost ports). Global `JwtAuthGuard` (APP_GUARD) + `@Public()` decorator: public routes still populate `req.user` when a token is present (this powers optional-auth on `/watch`). `RolesGuard` + `@Roles('admin')` for admin endpoints. Refresh tokens are rotated and hash-stored on the user. Admin signs in with username `admin` via `POST /auth/admin/login`; students with email.
- **Content model**: `Category` embeds its level tree (`groups[]` only for Azhar; otherwise `levels[]`). `Lesson` is a separate collection keyed by `category + groupKey|null + levelKey` with an `order` field. `SiteContent` is a singleton (key `'main'`) holding every admin-editable site text (hero, instructor, why, learnSection, learn, accessSteps, faq, contact, terms, footerText). Plans are keyed `single|monthly|bundle` with AED/EGP/USD prices.
- **Payments**: `PaymentProvider` interface with mock `paymob`/`stripe` adapters (`api/src/orders/payments/payment-provider.ts`). Flow: `POST /orders` (pending, snapshot amount+planName) → `POST /orders/:id/pay` (confirm → paid → `UsersService.applyUnlock`). Real PSPs plug in behind the same interface.
- **Seed** (`api/src/seed/`): the ONLY place prototype content lives in code. `genLessons()` there replicates the prototype's deterministic generator (5–8 lessons/level, first free). Re-running replaces content collections but never touches student users.
- **Web app pattern**: thin server `page.tsx` (metadata + `serverApi()` fetch with `cache:'no-store'` so admin edits show on refresh) + one `*-client.tsx` for interactivity. Auth/user state via `components/auth-context.tsx` (`useAuth()`), browser fetches via `lib/client.ts` (credentials + silent one-shot refresh on 401). Styling = prototype's inline-style objects + CSS custom properties in `app/globals.css` (do NOT convert to Tailwind classes — fidelity to the prototype is intentional).
- **Admin app**: fully client-side pages under `app/(panel)/<tab>/` (server `page.tsx` only for metadata) behind the client guard in `(panel)/layout.tsx`; the API is the real enforcement. Shared dark-theme widgets in `components/admin-ui.tsx` (AInput/AArea/ASelect/AToggle/ABtn/AModal/ACard — AModal closes on Esc). Last active tab is remembered via localStorage (`components/shell.tsx`).
- **Numbers/dates**: always Eastern-Arabic digits via `arNum()`/`arDate()` from each app's `lib/types.ts` (matches the prototype's `toLocaleString('ar-EG')`).

## Next.js 16 gotchas (both fronts)

`params`/`searchParams` are **Promises** (await them; `use()` in client components). `middleware.ts` is removed (route guards are client-side; the API is authoritative). `metadata` exports only in server components. npm `latest` for `next` points at a preview build — keep the apps pinned to stable (16.2.8).

## Language & design

Everything user-facing is Arabic, RTL (`lang="ar" dir="rtl"`), CSS logical properties. Fonts: Tajawal (UI) + Amiri (serif accents) via `next/font`. Tokens: navy `#0a1f36→#2d6189`, gold `#9c7322→#f4ead2`, creams `#faf6ee/#f3ecdf`, ink `#16202b/#41505f`, green `#3f7d5e`, danger `#b4452f`, radii 10/16/24/32, pill buttons, soft layered shadows. Keep Arabic copy byte-identical to the prototype unless fixing an actual error.

## Running the Prototype (reference only)

```bash
cd mohammed-haggag-courses_UI && python3 -m http.server 8080
# http://localhost:8080 — needs network for CDN React + fonts; admin: admin/admin123
```
