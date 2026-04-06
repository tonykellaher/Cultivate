import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import healthRouter from './routes/health'
import zoneRouter from './routes/zone'
import plantsRouter from './routes/plants'
import recommendationsRouter from './routes/recommendations'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}))
app.use(express.json())

app.use('/health', healthRouter)
app.use('/api/zone', zoneRouter)
app.use('/api/plants', plantsRouter)
app.use('/api/recommendations', recommendationsRouter)

app.listen(PORT, () => {
  console.log(`Cultivate BFF running on http://localhost:${PORT}`)
  console.log(`  /health`)
  console.log(`  /api/zone?zip=10001`)
  console.log(`  /api/recommendations?zip=10001`)
  console.log(`  /api/plants/:trefleId`)
})

export default app
