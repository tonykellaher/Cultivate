export interface Plant {
  id: string               // Internal slug e.g. "tomato"
  name: string
  type: 'vegetable' | 'herb' | 'flower'
  description: string
  howToPlant: string
  careGuide: string
  harvestTip: string
  companionPlants: string[]
  trefleId?: number        // Populated after Trefle enrichment; used for /api/plants/:id
  scientificName?: string  // Populated after Trefle enrichment
}

export interface LawnTask {
  id: string
  title: string
  description: string
}
