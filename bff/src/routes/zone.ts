import { Router, Request, Response } from 'express'
import { getZone, zoneToTier } from '../services/usda'

const router = Router()

// GET /api/zone?zip=10001
router.get('/', async (req: Request, res: Response) => {
  const { zip } = req.query

  if (!zip || !/^\d{5}$/.test(zip as string)) {
    return res.status(400).json({ message: 'zip must be a 5-digit numeric string' })
  }

  try {
    const { zone } = await getZone(zip as string)
    const tier = zoneToTier(zone)
    res.json({ zone, tier })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Zone lookup failed'
    res.status(502).json({ message })
  }
})

export default router
