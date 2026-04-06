import type { Plant, LawnTask } from './plant'
import type { WeatherContext } from './weather'

export type ZoneTier = 'cold' | 'moderate' | 'warm' | 'tropical'

export interface ZoneResult {
  zone: string   // USDA zone string e.g. "7a"
  lat?: number
  lon?: number
}

export interface RecommendationsResponse {
  zone: string
  tier: ZoneTier
  plants: Plant[]
  lawnTasks: LawnTask[]
  weather: WeatherContext
}
