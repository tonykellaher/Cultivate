# Cultivate — Project Roadmap

> **Purpose:** High-level goals, features, completion criteria, and progress tracker.
> **Update:** When high-level goals change or tasks are completed.
> **Last updated:** April 3, 2026

---

## Overall Progress

| Phase | Status | Target |
|---|---|---|
| Phase 1 — MVP | 🟡 In Progress | Weeks 1–4 |
| Phase 2 — Enrichment | ⬜ Not Started | Weeks 5–8 |
| Phase 3 — Personalization | ⬜ Not Started | Weeks 9–16 |

---

## Goal 1: Establish Design System & Theme

Implement a fully custom MUI theme that embeds all Cultivate design tokens — color, typography, spacing, and component overrides — in a single `createTheme()` object. All components must derive their visual identity from the theme rather than inline styles.

### Completion Criteria
- All palette values, typography scales, and component variants defined in `theme.js`
- No hardcoded colors or font sizes outside of the theme file
- Theme passes WCAG AA contrast verification for all text/background pairings

### Tasks
- [x] Define primary and secondary color tokens (`#2D4A32`, `#B85C2C`)
- [x] Configure Lora (serif, headings) + Inter (sans, UI) typography scale
- [x] Override MUI component defaults: Button, Card, Tabs, TextField, Chip, Drawer
- [x] Verify all contrast ratios meet WCAG AA minimum (4.5:1 for normal text, 3:1 for large)
- [ ] Extract theme to standalone `src/theme/index.js` module
- [ ] Document all token decisions in `techStack.md`

---

## Goal 2: Core UI — Plant Recommendation Experience

Build the primary user-facing experience: zip code input, USDA zone resolution, plant card grid with filter tabs, and the detail drawer. This is the MVP's core value proposition.

### Completion Criteria
- User can enter a zip code and receive a list of zone-appropriate plants for the current month
- Plant cards are filterable by type (All, Vegetable, Herb, Flower)
- Each card opens a detail drawer with full planting and care information
- Fully responsive across mobile (320px+), tablet, and desktop
- Lighthouse accessibility score ≥ 95 on all views

### Tasks
- [x] AppBar with Cultivate wordmark and zip code search field
- [x] Zip code input with format validation and accessible error messaging
- [x] USDA zone pill display with `aria-live="polite"` announcement
- [x] Skeleton loading state with `aria-busy="true"`
- [x] Plant card grid — responsive, 1/2/4 column breakpoints
- [x] Filter tabs with ARIA tab pattern and `aria-controls` linking
- [x] `PlantCard` component with `CardActionArea` for keyboard/click activation
- [x] `DetailDrawer` — right-anchored, full content, focus management
- [x] Empty state for pre-search view
- [x] Wire `PlantCard` click to live BFF `/api/plants/:id` endpoint (currently mock data)
- [ ] Add plant images from Trefle API to `DetailDrawer` header
- [ ] Finalize companion planting data for all plant records

---

## Goal 3: Lawn Care Section

Surface secondary lawn care tasks below the plant grid, visually subordinate in the information hierarchy.

### Completion Criteria
- Three monthly lawn care tasks displayed per zone tier
- Tasks are visually de-emphasized relative to plant cards
- Section is fully keyboard accessible and screen reader labeled

### Tasks
- [x] `LawnCard` component with colored left-border accent
- [x] Responsive three-column grid (stacks to single column on mobile)
- [x] Section heading with `aria-labelledby` association
- [x] Wire to BFF `/api/recommendations` lawn tasks payload (currently mock data)
- [ ] Expand task library to cover all 12 months per zone tier

---

## Goal 4: Backend for Frontend (BFF)

Implement the Node.js/Express orchestration layer that aggregates USDA, Trefle, and Open-Meteo API calls into a single normalized response contract.

### Completion Criteria
- `/api/recommendations` returns a full payload in < 1.5s on 4G
- Redis caching active for all upstream calls with correct TTLs
- Static fallback files present for USDA and Trefle outage scenarios
- All API keys stored as environment variables, never committed to source

### Tasks
- [x] Scaffold Node.js 20 + Express project with TypeScript
- [x] Implement `/api/recommendations?zip=` endpoint
- [x] Implement `/api/zone?zip=` endpoint
- [x] Implement `/api/plants/:id` endpoint
- [x] Implement `/health` endpoint
- [x] Integrate USDA Hardiness Zone API with 30-day Redis cache
- [x] Integrate Trefle API with 24-hour Redis cache + static JSON fallback
- [x] Integrate Open-Meteo API with 2-hour Redis cache
- [x] Implement Redis cache layer (in-memory `Map` for dev environment)
- [ ] Cache warm-up script: pre-fetch all active zone/month combinations on deploy
- [ ] Bundled zip-to-zone lookup table (~43,000 zips) as USDA offline fallback
- [x] Structured JSON error responses with `message` field for frontend consumption
- [x] Environment variable configuration (`.env.example` committed, `.env` gitignored)

