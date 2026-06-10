# PROGRESS — Haggag Academy Build

Living checklist. Updated every work cycle.

## Phase 0 — Workspace
- [x] git init + baseline commit (prototype + CLAUDE.md)
- [x] PROGRESS.md / DECISIONS.md created
- [x] docker-compose.yml (MongoDB + mongo-express) up and healthy
- [x] `/api` scaffolded (NestJS CLI, pnpm)
- [x] `/web` scaffolded (Next.js App Router, TS, Tailwind, port 3000)
- [x] `/admin` scaffolded (Next.js App Router, TS, Tailwind, port 3001)
- [x] Root package.json convenience scripts (`seed`, `dev`)

## Phase 1 — API (NestJS + Mongoose, port 4000)
- [x] Config module + Mongo connection + CORS (3000/3001) + cookie-parser + validation pipe + Swagger /docs
- [x] Schemas: User, Category (embedded groups/levels), Lesson, Plan, Order, Testimonial, SiteContent
- [x] Auth: register/login/admin-login/refresh/logout/me — JWT access+refresh in httpOnly cookies, roles guard
- [x] Categories module (public read + admin CRUD + levels management)
- [x] Lessons module (public listing WITHOUT youtubeId, gated /watch, admin CRUD + reorder)
- [x] Plans module (public read + admin update)
- [x] Orders/Payments (PaymentProvider interface, paymob+stripe mock adapters, checkout flow, unlock logic, admin list)
- [x] Testimonials module (public read + admin CRUD + reorder)
- [x] SiteContent module (singleton: hero, instructor, why, learn, accessSteps, faq, contact, terms — public read + admin patch)
- [x] Students admin module (list/search/status toggle/add/delete)
- [x] Admin overview stats endpoint (KPIs + revenue per currency + latest payments)
- [x] Me module (progress toggle, continue-watching last 8, my unlocks)
- [x] Seed script: ALL prototype content (6 categories + full level trees + generated lessons + plans + testimonials + FAQ + site content + admin user)
- [x] `pnpm build` + lint clean

## Phase 2 — Web (public site, port 3000)
- [x] Design tokens, global CSS, Tajawal+Amiri via next/font, RTL layout, Arabic metadata/OG
- [x] Shared UI: Icon, Btn, Badge, Counter, Ornament, Header, Footer, CategoryCard, Field
- [x] API client + auth context (cookies, /auth/me)
- [x] Home (hero, stats, why, learn, courses grid, steps, testimonials, FAQ preview, CTA) — all from API
- [x] Courses catalog (search + level filter)
- [x] Category page (group tabs, level accordions, lock/free badges, buy card)
- [x] Lesson player (gated youtubeId fetch, sidebar playlist, prev/next, mark complete, continue-watching)
- [x] Pricing (3 plans, currency switcher) + Checkout (mock, processing→success) 
- [x] Auth pages (register/login split layout)
- [x] Student dashboard (stats, continue watching, my courses, suggestions)
- [x] About / FAQ / Contact / Terms — from API
- [x] `pnpm build` + lint clean

## Phase 3 — Admin (port 3001, dark navy)
- [x] Admin login (admin/admin123) + guard (client redirect + API role guard)
- [x] Shell: sidebar tabs, remember last tab, Esc closes modals, mobile topbar
- [x] Overview (KPIs, revenue per currency, latest payments, displayed stats)
- [x] Categories & levels (CRUD + levels modal incl. groups)
- [x] Videos & lessons (cascading selectors, thumbnails, live link validation + preview, embed playback modal, reorder, free toggle)
- [x] General content (hero, instructor, stats, prices, + NEW editors: FAQ, why-cards, learn list, access steps, contact info, terms)
- [x] Testimonials (CRUD + ordering + first-3 badge)
- [x] Students (search, status toggle, add, delete)
- [x] Payments (list, delete)
- [x] `pnpm build` + lint clean

## Phase 4 — Verification (Definition of Done)
- [x] `docker compose up -d` + `pnpm seed` + three dev servers boot, zero errors
- [x] All three `build` + lint pass, zero errors
- [x] Site renders 100% from API (no hardcoded content)
- [x] e2e: locked youtubeId never leaks; free + purchased lessons play
- [x] Mock checkout unlocks end-to-end; order appears in admin payments
- [x] Every content area editable in admin; edits reflect on site after refresh
- [x] Admin auth guards /admin (client + API)
- [x] Root README (architecture diagram, env vars, getting started)
- [x] Final commit

## Phase 5 — Production readiness
- [x] Browser console clean: zero errors/warnings across site + admin (strict Playwright audit incl. logged-in + admin interactive flows)
- [x] Fail-fast env validation in production (secrets, origins, Mongo URI)
- [x] Brute-force rate limiting on auth endpoints (verified: 11th login attempt → 429)
- [x] Helmet security headers, /health probe, graceful shutdown, TRUST_PROXY + SWAGGER_ENABLED + COOKIE_SAMESITE switches
- [x] Seed admin credentials from env (ADMIN_PASSWORD) + default-password warning
- [x] Dockerfiles (api/web/admin, multi-stage, non-root) + docker-compose.prod.yml + .env.prod.example
- [x] Web polish: favicon, robots.txt, dynamic sitemap, Arabic error + 404 pages
- [x] Admin polish: favicon, Arabic error + 404 pages
- [x] README production deployment section
