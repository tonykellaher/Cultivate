# Cultivate — Current Task

> **Purpose:** Current objectives, active context, and clear next steps. This is the primary working guide.
> **Update:** After completing each task or subtask.
> **Last updated:** April 6, 2026

---

## Current Objective

**Deploy the staging environment.**

The frontend and BFF are both complete and wired together end-to-end with live API data. The immediate priority is deploying to Vercel (frontend) and Railway (BFF + Redis) so the app is accessible outside of localhost.

*References: `projectRoadmap.md` → Goal 6: Deployment & CI/CD*

---

## Active Context

### What's done
- Full React 18 + MUI 5 frontend at `frontend/` — wired to live BFF
- All core components: `AppBar`, `PlantCard`, `DetailDrawer`, `FilterTabs`, `LawnCard`, `SkeletonGrid`
- WCAG AA accessibility compliance across all components
- Node.js 20 + Express + TypeScript BFF at `bff/` — all endpoints live and tested
- USDA zone API integrated with 30-day in-memory cache + `zip-zone-lookup.json` fallback
- Trefle plant API integrated — curated content primary, Trefle enriches `trefleId` + `scientificName`
- Open-Meteo weather integrated with 2-hour cache — coordinates sourced from USDA response
- Full response contract confirmed end-to-end: zone, tier, plants, lawnTasks, weather
- `.env` files gitignored; `.env.example` committed for both frontend and BFF

### Known issue — Trefle name search accuracy
Trefle's `/plants/search?q=name` returns the first match by relevance, which is occasionally a wrong species (e.g. "Basil" matched "Clinopodium acinos" instead of "Ocimum basilicum"). This affects `scientificName` only — curated content (descriptions, care guides) is correct. Fix in Phase 2: map plant slugs to explicit Trefle IDs.

### Key constraints
- Trefle API free tier: 120 requests/minute. Caching is essential from day one.
- All API keys must be server-side only — never exposed to the frontend bundle.
- BFF must include static fallback files for both USDA and Trefle so the app degrades gracefully under API outages.

---

## Next Steps

### Step 1 — Deploy BFF to Railway
- [ ] Push repo to GitHub (if not already)
- [ ] Create Railway project, connect GitHub repo, set root to `bff/`
- [ ] Add Redis add-on in Railway dashboard
- [ ] Set environment variables: `TREFLE_API_KEY`, `REDIS_URL`, `FRONTEND_URL`, `PORT`
- [ ] Swap in-memory cache for ioredis client (`REDIS_URL` set → use Redis)
- [ ] Confirm `/health` endpoint responds on Railway URL

### Step 2 — Deploy frontend to Vercel
- [ ] Create Vercel project, connect GitHub repo, set root to `frontend/`
- [ ] Set environment variable: `VITE_API_URL` pointing to Railway BFF URL
- [ ] Confirm full flow: zip → zone → plants → drawer on Vercel staging URL

### Step 3 — Smoke test and Lighthouse
- [ ] Initialize Node.js 20 project with Express and TypeScript (`tsconfig`, `nodemon`, `ts-node`)
- [ ] Set up project structure:
  ```
  /bff
    /src
      /routes       # Express route handlers
      /services     # One file per upstream API (usda, trefle, weather)
      /cache        # Redis client + in-memory fallback
      /data         # Static fallback JSON files
      /types        # Shared TypeScript interfaces
    index.ts        # Express app entry point
  .env.example
  ```
- [ ] Add `.env.example` with required keys: `TREFLE_API_KEY`, `REDIS_URL`, `PORT`
- [ ] Confirm `.env` is in `.gitignore`

### Step 3 — Smoke test and Lighthouse
- [ ] Full end-to-end flow on staging: zip input → USDA → Trefle → Open-Meteo → rendered cards
- [ ] Run Lighthouse against staging URL — accessibility score must be ≥ 95

### Step 4 — Implement cache layer (production Redis)
- [ ] Create `cache/index.ts` that exports a unified `get(key)` / `set(key, value, ttl)` interface
- [ ] In production (`NODE_ENV=production`): connect to Redis via `ioredis`
- [ ] In development (`NODE_ENV=development`): use in-memory `Map` with TTL simulation
- [ ] Write unit tests for cache hit, cache miss, and TTL expiry behavior