---

## Goal 5: Accessibility Compliance

Achieve and maintain WCAG 2.1 AA compliance across all views and interactions as a non-negotiable baseline.

### Completion Criteria
- axe-core reports zero violations in automated scans
- Lighthouse CI accessibility gate ≥ 95 on all PRs
- Manual VoiceOver and NVDA testing completed before each release

### Tasks
- [x] Semantic HTML structure: `header`, `main`, `section`, `article`
- [x] Correct heading hierarchy (`h1` → `h2`) throughout
- [x] `role="alert"` on all error messages
- [x] `aria-live="polite"` on dynamic content updates (zone pill, results)
- [x] `aria-hidden="true"` on all decorative elements
- [x] Focus management in `DetailDrawer` (open → close button; close → trigger card)
- [ ] Integrate axe-core into Vite dev build via `@axe-core/react`
- [ ] Configure Lighthouse CI in GitHub Actions with score gate ≥ 95
- [ ] Complete NVDA (Windows) manual test pass
- [ ] Complete VoiceOver (macOS + iOS) manual test pass

---

## Goal 6: Deployment & CI/CD

Deploy the frontend to Vercel and the BFF to Railway with automated CI/CD pipelines.

### Completion Criteria
- Staging environment live and accessible to team
- Production deploy triggered automatically on merge to `main`
- Lighthouse CI and axe-core run on every pull request

### Tasks
- [ ] Configure Vercel project for React frontend with environment variables
- [ ] Configure Railway project for Node.js BFF with Redis add-on
- [ ] Set up GitHub Actions workflow: lint → test → Lighthouse CI → deploy
- [ ] Configure staging environment with separate env vars from production
- [ ] Set up uptime monitoring on `/health` endpoint

---

## Phase 2 — Enrichment (Weeks 5–8)

*Planned. Not yet in active development.*

### Tasks
- [ ] Seasonal calendar view: monthly planting timeline per zone
- [ ] Search and filter by plant name, type, or difficulty
- [ ] Weather-aware advisories: frost warnings and drought alerts on plant cards
- [ ] Trefle plant images in `DetailDrawer` header
- [ ] Curated content expansion: complete `howToPlant`, `careGuide`, `harvestTip` for all records
- [ ] PostgreSQL seed database to replace Trefle API dependency at scale

---

## Phase 3 — Personalization (Weeks 9–16)

*Planned. Not yet in active development.*

### Tasks
- [ ] User authentication via Auth0 or Supabase Auth
- [ ] Saved plants: bookmark plants to a personal garden list
- [ ] Garden log: track planted date, location notes, and outcome status
- [ ] Push notifications: watering, harvest, and seasonal task reminders
- [ ] PostgreSQL database with Prisma ORM (tables: `users`, `saved_plants`, `garden_logs`)
- [ ] User profile page with saved zone and zip code preferences

---

## Scalability Considerations

- **BFF abstraction layer:** The frontend consumes a single `/api/recommendations` contract. Phase 3 database changes require zero frontend refactoring — the BFF adds persistence behind the same interface.
- **Plant data portability:** Curated content (care guides, companion planting) is stored in BFF-side JSON files, not locked to Trefle. Migrating to a PostgreSQL seed database in Phase 2 is a BFF-only change.
- **Cache architecture:** Redis key patterns (`zone:{zip}`, `plants:{zone}:{month}`) are designed to support multi-tenant use without key collisions as user volume grows.
- **MUI theme versioning:** Pinned to MUI 5.x. Major version upgrades are planned as dedicated sprints to avoid breaking theme token contracts mid-feature.

---

## Completed Tasks

> This section maintains a running history of completed work for project continuity.

### April 3, 2026
- Finalized application name: **Cultivate**
- Defined three-phase delivery plan (MVP → Enrichment → Personalization)
- Completed MUI `createTheme()` with full Cultivate design token set
- Implemented `AppBar` with zip code search, validation, and zone pill
- Implemented `PlantCard` grid with `CardActionArea` keyboard support
- Implemented `DetailDrawer` with focus management and full content sections
- Implemented `FilterTabs` with ARIA tab pattern
- Implemented `LawnCard` secondary section
- Implemented `SkeletonGrid` loading state
- Verified all WCAG AA contrast ratios (documented in `techStack.md`)
- Produced `cultivate_technical_brief.md` — full architecture reference document
- Produced `projectRoadmap.md`, `currentTask.md`, `techStack.md`, `codebaseSummary.md`
