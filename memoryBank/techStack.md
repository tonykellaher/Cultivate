# Cultivate — Tech Stack

> **Purpose:** Key technology choices and architecture decisions with justifications.
> **Update:** When significant technology decisions are made or changed.
> **Last updated:** April 3, 2026

---

## Frontend

### Core Framework
- **React 18** — Component model, concurrent rendering, and hooks-based state management. Chosen for ecosystem maturity, MUI compatibility, and team familiarity. React 18's concurrent features (Suspense, transitions) are available for Phase 2 loading optimizations.

### UI Component Library
- **MUI (Material UI) v5** — Provides an accessible, production-grade component foundation. Key justifications:
  - WCAG AA compliance baked into core components (focus management, ARIA roles, keyboard patterns)
  - `createTheme()` system allows full visual customization without fighting component internals
  - `CardActionArea`, `Drawer`, `Tabs` all implement correct ARIA authoring patterns out of the box
  - Pinned to v5.x — major version upgrades planned as dedicated sprints

### Build Tooling
- **Vite 5** — Chosen over Create React App for significantly faster dev server HMR and optimized production bundles. Native ESM in development eliminates bundling overhead during iteration.

### Routing
- **React Router v6** — Client-side routing for future multi-page expansion (saved garden, user profile, zone explorer). Not actively used in MVP single-page layout but scaffolded to avoid refactoring cost later.

### HTTP Client
- **Axios 1.x** — Used for all BFF API calls. Chosen over native `fetch` for request/response interceptor support (global error handling, auth header injection in Phase 3) and cleaner async ergonomics.

### Typography
- **Lora** (Google Fonts) — Serif display font for all `h1`–`h6` headings. Selected for its organic, botanical quality that aligns with the Cultivate brand. Weights: 600 (regular), 700 (bold), 600 italic.
- **Inter** (Google Fonts) — Sans-serif for all UI text, body copy, labels, and captions. Selected for exceptional legibility at small sizes and strong support for numeric tabular data. Weights: 300, 400, 500, 600.

---

## Design System

### MUI Theme Tokens

| Token | Value | Contrast on White | Standard |
|---|---|---|---|
| `primary.main` | `#2D4A32` (Forest Green) | 7.2:1 | AAA |
| `secondary.main` | `#B85C2C` (Terracotta) | 4.6:1 | AA |
| `text.primary` | `#1A2420` | 16.1:1 | AAA |
| `text.secondary` | `#4A5E4D` | 5.1:1 | AA |
| `background.default` | `#F6F3EE` (Parchment) | — | — |
| `background.paper` | `#FDFCF9` (Off-white) | — | — |
| `success.main` | `#4A7850` | 4.8:1 | AA |

### Spacing & Shape
- Base border radius: `10px` (`theme.shape.borderRadius`)
- Card border radius: `12px` (component-level override)
- Drawer border radius: `16px 0 0 16px` (left-anchored panels)
- MUI default 8px spacing scale maintained

### Accessibility Baseline
- All color choices verified against WCAG 2.1 AA (4.5:1 normal text, 3:1 large text)
- No color used as the sole means of conveying information
- All interactive states (hover, focus, active, disabled) defined in theme, not ad hoc

---

## Backend for Frontend (BFF)

### Runtime & Framework
- **Node.js 20 LTS** — Long-term support version for production stability. Chosen for JavaScript/TypeScript consistency with the frontend team, reducing context-switching cost.
- **Express** — Lightweight, unopinionated HTTP framework. Sufficient for the BFF's orchestration-only role; no heavy ORM or full framework needed at MVP scale.
- **TypeScript** — Shared type interfaces between BFF and frontend (via a `types/` package) prevent data shape mismatches at the API boundary.

### Caching
- **Redis** (production) — In-memory data store for API response caching. Chosen for sub-millisecond read performance and native TTL support per key.
- **In-memory `Map`** (development) — Avoids Redis infrastructure requirement during local development. Cache interface is identical; only the backing store differs.

| Cache Key | TTL | Rationale |
|---|---|---|
| `zone:{zip}` | 30 days | USDA zones update annually at most |
| `plants:{zone}:{month}` | 24 hours | Seasonal data stable within a day |
| `weather:{lat},{lon}` | 2 hours | Conditions change but not minute-to-minute |
| `plant:{trefle_id}` | 7 days | Species data is stable |

