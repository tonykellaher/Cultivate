import axios from 'axios'
import { cache, TTL } from '../cache'
import type { ZoneTier, ZoneResult } from '../types/recommendations'
import zipZoneLookup from '../data/zip-zone-lookup.json'

const USDA_BASE = 'https://phzmapi.usda.gov'

/**
 * Maps a USDA zone string to an internal zone tier.
 * Zones 3–6 → cold | 7–8 → moderate | 9–10 → warm | 11+ → tropical
 */
export function zoneToTier(zone: string): ZoneTier {
  const num = parseFloat(zone) // "7a" → 7, "11b" → 11
  if (num <= 6)  return 'cold'
  if (num <= 8)  return 'moderate'
  if (num <= 10) return 'warm'
  return 'tropical'
}

/**
 * Returns the USDA hardiness zone string and coordinates for a given zip code.
 * Priority:
 *   1. Redis / in-memory cache
 *   2. Bundled zip-zone-lookup.json (~41k US zip codes from phzmapi.org)
 *   3. USDA Hardiness Zone API (live fallback for any gaps)
 */
export async function getZone(zip: string): Promise<ZoneResult> {
  const cacheKey = `zone:${zip}`
  const cached = await cache.get<ZoneResult>(cacheKey)
  if (cached) return cached

  // Bundled lookup — covers ~41k US zip codes, no network call required
  const bundled = (zipZoneLookup as Record<string, { zone: string; lat: number; lon: number }>)[zip]
  if (bundled) {
    const result: ZoneResult = { zone: bundled.zone, lat: bundled.lat, lon: bundled.lon }
    await cache.set(cacheKey, result, TTL.ZONE)
    return result
  }

  // Live API fallback for any zips not in the bundled dataset
  try {
    const { data } = await axios.get(`${USDA_BASE}/api/hardiness-zone/${zip}`, {
      timeout: 5000,
    })

    const zone = extractZone(data)
    const lat = data?.coordinates?.lat ? parseFloat(data.coordinates.lat) : undefined
    const lon = data?.coordinates?.lon ? parseFloat(data.coordinates.lon) : undefined

    const result: ZoneResult = { zone, lat, lon }
    await cache.set(cacheKey, result, TTL.ZONE)
    return result
  } catch {
    throw new Error(`Zone not found for zip: ${zip}`)
  }
}

function extractZone(data: unknown): string {
  if (typeof data !== 'object' || !data) throw new Error('Invalid USDA response')
  const d = data as Record<string, unknown>

  const zone = d['zone'] ?? d['hardiness_zone']
  if (typeof zone === 'string' && zone.length > 0) return zone

  throw new Error('USDA response did not contain a zone value')
}
