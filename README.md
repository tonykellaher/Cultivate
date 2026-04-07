# Cultivate

A plant recommendation app that tells you what to grow right now based on your USDA hardiness zone, the current month, and local weather conditions.

Enter a zip code. Get a curated list of plants to start this month, full care guides on demand, and lawn care tasks for your zone — all from a single API call.

---

## Features

- **Zone-aware recommendations** — resolves your USDA hardiness zone from any US zip code
- **Seasonal plant list** — curated plants filtered by zone tier and current month
- **Detail drawer** — planting depth, spacing, watering schedule, care guide, and harvest tips per plant
- **Lawn care section** — three monthly tasks for your zone tier, displayed below the plant grid
- **Weather context** — Open-Meteo frost risk and precipitation data overlaid on recommendations
- **Filter tabs** — filter the plant grid by type: All, Vegetable, Herb, Flower
- **Graceful degradation** — static fallback data for USDA and Trefle outages; weather is supplementary and omitted if unavailable
- **WCAG AA compliant** — all color contrasts verified, full keyboard navigation, screen reader tested

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, MUI v5, Vite 5, React Router v6, Axios |
| BFF | Node.js 20, Express, TypeScript |
| Caching | Redis (production), in-memory Map (development) |
| Plant data | Trefle API + curated `plant-content.json` |
| Zone data | USDA Hardiness Zone API + `zip-zone-lookup.json` fallback |
| Weather | Open-Meteo API |
| Hosting | Vercel (frontend), Railway (BFF + Redis) |

Typography: **Lora** (headings) + **Inter** (UI text) via Google Fonts.

---

## Project Structure

```
cultivate/
├── frontend/               # React 18 + MUI + Vite SPA
│   ├── src/
│   │   ├── theme/          # MUI createTheme() — all design tokens
│   │   ├── components/     # AppBar, PlantCard, DetailDrawer, FilterTabs, LawnCard, SkeletonGrid
│   │   ├── pages/          # Home.jsx — main page, owns all state
│   │   └── api/            # Axios instance configured from VITE_API_URL
│   └── .env.example
│
└── bff/                    # Node.js 20 + Express BFF
    ├── src/
    │   ├── routes/         # recommendations, zone, plants, health
    │   ├── services/       # usda.ts, trefle.ts, weather.ts
    │   ├── cache/          # Redis (prod) / in-memory Map (dev)
    │   ├── data/           # zip-zone-lookup.json, plant-content.json, lawn-content.json
    │   └── types/          # Shared TypeScript interfaces
    └── .env.example
```

---

## Local Development

### Prerequisites

- Node.js 20+
- A [Trefle API key](https://trefle.io) (free tier)

### BFF

```bash
cd bff
cp .env.example .env        # add your TREFLE_API_KEY
npm install
npm run dev                 # starts on http://localhost:3001
```

### Frontend

```bash
cd frontend
cp .env.example .env        # set VITE_API_URL=http://localhost:3001
npm install
npm run dev                 # starts on http://localhost:5173
```

Visit `http://localhost:5173`, enter any US zip code, and the full flow runs against live APIs.

---

## Environment Variables

### BFF (`bff/.env`)

| Variable | Required | Description |
|---|---|---|
| `TREFLE_API_KEY` | Yes | Trefle API bearer token |
| `REDIS_URL` | No | Redis connection string — omit to use in-memory cache |
| `FRONTEND_URL` | No | Allowed CORS origin (e.g. `https://your-app.vercel.app`) |
| `PORT` | No | Server port (defaults to `3001`) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | BFF base URL (e.g. `https://your-bff.railway.app`) |

---

## API Endpoints

All endpoints are served from the BFF.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/recommendations?zip=XXXXX` | Full payload: zone, tier, plants, lawnTasks, weather |
| `GET` | `/api/zone?zip=XXXXX` | Zone string only (e.g. `"7a"`) |
| `GET` | `/api/plants/:trefleId` | Single plant detail |
| `GET` | `/health` | `{ status: "ok", timestamp }` for uptime monitoring |

### Response shape — `/api/recommendations`

```json
{
  "zone": "7a",
  "tier": "mid",
  "plants": [
    {
      "id": "tomato",
      "name": "Tomato",
      "type": "Vegetable",
      "trefleId": 134755,
      "scientificName": "Solanum lycopersicum",
      "description": "...",
      "plantingDepth": "1/4 inch",
      "spacing": "24–36 inches",
      "wateringSchedule": "1–2 inches per week",
      "careGuide": "...",
      "harvestTip": "...",
      "companionPlants": ["Basil", "Marigold"],
      "accentColor": "#B85C2C"
    }
  ],
  "lawnTasks": [
    {
      "title": "Overseed thin patches",
      "description": "...",
      "accentColor": "#2D4A32"
    }
  ],
  "weather": {
    "tempF": 62,
    "frostRisk": false,
    "precipitationPct": 20
  }
}
```

---

## Caching

| Key pattern | TTL | Reason |
|---|---|---|
| `zone:{zip}` | 30 days | USDA zones update annually |
| `plants:{zone}:{month}` | 24 hours | Seasonal data stable within a day |
| `plant:{trefleId}` | 7 days | Species records are stable |
| `weather:{lat},{lon}` | 2 hours | Conditions change, not minute-to-minute |

In development (no `REDIS_URL`), caching uses an in-memory `Map` with TTL simulation — same interface, no Redis required.

---

## Deployment

### BFF — Railway

1. Create a Railway project, connect your GitHub repo, set the root directory to `bff/`
2. Add the Redis add-on from the Railway dashboard
3. Set environment variables: `TREFLE_API_KEY`, `FRONTEND_URL`
4. Railway injects `REDIS_URL` automatically from the Redis add-on
5. Confirm `/health` responds on your Railway URL

### Frontend — Vercel

1. Create a Vercel project, connect your GitHub repo, set the root directory to `frontend/`
2. Set `VITE_API_URL` to your Railway BFF URL
3. Deploy — full flow should work end-to-end

---

## Known Limitations (Phase 1)

- **Trefle name matching** — Trefle's search returns the first relevance match, which is occasionally a wrong species (affects `scientificName` only; curated content is always correct). Fix planned for Phase 2: map plant slugs to explicit Trefle IDs.
- **Zip coverage** — USDA fallback covers ~55 major US metros. Full ~43k zip coverage requires the complete lookup table (planned).
- **Plant images** — Trefle image URLs not yet surfaced in the `DetailDrawer` header (Phase 2).
