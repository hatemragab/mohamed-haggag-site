# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Haggag Academy** (منصة الأستاذ محمد حجاج التعليمية) — an Arabic, RTL-first e-learning platform for teaching Arabic, school curricula (UAE/Egypt/Azhar), Arabic for non-native speakers, and Quran.

**Current state:** the repo contains only a complete hi-fi prototype in `mohammed-haggag-courses_UI/`. The production monorepo described below has NOT been scaffolded yet. The prototype is the **single source of truth** for UI design, copy, data model, and admin workflows — recreate its look and behavior faithfully. Visual references live in `mohammed-haggag-courses_UI/screenshots/`.

## Running the Prototype

The prototype is a no-build React 18 app (UMD React + Babel standalone from CDN). Serve it statically — opening `index.html` via `file://` fails because Babel fetches the `.jsx` files:

```bash
cd mohammed-haggag-courses_UI && python3 -m http.server 8080
# open http://localhost:8080 — requires network for CDN React + Google Fonts
```

Prototype admin login: `admin` / `admin123` (route `adminLogin`; see `store.jsx ADMIN_CREDS`).

## Target Stack (to scaffold — non-negotiable)

- **Monorepo:** Turborepo + pnpm workspaces
- **`apps/api`:** NestJS 10 + Mongoose (MongoDB), TypeScript strict
- **`apps/web`:** Next.js 14+ (App Router, TypeScript, Tailwind CSS) — serves BOTH the public student site and the admin panel under `/admin`
- **`packages/shared`:** shared TypeScript types/DTOs + zod schemas used by both apps
- MongoDB via `docker-compose.yml` for local dev
- Auth: JWT access + refresh tokens (httpOnly cookies), roles: `student`, `admin`

Target getting-started flow (wire these up so they work): `pnpm i && docker compose up -d && pnpm seed && pnpm dev`. Public site on port 3000. Swagger at `/docs` on the API.

Build order: scaffold monorepo + schemas → API modules → public site → admin. Commit in logical steps.

## Prototype Architecture (how to read it)

No modules/imports — every file attaches its exports to `window`, and `index.html` loads scripts in strict dependency order: `data.jsx → store.jsx → components.jsx → page_home.jsx → page_courses.jsx → page_auth.jsx → page_misc.jsx → page_admin.jsx → page_admin_tabs.jsx → page_admin_tabs2.jsx → app.jsx`.

- **`data.jsx`** — all real content: `INSTRUCTOR`, `CATEGORIES` (6 categories with full level trees), `PLANS`, `CURRENCIES`, `TESTIMONIALS`, `FAQ`, `WHY`, `LEARN`, `ACCESS_STEPS`. Also `ytId()` (extracts 11-char YouTube id from any URL form), `ytThumb()`, and `genLessons()` (deterministic placeholder lesson generator; first lesson of each level is `free: true`).
- **`store.jsx`** — localStorage-backed admin "DB" (`mh_admin_db`, versioned with `DB_VERSION` + migration on load). `applyDB()` mutates the live `data.jsx` arrays in place; admin lesson edits override generated lessons via `window.__lessonsOverride` keyed by `catId|[groupId-]subId` (see `subKey`/`lessonsKey`). Sample students/payments for the admin tables live here.
- **`app.jsx`** — state-based router (no URL routing), route + user/unlocked/progress/continueWatching persisted in localStorage. Routes: home, courses, category, lesson, register, login, pricing, checkout, dashboard, about, faq, contact, terms, adminLogin, admin. Auth + admin pages render without Header/Footer. Purchase logic: monthly/bundle unlock `'all'`, single unlocks one category.
- **`components.jsx`** — shared Header/Footer/Icon/UI primitives.
- **`index.html`** — all design tokens as CSS custom properties in the `<style>` block, plus all responsive/media-query rules.
- Admin tabs (in `page_admin.jsx`): overview, cats, videos, content, testi, students, payments.

## Domain Model (Mongoose schemas)

Derive exact fields from `data.jsx` and `store.jsx`:

