# PROGRESS — Haggag Academy Build

Living checklist. Updated every work cycle.

## Phase 0 — Workspace
- [x] git init + baseline commit (prototype + CLAUDE.md)
- [x] PROGRESS.md / DECISIONS.md created
- [ ] docker-compose.yml (MongoDB + mongo-express) up and healthy
- [ ] `/api` scaffolded (NestJS CLI, pnpm)
- [ ] `/web` scaffolded (Next.js App Router, TS, Tailwind, port 3000)
- [ ] `/admin` scaffolded (Next.js App Router, TS, Tailwind, port 3001)
- [ ] Root package.json convenience scripts (`seed`, `dev`)

## Phase 1 — API (NestJS + Mongoose, port 4000)
- [ ] Config module + Mongo connection + CORS (3000/3001) + cookie-parser + validation pipe + Swagger /docs
- [ ] Schemas: User, Category (embedded groups/levels), Lesson, Plan, Order, Testimonial, SiteContent
- [ ] Auth: register/login/admin-login/refresh/logout/me — JWT access+refresh in httpOnly cookies, roles guard
- [ ] Categories module (public read + admin CRUD + levels management)
- [ ] Lessons module (public listing WITHOUT youtubeId, gated /watch, admin CRUD + reorder)
- [ ] Plans module (public read + admin update)
- [ ] Orders/Payments (PaymentProvider interface, paymob+stripe mock adapters, checkout flow, unlock logic, admin list)
- [ ] Testimonials module (public read + admin CRUD + reorder)
- [ ] SiteContent module (singleton: hero, instructor, why, learn, accessSteps, faq, contact, terms — public read + admin patch)
- [ ] Students admin module (list/search/status toggle/add/delete)
- [ ] Admin overview stats endpoint (KPIs + revenue per currency + latest payments)
- [ ] Me module (progress toggle, continue-watching last 8, my unlocks)
- [ ] Seed script: ALL prototype content (6 categories + full level trees + generated lessons + plans + testimonials + FAQ + site content + admin user)
- [ ] `pnpm build` + lint clean

## Phase 2 — Web (public site, port 3000)
- [ ] Design tokens, global CSS, Tajawal+Amiri via next/font, RTL layout, Arabic metadata/OG
- [ ] Shared UI: Icon, Btn, Badge, Counter, Ornament, Header, Footer, CategoryCard, Field
- [ ] API client + auth context (cookies, /auth/me)
- [ ] Home (hero, stats, why, learn, courses grid, steps, testimonials, FAQ preview, CTA) — all from API
- [ ] Courses catalog (search + level filter)
- [ ] Category page (group tabs, level accordions, lock/free badges, buy card)
- [ ] Lesson player (gated youtubeId fetch, sidebar playlist, prev/next, mark complete, continue-watching)
- [ ] Pricing (3 plans, currency switcher) + Checkout (mock, processing→success) 
- [ ] Auth pages (register/login split layout)
- [ ] Student dashboard (stats, continue watching, my courses, suggestions)
- [ ] About / FAQ / Contact / Terms — from API
- [ ] `pnpm build` + lint clean

## Phase 3 — Admin (port 3001, dark navy)
- [ ] Admin login (admin/admin123) + guard (client redirect + API role guard)
- [ ] Shell: sidebar tabs, remember last tab, Esc closes modals, mobile topbar
- [ ] Overview (KPIs, revenue per currency, latest payments, displayed stats)
- [ ] Categories & levels (CRUD + levels modal incl. groups)
- [ ] Videos & lessons (cascading selectors, thumbnails, live link validation + preview, embed playback modal, reorder, free toggle)
- [ ] General content (hero, instructor, stats, prices, + NEW editors: FAQ, why-cards, learn list, access steps, contact info, terms)
- [ ] Testimonials (CRUD + ordering + first-3 badge)
- [ ] Students (search, status toggle, add, delete)
- [ ] Payments (list, delete)
- [ ] `pnpm build` + lint clean

## Phase 4 — Verification (Definition of Done)
- [ ] `docker compose up -d` + `pnpm seed` + three dev servers boot, zero errors
- [ ] All three `build` + lint pass, zero errors
- [ ] Site renders 100% from API (no hardcoded content)
- [ ] e2e: locked youtubeId never leaks; free + purchased lessons play
- [ ] Mock checkout unlocks end-to-end; order appears in admin payments
- [ ] Every content area editable in admin; edits reflect on site after refresh
- [ ] Admin auth guards /admin (client + API)
- [ ] Root README (architecture diagram, env vars, getting started)
- [ ] Final commit
