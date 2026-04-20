import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

const meta = {
  title: 'Components/Chips',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
}

export default meta

const COLORS   = ['primary', 'secondary', 'success', 'default']
const VARIANTS = ['filled', 'outlined']

function Row({ variant }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Typography
        variant="caption"
        sx={{ width: 80, flexShrink: 0, color: 'text.secondary', fontWeight: 600, textTransform: 'capitalize' }}
      >
        {variant}
      </Typography>
      {COLORS.map((color) => (
        <Chip
          key={color}
          label={color.charAt(0).toUpperCase() + color.slice(1)}
          variant={variant}
          color={color}
          size="small"
        />
      ))}
      <Chip label="Disabled" variant={variant} disabled size="small" />
    </Box>
  )
}

export const AllChips = {
  name: 'All Chips',
  render: () => (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
        Chips
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {VARIANTS.map((variant) => (
          <Row key={variant} variant={variant} />
        ))}
      </Box>

      {/* Sizes */}
      <Box>
        <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
          Sizes
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {['small', 'medium'].map((size) => (
            <Chip key={size} label={size.charAt(0).toUpperCase() + size.slice(1)} color="primary" size={size} />
          ))}
        </Box>
      </Box>

      {/* Plant Type Labels */}
      <Box>
        <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
          Plant Type Labels
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Vegetable" size="small" sx={{ backgroundColor: '#1F5F5B', color: '#fff', fontWeight: 500 }} />
          <Chip label="Herb"      size="small" sx={{ backgroundColor: '#B85C2C', color: '#fff', fontWeight: 500 }} />
          <Chip label="Flower"    size="small" sx={{ backgroundColor: '#4B3869', color: '#fff', fontWeight: 500 }} />
          <Chip label="Zone"      size="small" sx={{ backgroundColor: '#2C4A6E', color: '#fff', fontWeight: 500 }} />
        </Box>
      </Box>
    </Box>
  ),
}
