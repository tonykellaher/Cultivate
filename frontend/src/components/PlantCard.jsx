import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'

// Maps plant.type → MUI palette key
const TYPE_PALETTE_KEY = {
  vegetable: 'primary',
  herb:      'secondary',
  flower:    'success',
}

/**
 * Props:
 *   plant   — Plant object from BFF/mock response
 *   onClick — (plant: Plant) => void
 */
export default function PlantCard({ plant, onClick }) {
  const theme = useTheme()
  const paletteKey = TYPE_PALETTE_KEY[plant.type] || 'primary'
  const accentColor = theme.palette[paletteKey].main
  const typeLabel = plant.type.charAt(0).toUpperCase() + plant.type.slice(1)

  return (
    <Card
      component="article"
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
            {plant.name}
          </Typography>
          <Chip
            label={typeLabel}
            size="small"
            sx={{ backgroundColor: accentColor, color: '#fff', fontWeight: 500, ml: 1, flexShrink: 0 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
          {plant.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button
          variant="text"
          color="primary"
          size="small"
          onClick={() => onClick(plant)}
          aria-label={`View details for ${plant.name}`}
          sx={{ fontWeight: 700 }}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  )
}