- **Category**: title, tagline, desc, glyph (single Arabic char), level enum (تأسيسي/مدرسي/أزهري/متدرّج/قرآني), optional `groups[]` (e.g. Azhar has المواد العربية/المواد الشرعية), each group/category has ordered **Levels** (sub-categories: title, note)
- **Lesson**: belongs to category+level, title, `youtubeId` (11-char, parsed from any YouTube URL form), durationMinutes, `free` boolean (first lesson of each level is a free preview), `order`
- **User**: name, email, passwordHash, phone?, role, unlockedCategories[] | 'all', progress (completed lessonIds), continueWatching (last 8: lessonId + timestamp)
- **Plan**: single / monthly / bundle with prices in AED, EGP, USD (see `PLANS`)
- **Order/Payment**: user, plan, categoryId?, amount, currency, status, provider (stub `paymob` + `stripe` adapters behind one `PaymentProvider` interface — no real keys yet, mock checkout that succeeds)
- **Testimonial**: name, role, text, `order` (first 3 shown on homepage)
- **SiteContent** (singleton): hero title/sub, instructor bio/credentials/stats — admin-editable

Seed script (`pnpm seed`) loads all real content from the prototype data files: 6 categories with their full level trees, plans, testimonials, FAQ, instructor info, plus an admin user.

## Core Business Rule: Video Delivery

All lessons are **unlisted YouTube videos** uploaded by the admin. The platform never stores video files.

- API stores only the validated 11-char `youtubeId`; accept full URLs and extract the id server-side (same regex as `ytId()` in `data.jsx`: `/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/`)
- Player page embeds `youtube-nocookie.com` with `rel=0&modestbranding=1`; poster image from `i.ytimg.com/vi/{id}/hqdefault.jpg`
- **Lesson access enforced server-side**: the API returns the youtubeId only if the lesson is free OR the user unlocked that category/plan. Never ship locked ids to the client. Cover this with an e2e test.

## Language & Design

- Entire product is **Arabic, RTL-first** (`lang="ar" dir="rtl"`). Use CSS logical properties everywhere. English only appears in code. Metadata + OG tags in Arabic.
- Fonts: **Tajawal** (UI) + **Amiri** (Quranic/serif accents) via `next/font`.
- Design tokens (extract into Tailwind theme; canonical values in `index.html` `:root`):
  - Navy scale: `#0a1f36, #0e2944, #143655, #1d4a6e, #2d6189`
  - Gold scale: `#9c7322, #bf9140, #d4ab5e, #ead9b3, #f4ead2`
  - Cream backgrounds: `#faf6ee, #f3ecdf`; ink text: `#16202b, #41505f`; green `#3f7d5e`; danger `#b4452f`
  - Radii 10/16/24/32px, pill buttons, soft layered shadows
- Admin panel uses the dark navy theme from the prototype (`#0a1f36` bg, `#0e2944` cards, gold accents).

## Public Site Pages (mirror prototype)

Home (hero, 4-stat strip, why, learn, courses grid, 4 steps, 3 testimonials, FAQ accordion, CTA) · Courses catalog with search + level filter · Category page (group tabs for Azhar, level accordions with lesson lists, lock/free badges, buy card with real price) · Lesson player (sidebar playlist, prev/next, mark complete) · Pricing (3 plans, currency switcher AED/EGP/USD) · Checkout (mock) · Auth pages (split layout with back-home link) · Student dashboard (stats, continue watching, my courses) · About / FAQ / Contact / Terms.

## Admin Panel (`/admin`, role-guarded — mirror prototype exactly)

Sidebar tabs: نظرة عامة (KPIs + revenue totals per currency + latest payments) · الأقسام والمستويات (CRUD + levels management modal) · **الفيديوهات والدروس** (cascading selectors category→group→level; lesson list with YouTube thumbnails, live link validation with thumbnail preview on paste, in-panel embed preview modal to test playback, up/down reordering, free toggle) · المحتوى العام (hero, instructor, stats, prices) · التقييمات (CRUD + ordering, first-3 badge) · الطلاب (search, status toggle) · المدفوعات. Esc closes modals; remember last active tab.

## Quality Bar

- NestJS: feature modules, DTO validation (class-validator), guards/decorators for roles, Swagger at `/docs`, e2e test for the lesson-access rule
- Next.js: server components for public pages (SEO), client components for interactive parts
- `.env.example` for both apps; README with the getting-started flow above