### Step 3 — Implement USDA zone service
- [ ] Create `services/usda.ts`
- [ ] `GET https://phzmapi.usda.gov/api/hardiness-zone/{zip}` → returns `{ zone: "7a" }`
- [ ] Cache key pattern: `zone:{zip}` — TTL: 30 days
- [ ] Fallback: if API unavailable, resolve from bundled `data/zip-zone-lookup.json`
- [ ] Test with zip codes from all major zone tiers

### Step 4 — Implement Trefle plant service
- [ ] Create `services/trefle.ts`
- [ ] Query `https://trefle.io/api/v1/plants` with filters: `hardiness_zone_min`, `hardiness_zone_max`, `bloom_months`
- [ ] Normalize Trefle response to the `Plant` interface defined in `types/plant.ts`
- [ ] Merge curated content from `data/plant-content.json` into the normalized object
- [ ] Cache key pattern: `plants:{zone}:{month}` — TTL: 24 hours
- [ ] Fallback: if Trefle unavailable, serve from `data/plants-fallback.json`

### Step 5 — Implement Open-Meteo weather service
- [ ] Create `services/weather.ts`
- [ ] Resolve lat/lon from zip code (use a bundled zip-to-coords lookup or a free geocoding API)
- [ ] Query `https://api.open-meteo.com/v1/forecast` for current temp, precipitation, and frost risk
- [ ] Cache key pattern: `weather:{lat},{lon}` — TTL: 2 hours
- [ ] Normalize to a `WeatherContext` type: `{ tempF, frostRisk: boolean, precipitationPct }`

### Step 6 — Implement `/api/recommendations` endpoint
- [ ] Create `routes/recommendations.ts`
- [ ] Validate `zip` query param: must be 5-digit numeric string
- [ ] Orchestrate: USDA zone → Trefle plants → Open-Meteo weather (parallel where possible)
- [ ] Assemble unified response: `{ zone, tier, plants[], lawnTasks[], weather }`
- [ ] Return structured JSON error with `message` on any 4xx condition

### Step 7 — Implement remaining endpoints
- [ ] `GET /api/zone?zip=` — zone string only
- [ ] `GET /api/plants/:id` — single plant detail from Trefle + curated content
- [ ] `GET /health` — returns `{ status: "ok", timestamp }` for uptime monitoring

### Step 8 — Connect frontend to BFF
- [ ] Add Axios instance in frontend with `baseURL` pointing to BFF (env var: `VITE_API_URL`)
- [ ] Replace mock `lookup()` function with `axios.get('/api/recommendations', { params: { zip } })`
- [ ] Handle loading, error, and success states using existing skeleton/error UI
- [ ] Remove all inline mock data arrays from component file
- [ ] Confirm response shape matches existing `PlantCard` and `LawnCard` prop contracts

### Step 9 — Deploy staging environment
- [ ] Deploy BFF to Railway with Redis add-on provisioned
- [ ] Deploy frontend to Vercel with `VITE_API_URL` env var pointing to Railway staging URL
- [ ] Smoke test full flow: zip input → BFF → USDA + Trefle + Open-Meteo → rendered cards
- [ ] Run Lighthouse CI against staging URL

---

## Blockers & Open Questions

| Item | Owner | Notes |
|---|---|---|
| Trefle API key | Engineering | Sign up at trefle.io — free tier sufficient for MVP |
| Zip-to-coordinates lookup | Engineering | Decide between bundled CSV or lightweight geocoding API (e.g., Zippopotam.us — free, no auth) |
| Curated plant content | Design + Engineering | `plant-content.json` needs `howToPlant`, `careGuide`, `harvestTip` authored for all Trefle records returned by zone queries |
| Static fallback plant data | Engineering | Seed `plants-fallback.json` from a manual Trefle query run before launch |

---

## Reference

- Full architecture: `cultivate_technical_brief.md`
- All goals and phase tasks: `projectRoadmap.md`
- Technology decisions: `techStack.md`
- Component relationships and data flow: `codebaseSummary.md`
