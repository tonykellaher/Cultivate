import axios from 'axios'
import { cache, TTL } from '../cache'
import type { Plant } from '../types/plant'
import type { ZoneTier } from '../types/recommendations'
import plantContent from '../data/plant-content.json'

const TREFLE_BASE = 'https://trefle.io/api/v1'

/**
 * Returns the curated plant list for a given zone tier and month,
 * enriched with Trefle scientific names and IDs where available.
 *
 * Architecture note: Our curated plant-content.json is the source of truth
 * for which plants are recommended (ensures content quality and reliability).
 * Trefle is used as a best-effort enrichment layer — if it is unavailable,
 * the curated data is returned as-is with no user-visible degradation.
 */
export async function getPlantsForTier(tier: ZoneTier, month: string): Promise<Plant[]> {
  const cacheKey = `plants:${tier}:${month}`
  const cached = await cache.get<Plant[]>(cacheKey)
  if (cached) return cached

  const content = plantContent as Record<string, Record<string, Plant[]>>
  // Fall back to april if month data not yet authored
  const plants: Plant[] = content[tier]?.[month] ?? content[tier]?.['april'] ?? []

  const enriched = await enrichWithTrefle(plants)
  await cache.set(cacheKey, enriched, TTL.PLANTS)
  return enriched
}

/**
 * Fetches full Trefle plant detail by Trefle numeric ID.
 * Used by the /api/plants/:id endpoint for the detail drawer (Phase 2 images etc.).
 */
export async function getPlantByTrefleId(trefleId: number): Promise<Record<string, unknown>> {
  const cacheKey = `plant:${trefleId}`
  const cached = await cache.get<Record<string, unknown>>(cacheKey)
  if (cached) return cached

  const token = process.env.TREFLE_API_KEY
  if (!token) throw new Error('TREFLE_API_KEY not configured')

  const { data } = await axios.get(`${TREFLE_BASE}/plants/${trefleId}`, {
    params: { token },
    timeout: 6000,
  })

  const plant = data.data as Record<string, unknown>
  await cache.set(cacheKey, plant, TTL.SPECIES)
  return plant
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * For each plant in the curated list, attempts a Trefle name search to
 * populate trefleId and scientificName. Failures are silently swallowed —
 * the plant is returned unchanged if enrichment cannot be completed.
 *
 * Rate limit awareness: one Trefle request per unique plant name.
 * Results are cached for 7 days so the free tier (60 req/min) is
 * only stressed on cold-cache first runs.
 */
async function enrichWithTrefle(plants: Plant[]): Promise<Plant[]> {
  const token = process.env.TREFLE_API_KEY
  if (!token) return plants

  return Promise.all(plants.map((plant) => enrichSingle(plant, token)))
}

async function enrichSingle(plant: Plant, token: string): Promise<Plant> {
  const cacheKey = `trefle:name:${plant.name.toLowerCase()}`
  const cached = await cache.get<Pick<Plant, 'trefleId' | 'scientificName'>>(cacheKey)
  if (cached) return { ...plant, ...cached }

  try {
    const { data } = await axios.get(`${TREFLE_BASE}/plants/search`, {
      params: { q: plant.name, token },
      timeout: 4000,
    })

    const match = (data.data as Array<Record<string, unknown>>)?.[0]
    if (match) {
      const enrichment = {
        trefleId: match['id'] as number,
        scientificName: match['scientific_name'] as string,
      }
      await cache.set(cacheKey, enrichment, TTL.SPECIES)
      return { ...plant, ...enrichment }
    }
  } catch {
    // Non-critical — return plant from curated data without enrichment
  }

  return plant
}
