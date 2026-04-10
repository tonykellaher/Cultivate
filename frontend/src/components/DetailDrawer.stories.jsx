import { useState } from 'react'
import Button from '@mui/material/Button'
import DetailDrawer from './DetailDrawer'

const meta = {
  title: 'Components/DetailDrawer',
  component: DetailDrawer,
}

export default meta

const tomatoPlant = {
  id: 'tomato',
  name: 'Tomato',
  type: 'vegetable',
  description: 'A warm-season staple that thrives in full sun with consistently moist, well-drained soil.',
  howToPlant: 'Start seeds indoors 6–8 weeks before last frost. Transplant when soil reaches 60°F, burying the stem up to the lowest leaves to encourage deep rooting.',
  careGuide: 'Water deeply 1–2 inches per week at the base. Stake or cage plants as they grow. Remove suckers for indeterminate varieties to focus energy on fruit production.',
  harvestTip: 'Pick when fully colored and slightly soft to the touch. Harvest regularly to encourage continued fruit production.',
  companionPlants: ['Basil', 'Marigold', 'Parsley'],
}

const basilPlant = {
  id: 'basil',
  name: 'Basil',
  type: 'herb',
  description: 'Fragrant annual herb that pairs perfectly with tomatoes. Grows best in warm soil with plenty of sun.',
  howToPlant: 'Direct sow seeds after last frost or transplant seedlings. Plant in well-drained soil with full sun exposure.',
  careGuide: 'Pinch flower buds as soon as they appear to extend the harvest season. Water regularly but avoid wetting the leaves.',
  harvestTip: 'Harvest from the top down, cutting just above a pair of leaves to encourage bushy growth.',
  companionPlants: ['Tomato', 'Pepper', 'Oregano'],
}

function InteractiveDrawer({ plant }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open {plant.name} Drawer
      </Button>
      <DetailDrawer plant={open ? plant : null} onClose={() => setOpen(false)} />
    </>
  )
}

export const Vegetable = {
  render: () => <InteractiveDrawer plant={tomatoPlant} />,
}

export const Herb = {
  render: () => <InteractiveDrawer plant={basilPlant} />,
}

export const Closed = {
  render: () => <DetailDrawer plant={null} onClose={() => {}} />,
}
