import { useState } from 'react'
import FilterTabs from './FilterTabs'

const meta = {
  title: 'Components/FilterTabs',
  component: FilterTabs,
}

export default meta

function Controlled({ initialTab = 0 }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  return <FilterTabs activeTab={activeTab} onChange={setActiveTab} />
}

export const AllSelected = {
  render: () => <Controlled initialTab={0} />,
}

export const VegetablesSelected = {
  render: () => <Controlled initialTab={1} />,
}

export const HerbsSelected = {
  render: () => <Controlled initialTab={2} />,
}

export const FlowersSelected = {
  render: () => <Controlled initialTab={3} />,
}
