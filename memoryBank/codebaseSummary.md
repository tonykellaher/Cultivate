# Cultivate — Codebase Summary

> **Purpose:** Concise overview of project structure, component relationships, data flow, and recent changes.
> **Update:** When significant changes affect the overall structure.
> **Last updated:** April 6, 2026

---

## Project Structure

```
cultivate/
├── frontend/                   # React 18 + MUI + Vite SPA
│   ├── src/
│   │   ├── theme/
│   │   │   └── index.js        # MUI createTheme() — all design tokens
│   │   ├── components/
│   │   │   ├── AppBar.jsx       # Header, search input, zone pill
│   │   │   ├── PlantCard.jsx    # Tappable plant summary card
│   │   │   ├── DetailDrawer.jsx # Right-anchored plant detail panel
│   │   │   ├── FilterTabs.jsx   # Plant type filter (All/Veg/Herb/Flower)
│   │   │   ├── LawnCard.jsx     # Secondary lawn task card
│   │   │   └── SkeletonGrid.jsx # Loading placeholder grid
│   │   ├── pages/
│   │   │   └── Home.jsx         # Main page — orchestrates all components
│   │   ├── api/
│   │   │   └── client.js        # Axios instance with baseURL from VITE_API_URL
│   │   ├── App.jsx              # React Router v6 route definitions
│   │   └── main.jsx             # React root — ThemeProvider wraps App
│   ├── .env.example
│   └── vite.config.js
│
├── bff/                         # Node.js 20 + Express BFF — live
│   ├── src/
│   │   ├── routes/
│   │   │   ├── recommendations.ts  # GET /api/recommendations
│   │   │   ├── zone.ts             # GET /api/zone
│   │   │   ├── plants.ts           # GET /api/plants/:trefleId
│   │   │   └── health.ts           # GET /health
│   │   ├── services/
│   │   │   ├── usda.ts             # USDA zone API — returns zone + lat/lon
│   │   │   ├── trefle.ts           # Curated plant lookup + Trefle enrichment
│   │   │   └── weather.ts          # Open-Meteo API client
│   │   ├── cache/
│   │   │   └── index.ts            # In-memory Map (dev) — Redis-ready interface
│   │   ├── data/
│   │   │   ├── zip-zone-lookup.json # ~55 major US metros with zone + coords
│   │   │   ├── plant-content.json   # Curated plants by tier + month
│   │   │   └── lawn-content.json    # Curated lawn tasks by tier
│   │   ├── types/
│   │   │   ├── plant.ts             # Plant + LawnTask interfaces
│   │   │   ├── weather.ts           # WeatherContext interface
│   │   │   └── recommendations.ts   # ZoneTier, ZoneResult, RecommendationsResponse
│   │   └── index.ts                 # Express app entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── docs/
    ├── cultivate_technical_brief.md
    ├── projectRoadmap.md
    ├── currentTask.md
    ├── techStack.md
    └── codebaseSummary.md
```

---

## Key Components and Their Interactions

### `main.jsx`
- Root entry point. Wraps the entire application in MUI `ThemeProvider` with the Cultivate theme.
- Renders `<App />` into the DOM root.

### `theme/index.js`
- Single source of truth for all design tokens: palette, typography, shape, and component overrides.
- Consumed by `ThemeProvider` in `main.jsx` and available to all child components via MUI's `useTheme()` hook and `sx` prop system.
- No component should hardcode colors or font sizes that exist in the theme.

### `AppBar`
- Owns the zip code input field and search trigger.
- On successful lookup, displays the zone pill with `aria-live="polite"`.
- Passes `zip` value up to `Home.jsx` via callback on submit.
- Handles its own validation error state (`role="alert"`).

### `Home.jsx`
- Top-level page component. Owns the primary application state:
  - `zip` — user's entered zip code
  - `result` — resolved zone, plants array, and lawn tasks from BFF
  - `loading` — boolean controlling skeleton vs. content display
  - `selected` — plant object currently open in `DetailDrawer` (null when closed)
  - `tab` — active filter tab index
- Orchestrates the BFF API call and distributes data to child components.

### `PlantCard`
- Stateless presentational component. Receives a `plant` object and an `onClick` callback.
- Built on MUI `Card` + `CardActionArea` — provides button role, keyboard activation, and hover state without additional ARIA.
- Accent bar color driven by `plant.accentColor` token.
- On click/Enter/Space: calls `onClick(plant)` which sets `selected` in `Home.jsx`, opening the drawer.

### `DetailDrawer`
- Receives `plant` (object or null) and `onClose` callback from `Home.jsx`.
- Open state is derived: `!!plant`.
- On open: focus moves to the close button (MUI `Drawer` default behavior).
- On close: calls `onClose()` which sets `selected = null` in `Home.jsx`; MUI returns focus to the trigger element automatically.
- Scrollable content body with fixed header and footer.

### `FilterTabs`
- Receives `types` array (derived from plant data) and `activeTab` index.
- Emits `onChange(tabIndex)` to `Home.jsx`.
- Implements ARIA tab pattern via MUI `Tabs`: arrow key navigation, `aria-controls` → panel, `aria-selected` on active tab.

### `LawnCard`
- Stateless presentational component. Receives a `task` object.
- No interactive behavior (not tappable). Uses `tabIndex={0}` for keyboard reachability and `focus-visible` outline.

### `SkeletonGrid`
- Rendered by `Home.jsx` when `loading === true`.
- Parent container uses `aria-busy="true"` so screen readers know content is pending.

