# Cultivate — Current Task

> **Purpose:** Current objectives, active context, and clear next steps. This is the primary working guide.
> **Update:** After completing each task or subtask.
> **Last updated:** April 7, 2026

---

## Current Objective

**Staging environment is live. Begin Phase 2 — Enrichment.**

Frontend is deployed on Vercel. BFF is deployed on Railway with Redis. Full end-to-end flow is confirmed working in production.

*References: `projectRoadmap.md` → Phase 2: Enrichment*

---

## Active Context

### What's done
- Full React 18 + MUI 5 frontend deployed to Vercel
- Node.js 20 + Express + TypeScript BFF deployed to Railway with Redis
- USDA zone lookup uses bundled ~41k zip dataset (phzmapi.org) — no external API dependency for zone resolution
- Trefle plant API integrated with curated content as primary source
- Open-Meteo weather integrated with 2-hour cache
- Full response contract confirmed end-to-end on staging: zone, tier, plants, lawnTasks, weather
- README.md written and committed

### Deployment details
- Frontend: Vercel (auto-deploys from GitHub main)
- BFF: Railway (auto-deploys from GitHub main)
- BFF URL: https://cultivate-production.up.railway.app
- Redis: Railway add-on, injected as REDIS_URL

### Known issues
- **Trefle name search accuracy** — Trefle's `/plants/search?q=name` occasionally returns a wrong species match. Affects `scientificName` only; curated content is correct. Fix in Phase 2: map plant slugs to explicit Trefle IDs.
- **USDA API blocked on Railway** — `phzmapi.usda.gov` is unreachable from Railway's network. Resolved by bundling the full zip dataset locally. Live API call is kept as a final fallback for any gaps.

### Key constraints
- Trefle API free tier: 120 requests/minute. Caching is essential.
- All API keys must be server-side only — never exposed to the frontend bundle.

---

## Next Steps

### Phase 2 — Enrichment priorities

1. **Trefle ID mapping** — Replace name-based search with explicit `trefleId` mappings in `plant-content.json` to fix scientific name accuracy
2. **Plant images** — Surface Trefle image URLs in `DetailDrawer` header
3. **axe-core integration** — Add `@axe-core/react` to Vite dev build for automated accessibility scanning
4. **GitHub Actions CI** — Lint → type-check → Lighthouse CI pipeline on every PR
5. **Expand lawn task library** — Cover all 12 months per zone tier (currently partial)
6. **Seasonal calendar view** — Monthly planting timeline per zone

---

## Blockers & Open Questions

| Item | Owner | Notes |
|---|---|---|
| Trefle ID mapping | Engineering | Need to manually map each plant slug to its correct Trefle ID |
| Plant images | Engineering | Trefle returns image URLs in species detail response — needs surfacing in DrawerDetail |
| Curated content expansion | Design + Engineering | `howToPlant`, `careGuide`, `harvestTip` coverage for all plant records |
