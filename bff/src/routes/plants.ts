import { Router, Request, Response } from 'express'
import { getPlantByTrefleId } from '../services/trefle'

const router = Router()

// GET /api/plants/:id  (id = Trefle numeric plant ID)
router.get('/:id', async (req: Request, res: Response) => {
  const trefleId = parseInt(req.params.id, 10)

  if (isNaN(trefleId)) {
    return res.status(400).json({ message: 'Plant ID must be a numeric Trefle ID' })
  }

  try {
    const plant = await getPlantByTrefleId(trefleId)
    res.json(plant)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Plant lookup failed'
    res.status(502).json({ message })
  }
})

export default router