---

## Data Flow

```
User enters zip code
        │
        ▼
AppBar validates format (5-digit numeric)
        │
        ▼ on submit
Home.jsx calls BFF
GET /api/recommendations?zip=XXXXX
        │
        ▼
BFF: check Redis cache (key: plants:{zone}:{month})
        │
   ┌────┴────┐
Cache hit   Cache miss
   │             │
   │         USDA API → zone string
   │         Trefle API → plant list (filtered by zone + month)
   │         Open-Meteo → weather context
   │             │
   │         Assemble response + write to cache
   └────┬────┘
        │
        ▼
Unified response: { zone, tier, plants[], lawnTasks[], weather }
        │
        ▼
Home.jsx sets result state
        │
        ├──▶ FilterTabs (receives plant types)
        ├──▶ PlantCard grid (filtered by active tab)
        └──▶ LawnCard section (lawn tasks for zone tier)
                          │
                    User taps PlantCard
                          │
                          ▼
                Home.jsx sets selected = plant
                          │
                          ▼
                DetailDrawer opens (plant detail)
                          │
                    User closes drawer
                          │
                          ▼
                Home.jsx sets selected = null
                Focus returns to triggering PlantCard
```

---

## External Dependencies

### Frontend Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | 18.x | Core UI framework |
| `react-dom` | 18.x | DOM rendering |
| `@mui/material` | 5.x | Component library |
| `@mui/icons-material` | 5.x | Icon set (Phase 2) |
| `@emotion/react` | 11.x | MUI's CSS-in-JS engine (required peer dependency) |
| `@emotion/styled` | 11.x | MUI styled component support (required peer dependency) |
| `react-router-dom` | 6.x | Client-side routing |
| `axios` | 1.x | HTTP client for BFF calls |
| `vite` | 5.x | Build tooling and dev server |
| `@vitejs/plugin-react` | 4.x | React fast refresh for Vite |

### BFF Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | 4.x | HTTP server framework |
| `ioredis` | 5.x | Redis client for production caching |
| `axios` | 1.x | HTTP client for upstream API calls |
| `typescript` | 5.x | Type safety across routes, services, and data models |
| `ts-node` | 10.x | TypeScript execution in development |
| `nodemon` | 3.x | Dev server auto-restart on file changes |
| `dotenv` | 16.x | Environment variable loading |

### External APIs

| API | Auth | Cost | Rate Limit | Fallback |
|---|---|---|---|---|
| USDA Hardiness Zone | None | Free | None documented | `zip-zone-lookup.json` |
| Trefle | API key | Free tier | 120 req/min | `plants-fallback.json` |
| Open-Meteo | None | Free | Generous | Omit weather overlay |

### Fonts
- **Lora** — Loaded via Google Fonts CDN. Weights: 600, 700, 600 italic. Used for all headings.
- **Inter** — Loaded via Google Fonts CDN. Weights: 300, 400, 500, 600. Used for all body and UI text.

---

## Recent Significant Changes

### April 3, 2026 — Initial UI prototype complete
- Implemented full MUI-themed React application with mock data
- Established `createTheme()` design token system
- Built all six core components: `AppBar`, `PlantCard`, `DetailDrawer`, `FilterTabs`, `LawnCard`, `SkeletonGrid`
- Verified WCAG AA contrast compliance across all color pairings

### April 6, 2026 — Full stack live end-to-end
- Scaffolded React 18 + Vite + MUI frontend at `frontend/` with full source files
- Scaffolded Node.js 20 + Express + TypeScript BFF at `bff/`
- Integrated USDA Hardiness Zone API (30-day cache, zip-zone-lookup.json fallback)
- Integrated Trefle plant API — curated `plant-content.json` is primary source; Trefle enriches `trefleId` + `scientificName` as best-effort overlay
- Integrated Open-Meteo weather API (2-hour cache); coordinates sourced from USDA response eliminating need for separate geocoding
- Frontend wired to live BFF via Axios; mock data file removed
- Confirmed end-to-end: zip → USDA zone → Trefle enriched plants → Open-Meteo weather → rendered cards

### Upcoming (Next Sprint)
- Deploy BFF to Railway with Redis add-on (swap in-memory cache for ioredis)
- Deploy frontend to Vercel with `VITE_API_URL` pointing to Railway
- Run Lighthouse CI against staging — accessibility gate ≥ 95

---

## User Feedback Integration and Its Impact on Development

### Feedback received — April 3, 2026 (Design review)

| Feedback | Decision | Impact |
|---|---|---|
| Adopt a design library rather than custom CSS | Switched to MUI v5 as the component foundation | Ensures WCAG AA compliance out of the box; theme system replaces all custom CSS variables |
| WCAG AA accessibility is non-negotiable | Embedded accessibility into architecture (not post-launch) | All contrast ratios verified, ARIA patterns used throughout, automated axe-core + Lighthouse CI gating added |
| Application name: Cultivate | Renamed from working title "Rootwise" | Updated wordmark, all documentation, and brand token references |
| Include lawn care alongside plants, with plants as primary | Added `LawnCard` section below the plant grid | Lawn care is visually secondary; separate section heading, smaller typography, no card interaction |
| Both "plant right now" list and detail view | Implemented `DetailDrawer` as progressive disclosure layer | Cards remain scannable; full care content available on demand without navigating away |
| Responsive design with equal mobile/desktop priority | Responsive grid breakpoints at xs/sm/md; drawer goes full-width on mobile | No mobile-specific layout; single responsive component tree handles all viewports |