---

## External APIs

### USDA Hardiness Zone API
- **Endpoint:** `https://phzmapi.usda.gov/api/hardiness-zone/{zip}`
- **Auth:** None required
- **Cost:** Free
- **Rate limits:** None documented
- **Fallback:** Bundled `zip-zone-lookup.json` (~43,000 US zip codes)
- **Decision:** Only authoritative source for USDA zone data. Zero cost and no auth make it ideal for MVP.

### Trefle API
- **Endpoint:** `https://trefle.io/api/v1/plants`
- **Auth:** API key (Bearer token)
- **Cost:** Free tier — 60 req/min
- **Rate limits:** 60 requests/minute on free plan
- **Fallback:** `plants-fallback.json` — static seed of representative plants per zone tier, manually curated from Trefle query results
- **Decision:** Most comprehensive freely accessible plant database with zone-aware filtering. Freemium tier sufficient for MVP with caching. Phase 2 plan: migrate to local PostgreSQL seed to eliminate dependency.

### Open-Meteo
- **Endpoint:** `https://api.open-meteo.com/v1/forecast`
- **Auth:** None required
- **Cost:** Free (open-source)
- **Rate limits:** Generous; not documented as restrictive
- **Fallback:** Weather context is supplementary. If unavailable, recommendations render without weather advisory overlay.
- **Decision:** Only free, no-auth weather API with frost risk data. Acceptable accuracy for advisory-level use (not precision forecasting).

---

## Hosting & Infrastructure

### Frontend — Vercel
- Zero-configuration deployment for React/Vite projects
- Automatic preview deployments on every pull request
- Environment variables managed per environment (staging vs. production)
- CDN edge delivery for static assets globally

### BFF — Railway
- Simple Node.js deployment with Redis add-on available in one click
- Automatic deploys from GitHub `main` branch
- Environment variable management with secret injection at runtime
- Built-in metrics and log streaming

### CI/CD — GitHub Actions
- Workflow triggers: pull request and merge to `main`
- Pipeline: lint → TypeScript type-check → unit tests → Lighthouse CI → deploy
- Lighthouse CI accessibility gate: score must be ≥ 95 to pass

---

## Testing

### Accessibility
- **axe-core** + `@axe-core/react` — Integrated into Vite dev build. Reports violations in the browser console during development.
- **Lighthouse CI** — Runs in GitHub Actions on every PR. Enforces accessibility score gate ≥ 95.
- **Manual testing:** VoiceOver (macOS/iOS) and NVDA (Windows) before each release.

### Unit & Integration (Planned)
- **Vitest** — Test runner aligned with Vite's toolchain. Planned for BFF service unit tests (cache behavior, API normalization, fallback logic).
- **React Testing Library** — Component testing for accessibility-focused assertions (role, label, keyboard interaction).

---

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| Apr 3, 2026 | Use MUI v5 over Tailwind | MUI provides accessible ARIA patterns and a theming system that matches our design-system-first approach. Tailwind would require building accessibility behaviors from scratch. |
| Apr 3, 2026 | BFF pattern over direct frontend API calls | Keeps API keys server-side, enables caching, and provides a stable contract the frontend consumes regardless of upstream changes. |
| Apr 3, 2026 | Trefle as primary plant data source | Only freely accessible plant API with zone-aware filtering. Rate limits manageable with caching. Fallback JSON mitigates reliability risk. |
| Apr 3, 2026 | Redis for caching over Cloudflare KV | Railway Redis add-on is simpler to provision alongside the BFF. Cloudflare KV is a Phase 2 option if edge caching becomes a priority. |
| Apr 3, 2026 | Lora + Inter for typography | Lora's organic serif quality fits the botanical brand. Inter is the strongest legible sans for dense UI data at small sizes. Avoids generic AI-default font choices (Space Grotesk, Roboto). |
| Apr 3, 2026 | Vercel for frontend hosting | Zero-config Vite/React support with automatic PR previews. Ideal for a design-engineering workflow where previewing visual changes quickly matters. |
