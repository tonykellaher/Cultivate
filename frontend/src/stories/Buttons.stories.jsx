import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import SearchIcon from '@mui/icons-material/Search'

const meta = {
  title: 'Components/Buttons',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
}

export default meta

const COLORS   = ['primary', 'secondary', 'success']
const VARIANTS = ['contained', 'outlined', 'text']

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
        <Button key={color} variant={variant} color={color} size="medium">
          {color.charAt(0).toUpperCase() + color.slice(1)}
        </Button>
      ))}
      <Button variant={variant} color="primary" disabled>
        Disabled
      </Button>
    </Box>
  )
}

export const AllButtons = {
  name: 'All Buttons',
  render: () => (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
        Buttons
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
          {['small', 'medium', 'large'].map((size) => (
            <Button key={size} variant="contained" color="primary" size={size}>
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </Button>
          ))}
        </Box>
      </Box>

      {/* With Icon */}
      <Box>
        <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
          With Icon
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant} color="primary" startIcon={<SearchIcon />}>
              Let's Grow
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  ),
}
