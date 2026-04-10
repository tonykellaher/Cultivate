import PlantCard from './PlantCard'

const meta = {
  title: 'Components/PlantCard',
  component: PlantCard,
  args: {
    onClick: () => {},
  },
}

export default meta

const basePlant = {
  id: 'tomato',
  name: 'Tomato',
  type: 'vegetable',
  description: 'A warm-season staple that thrives in full sun. Start indoors 6–8 weeks before last frost and transplant once soil reaches 60°F.',
  scientificName: 'Solanum lycopersicum',
  companionPlants: ['Basil', 'Marigold'],
}

export const Vegetable = {
  args: {
    plant: { ...basePlant },
  },
}

export const Herb = {
  args: {
    plant: {
      ...basePlant,
      id: 'basil',
      name: 'Basil',
      type: 'herb',
      description: 'Fragrant annual herb that pairs perfectly with tomatoes. Pinch flowers to extend the harvest season.',
      scientificName: 'Ocimum basilicum',
    },
  },
}

export const Flower = {
  args: {
    plant: {
      ...basePlant,
      id: 'marigold',
      name: 'Marigold',
      type: 'flower',
      description: 'Hardy annual with bright orange blooms that repel pests and attract pollinators throughout the season.',
      scientificName: 'Tagetes erecta',
    },
  },
}

export const LongDescription = {
  args: {
    plant: {
      ...basePlant,
      description:
        'A warm-season staple that thrives in full sun with consistently moist, well-drained soil. Requires staking as plants mature. Start seeds indoors 6–8 weeks before last frost, harden off for 7–10 days, and transplant once soil temperature reaches 60°F. Water deeply at the base to prevent blight.',
    },
  },
}
