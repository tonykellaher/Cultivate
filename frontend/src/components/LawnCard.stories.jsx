import LawnCard from './LawnCard'

const meta = {
  title: 'Components/LawnCard',
  component: LawnCard,
}

export default meta

export const Default = {
  args: {
    task: {
      title: 'Overseed Thin Patches',
      description: 'Rake bare areas lightly to expose soil, broadcast seed at the recommended rate, and keep moist until germination.',
    },
  },
}

export const ShortDescription = {
  args: {
    task: {
      title: 'Apply Pre-Emergent',
      description: 'Apply before soil reaches 55°F to prevent crabgrass germination.',
    },
  },
}

export const LongDescription = {
  args: {
    task: {
      title: 'Aerate and Dethatch',
      description: 'Core aeration removes plugs of soil to reduce compaction and improve water, nutrient, and oxygen penetration to the root zone. Follow immediately with dethatching to remove the layer of dead grass and debris that blocks new growth. Best performed in early fall for cool-season grasses.',
    },
  },
}
