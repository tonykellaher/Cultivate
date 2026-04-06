import axios from 'axios'
import { cache, TTL } from '../cache'
import type { Plant } from '../types/plant'
import type { ZoneTier } from '../types/recommendations'
import plantContent from '../data/plant-content.json'

const TREFLE_BASE = 'https://trefle.io/api/v1'

// One request per second keeps us at 60/min — the plan maximum.
const TREFLE_REQUEST_INTERVAL_MS = 1000

/**
 * Returns the curated plant list for a given zone tier and month,
 * enriched with Trefle scientific names and IDs where available.
 *
 * Architecture: curated plant-content.json is the source of truth for
 * recommendations. Trefle is a best-effort enrichment layer — if unavailable,
 * curated data is returned unchanged with no user-visible degradation.
 */
export async function getPlantsForTier(tier: ZoneTier, month: string): Promise<Plant[]> {
  const cacheKey = `plants:${tier}:${month}`
  const cached = await cache.get<Plant[]>(cacheKey)
  if (cached) return cached

  const content = plantContent as Record<string, Record<string, Plant[]>>
  // Fall back to april if month data not yet authored
  const plants: Plant[] = content[tier]?.[month] ?? content[tier]?.['april'] ?? []

  const enriched = await enrichSequentially(plants)
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

/**
 * Pre-warms the Trefle enrichment cache for every plant in plant-content.json.
 * Called once at server startup — spaces requests 1 second apart so the burst
 * of cold-cache calls never exceeds the 60 req/min plan limit.
 *
 * With ~17 unique plants, warm-up completes in ~17 seconds. After that,
 * all enrichment is served from cache (7-day TTL) with zero Trefle calls.
 */
export async function warmTrefleCache(): Promise<void> {
  const token = process.env.TREFLE_API_KEY
  if (!token) return

  const content = plantContent as Record<string, Record<string, Plant[]>>
  const allPlants = Object.values(content).flatMap((months) => Object.values(months).flat())
  const unique = [...new Map(allPlants.map((p) => [p.name, p])).values()]

  console.log(`Trefle: warming cache for ${unique.length} plants (~${unique.length}s)...`)

  for (const plant of unique) {
    await enrichSingle(plant, token)
    await sleep(TREFLE_REQUEST_INTERVAL_MS)
  }

  console.log('Trefle: cache warm-up complete')
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Enriches plants one at a time. Sequential — never more than one
 * in-flight Trefle request at a time, eliminating burst risk.
 * Cache hits skip the request entirely, so warm-cache runs are instant.
 */
async function enrichSequentially(plants: Plant[]): Promise<Plant[]> {
  const token = process.env.TREFLE_API_KEY
  if (!token) return plants

  const results: Plant[] = []
  for (const plant of plants) {
    results.push(await enrichSingle(plant, token))
  }
  return results
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
