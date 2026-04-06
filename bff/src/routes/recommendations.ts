import { Router, Request, Response } from 'express'
import { getZone, zoneToTier } from '../services/usda'
import { getPlantsForTier } from '../services/trefle'
import { getWeather } from '../services/weather'
import type { LawnTask } from '../types/plant'
import type { RecommendationsResponse } from '../types/recommendations'
import lawnContent from '../data/lawn-content.json'

const router = Router()

// GET /api/recommendations?zip=10001
router.get('/', async (req: Request, res: Response) => {
  const { zip } = req.query

  if (!zip || !/^\d{5}$/.test(zip as string)) {
    return res.status(400).json({ message: 'zip must be a 5-digit numeric string' })
  }

  try {
    const { zone, lat, lon } = await getZone(zip as string)
    const tier = zoneToTier(zone)
    const month = currentMonth()

    // Run plant and weather lookups in parallel — zone is required for both
    const [plants, weather] = await Promise.all([
      getPlantsForTier(tier, month),
      getWeather(lat, lon),
    ])

    const lawnTasks = getLawnTasks(tier)

    const response: RecommendationsResponse = { zone, tier, plants, lawnTasks, weather }
    res.json(response)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load recommendations'
    res.status(502).json({ message })
  }
})

function currentMonth(): string {
  return new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase()
}

function getLawnTasks(tier: string): LawnTask[] {
  return (lawnContent as Record<string, LawnTask[]>)[tier] ?? []
}

export default router
