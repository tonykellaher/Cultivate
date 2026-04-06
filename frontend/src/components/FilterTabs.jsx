import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

const TABS = [
  { label: 'All',        value: 'all' },
  { label: 'Vegetables', value: 'vegetable' },
  { label: 'Herbs',      value: 'herb' },
  { label: 'Flowers',    value: 'flower' },
]

/**
 * Props:
 *   activeTab  — number (0–3)
 *   onChange   — (newIndex: number) => void
 */
export default function FilterTabs({ activeTab, onChange }) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => onChange(newValue)}
        aria-label="Filter plants by type"
        textColor="primary"
        indicatorColor="primary"
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            id={`tab-${tab.value}`}
            aria-controls="tabpanel-plants"
          />
        ))}
      </Tabs>
    </Box>
  )
}
